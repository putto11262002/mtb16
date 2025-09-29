import type { Faker } from "@faker-js/faker";
import { faker } from "@faker-js/faker";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { TEMP_DIR } from "./index";
import { mockFileCache, type MockFileCache } from "./mock-file-cache";
import { AnnouncementsSeeder } from "./seeders/announcements";
import { DirectorySeeder } from "./seeders/directory";
import { NewsSeeder } from "./seeders/news";
import { PersonsSeeder } from "./seeders/persons";
import { down, up } from "./utils";

export interface Seed {
  up({
    faker,
    fileCache,
    count,
  }: {
    faker: Faker;
    fileCache: MockFileCache;
    count: number;
  }): Promise<string[]>;
  down({ ids }: { ids: string[] }): Promise<void>;
  name(): string;
}

class UnifiedSeeder {
  private seeders: Map<string, Seed> = new Map();

  constructor() {
    this.register(new AnnouncementsSeeder());
    this.register(new DirectorySeeder());
    this.register(new NewsSeeder());
    this.register(new PersonsSeeder());
  }

  private register(seeder: Seed) {
    this.seeders.set(seeder.name(), seeder);
  }

  private getTempFile(name: string): string {
    return path.join(TEMP_DIR, `seeded_${name}.json`);
  }

  async up(resource: string, count: number): Promise<void> {
    if (resource === "all") {
      for (const seeder of this.seeders.values()) {
        await this.up(seeder.name(), count);
      }
      return;
    }

    const seeder = this.seeders.get(resource);
    if (!seeder) {
      throw new Error(`Unknown resource: ${resource}`);
    }

    const tempFile = this.getTempFile(resource);
    await up(
      () => seeder.up({ faker, fileCache: mockFileCache, count }),
      tempFile,
    );
  }

  async down(resource: string): Promise<void> {
    if (resource === "all") {
      for (const seeder of this.seeders.values()) {
        await this.down(seeder.name());
      }
      return;
    }

    const seeder = this.seeders.get(resource);
    if (!seeder) {
      throw new Error(`Unknown resource: ${resource}`);
    }

    const tempFile = this.getTempFile(resource);
    await down((ids) => seeder.down({ ids }), tempFile);
  }

  async status(): Promise<void> {
    console.log("Seeding Status:");
    for (const [name, seeder] of this.seeders) {
      const tempFile = this.getTempFile(name);
      let count = 0;
      if (existsSync(tempFile)) {
        const data = await readFile(tempFile, "utf-8");
        const ids: string[] = JSON.parse(data);
        count = ids.length;
      }
      console.log(`${name}: ${count} records`);
    }
  }
}

// CLI
function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error(
      "Usage: seed <resource|all> <up|down> [--count N] | seed status",
    );
    process.exit(1);
  }

  if (args[0] === "status") {
    return { command: "status" };
  }

  if (args.length < 2) {
    console.error(
      "Usage: seed <resource|all> <up|down> [--count N] | seed status",
    );
    process.exit(1);
  }

  const resource = args[0];
  const command = args[1];
  let count = 10; // default

  for (let i = 2; i < args.length; i++) {
    if (args[i] === "--count" && i + 1 < args.length) {
      const num = parseInt(args[i + 1], 10);
      if (!isNaN(num) && num > 0) {
        count = num;
      }
      i++;
    }
  }

  return { resource, command, count };
}

async function main() {
  const args = parseArgs();
  const seeder = new UnifiedSeeder();

  try {
    if (args.command === "status") {
      await seeder.status();
    } else if (args.command === "up") {
      await seeder.up(args.resource!, args.count!);
    } else if (args.command === "down") {
      await seeder.down(args.resource!);
    } else {
      console.error("Invalid command. Use 'up', 'down', or 'status'.");
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
