import { personUsecase } from "@/core/person/usecase";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import * as path from "node:path";
import { TEMP_DIR } from "scripts";
import { getCachedAvatar } from "./mock-file-cache";
import { down, parseArgs, up } from "./utils";

const TEMP_FILE_NAME = "seeded_persons.json";
const TEMP_FILE = path.join(TEMP_DIR, TEMP_FILE_NAME);

async function seedPersons(count: number): Promise<string[]> {
  console.log(`Seeding ${count} mock persons...`);

  const ranks = ["พลเอก", "พันเอก", "ร้อยเอก", "ร้อยโท"];
  const roles = [
    "ผู้บัญชาการ",
    "รองผู้บัญชาการ",
    "หัวหน้าหน่วย",
    "ผู้ช่วยหัวหน้าหน่วย",
  ];

  // Generate hierarchical structure:
  // Level 0: 1 person
  // Level 1: min(2, remaining)
  // Level 2: remaining
  let level0 = 1;
  let level1 = Math.min(2, count - level0);
  let level2 = count - level0 - level1;

  const persons = [];

  // Level 0
  for (let i = 0; i < level0; i++) {
    persons.push({
      name: faker.person.fullName(),
      rank: ranks[0], // พลเอก
      role: roles[0], // ผู้บัญชาการ
      level: 0,
      order: i + 1,
    });
  }

  // Level 1
  for (let i = 0; i < level1; i++) {
    persons.push({
      name: faker.person.fullName(),
      rank: ranks[1], // พันเอก
      role: roles[1], // รองผู้บัญชาการ
      level: 1,
      order: i + 1,
    });
  }

  // Level 2
  for (let i = 0; i < level2; i++) {
    const rank = faker.helpers.arrayElement(ranks.slice(2)); // ร้อยเอก or ร้อยโท
    const role = rank === "ร้อยเอก" ? "หัวหน้าหน่วย" : "ผู้ช่วยหัวหน้าหน่วย";
    persons.push({
      name: faker.person.fullName(),
      rank,
      role,
      level: 2,
      order: i + 1,
    });
  }

  // Process each person fully concurrently
  const promises = persons.map(async (person) => {
    try {
      const result = await personUsecase.create(person);
      const file = await getCachedAvatar();
      await personUsecase.updatePortrait({ id: result.id, file });

      console.log(`Created person: ${person.name} with ID: ${result.id}`);
      return result.id;
    } catch (error) {
      console.error(`Failed to create person: ${person.name}`, error);
      return null;
    }
  });

  const ids = (await Promise.all(promises)).filter(
    (id): id is string => id !== null,
  );

  console.log("Seeding completed.");
  return ids;
}

async function removePersons(ids: string[]) {
  console.log(`Removing ${ids.length} persons...`);

  const promises = ids.map(async (id) => {
    try {
      await personUsecase.deletePerson({ id });
      console.log(`Deleted person with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to delete person with ID: ${id}`, error);
    }
  });

  await Promise.all(promises);

  console.log("Removal completed.");
}

// Run the command
const { command, n } = parseArgs();
if (command === "up") {
  up(() => seedPersons(n), TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else if (command === "down") {
  down(removePersons, TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  console.error("Invalid command. Use 'up' or 'down'.");
}
