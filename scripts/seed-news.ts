import { newsUsecase } from "@/core/news/usecase";
import { faker } from "@faker-js/faker";
import "dotenv/config";
import { randomInt } from "node:crypto";
import * as path from "node:path";
import { TEMP_DIR } from "scripts";
import { getCachedAvatar, getCachedPicsum } from "./image-cache";
import { down, parseArgs, up } from "./utils";

const TEMP_FILE_NAME = "seeded_news.json";
const TEMP_FILE = path.join(TEMP_DIR, TEMP_FILE_NAME);

async function seedNews(count: number): Promise<string[]> {
  console.log(`Seeding ${count} mock news...`);

  // Process each news fully concurrently, generating data inside each promise
  const promises = Array.from({ length: count }, async () => {
    const title = faker.lorem.sentence({ min: 1, max: 1 }).slice(0, 100); // ensure max 100 chars
    const body = faker.lorem.paragraphs({ min: 1, max: 5 }).slice(0, 5000); // optional, max 5000
    const numAdditionalImages = randomInt(1, 4);

    try {
      const result = await newsUsecase.create({ title, body });

      const file = await getCachedAvatar();
      await newsUsecase.updatePreviewImage({ id: result.id, file });

      await Promise.all(
        Array.from({ length: numAdditionalImages }, async () => {
          const imgFile = await getCachedPicsum();
          await newsUsecase.addAttachment({ id: result.id, file: imgFile });
        }),
      );

      await newsUsecase.publish(result.id);

      console.log(`Created news: "${title}" with ID: ${result.id}`);
      return result.id;
    } catch (error) {
      console.error(`Failed to create news: "${title}"`, error);
      return null;
    }
  });

  const ids = (await Promise.all(promises)).filter(
    (id): id is string => id !== null,
  );

  console.log("Seeding completed.");
  return ids;
}

async function removeNews(ids: string[]) {
  console.log(`Removing ${ids.length} news...`);

  const promises = ids.map(async (id) => {
    try {
      await newsUsecase.deleteNews({ id });
      console.log(`Deleted news with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to delete news with ID: ${id}`, error);
    }
  });

  await Promise.all(promises);

  console.log("Removal completed.");
}

// Run the command
const { command, n } = parseArgs();
if (command === "up") {
  up(() => seedNews(n), TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else if (command === "down") {
  down(removeNews, TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  console.error("Invalid command. Use 'up' or 'down'.");
}
