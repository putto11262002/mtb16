import { existsSync, mkdirSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import * as path from "node:path";

export function ensureExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function createDummyFile(
  filePath: string,
  content: string,
  mimeType: string,
): Promise<File> {
  await writeFile(filePath, content);
  const buffer = Buffer.from(content);
  return new File([buffer], path.basename(filePath), { type: mimeType });
}

export const fileFromURL = async (url: string): Promise<File> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch file from URL: ${url}; status: ${response.status}`,
    );
  }
  const blob = await response.blob();
  return new File([blob], path.basename(url), { type: blob.type });
};

export function parseArgs() {
  const args = process.argv.slice(2);
  let command = "up"; // default
  let n = 40; // default

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "up" || args[i] === "down") {
      command = args[i];
    } else if (args[i] === "-n" && i + 1 < args.length) {
      const num = parseInt(args[i + 1], 10);
      if (!isNaN(num) && num > 0) {
        n = num;
      }
      i++; // skip next
    }
  }

  return { command, n };
}

export async function up(
  seedFn: () => Promise<string[]>,
  tempFile: string,
): Promise<void> {
  const ids = await seedFn();
  let existingIds: string[] = [];

  if (existsSync(tempFile)) {
    const data = await readFile(tempFile, "utf-8");
    existingIds = JSON.parse(data);
  }

  await writeFile(tempFile, JSON.stringify([...existingIds, ...ids], null, 2));
  console.log(`IDs written to ${tempFile}`);
}

export async function down(
  removeFn: (ids: string[]) => Promise<void>,
  tempFile: string,
): Promise<void> {
  if (!existsSync(tempFile)) {
    console.log(`Temp file ${tempFile} does not exist. Nothing to remove.`);
    return;
  }

  const data = await readFile(tempFile, "utf-8");
  const ids: string[] = JSON.parse(data);
  await removeFn(ids);
  await unlink(tempFile);
}
