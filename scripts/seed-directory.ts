import { directoryUsecase } from "@/core/directory/usecase";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import * as path from "node:path";
import { TEMP_DIR } from "scripts";
import { getCachedAvatar } from "./image-cache";
import { down, parseArgs, up } from "./utils";

const TEMP_FILE_NAME = "seeded_directory.json";
const TEMP_FILE = path.join(TEMP_DIR, TEMP_FILE_NAME);

async function seedDirectory(count: number): Promise<string[]> {
  console.log(`Seeding ${count} mock directory entries...`);

  // Process each entry fully concurrently, generating data inside each promise
  const promises = Array.from({ length: count }, async () => {
    const name = faker.person.fullName().slice(0, 255); // ensure max 255 chars
    const link = faker.internet.url();
    const phone = faker.helpers.maybe(() => faker.phone.number(), {
      probability: 0.7,
    });
    const email = faker.helpers.maybe(() => faker.internet.email(), {
      probability: 0.8,
    });
    const notes = faker.helpers.maybe(
      () => faker.lorem.sentences(2).slice(0, 1000),
      { probability: 0.5 },
    );
    const tag = faker.helpers.arrayElement([
      "บุคลากร",
      "หน่วยงาน",
      "บริการ",
      "ติดต่อ",
      undefined,
    ]);

    try {
      const result = await directoryUsecase.create({
        name,
        link,
        phone,
        email,
        notes,
        tag: tag === undefined ? undefined : tag,
      });

      // Optionally add an image
      if (faker.datatype.boolean({ probability: 0.6 })) {
        const file = await getCachedAvatar();
        await directoryUsecase.updateImage({ id: result.id, file });
      }

      console.log(`Created directory entry: "${name}" with ID: ${result.id}`);
      return result.id;
    } catch (error) {
      console.error(`Failed to create directory entry: "${name}"`, error);
      return null;
    }
  });

  const ids = (await Promise.all(promises)).filter(
    (id): id is string => id !== null,
  );

  console.log("Seeding completed.");
  return ids;
}

async function removeDirectory(ids: string[]) {
  console.log(`Removing ${ids.length} directory entries...`);

  const promises = ids.map(async (id) => {
    try {
      await directoryUsecase.deleteEntry({ id });
      console.log(`Deleted directory entry with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to delete directory entry with ID: ${id}`, error);
    }
  });

  await Promise.all(promises);

  console.log("Removal completed.");
}

// Run the command
const { command, n } = parseArgs();
if (command === "up") {
  up(() => seedDirectory(n), TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else if (command === "down") {
  down(removeDirectory, TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  console.error("Invalid command. Use 'up' or 'down'.");
}
