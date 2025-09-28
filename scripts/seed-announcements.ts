import { annouyncementsUsecase } from "@/core/announcement/usecase";
import { faker } from "@faker-js/faker";
import * as path from "node:path";
import { TEMP_DIR } from "scripts";
import { getCachedAvatar } from "./mock-file-cache";
import { down, parseArgs, up } from "./utils";

const TEMP_FILE_NAME = "seeded_announcements.json";
const TEMP_FILE = path.join(TEMP_DIR, TEMP_FILE_NAME);

const TAGS = [
  "ข่าวสาร",
  "ประกาศ",
  "กิจกรรม",
  "ประชุม",
  "อบรม",
  "รางวัล",
  "ประกวด",
  "ทุนการศึกษา",
];

async function seedAnnouncements(count: number): Promise<string[]> {
  console.log(`Seeding ${count} mock announcements...`);

  // Process each announcement fully concurrently, generating data inside each promise
  const promises = Array.from({ length: count }, async () => {
    const title = faker.lorem.sentence({ min: 3, max: 10 }).slice(0, 30); // ensure max 30 chars
    const body = faker.lorem.paragraphs({ min: 1, max: 5 }).slice(0, 5000); // optional, max 5000
    const tags = faker.helpers.arrayElements(TAGS, { min: 0, max: 3 });

    try {
      const result = await annouyncementsUsecase.create({
        title,
        body,
        tags: tags.length > 0 ? tags : undefined,
      });

      const file = await getCachedAvatar();
      await annouyncementsUsecase.updatePreviewImage({
        id: result.id,
        file,
      });

      await annouyncementsUsecase.publish(result.id);

      console.log(`Created announcement: "${title}" with ID: ${result.id}`);
      return result.id;
    } catch (error) {
      console.error(`Failed to create announcement: "${title}"`, error);
      return null;
    }
  });

  const ids = (await Promise.all(promises)).filter(
    (id): id is string => id !== null,
  );

  console.log("Seeding completed.");
  return ids;
}

async function removeAnnouncements(ids: string[]) {
  console.log(`Removing ${ids.length} announcements...`);

  const promises = ids.map(async (id) => {
    try {
      await annouyncementsUsecase.deleteAnnouncement({ id });
      console.log(`Deleted announcement with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to delete announcement with ID: ${id}`, error);
    }
  });

  await Promise.all(promises);

  console.log("Removal completed.");
}

// Run the command
const { command, n } = parseArgs();
if (command === "up") {
  up(() => seedAnnouncements(n), TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else if (command === "down") {
  down(removeAnnouncements, TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  console.error("Invalid command. Use 'up' or 'down'.");
}
