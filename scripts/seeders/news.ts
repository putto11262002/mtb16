import { newsUsecase } from "@/core/news/usecase";
import type { Faker } from "@faker-js/faker";
import { randomInt } from "node:crypto";
import type { ImageCache } from "../image-cache";
import type { Seed } from "../seed";

export class NewsSeeder implements Seed {
  async up({
    faker,
    fileCache,
    count,
  }: {
    faker: Faker;
    fileCache: ImageCache;
    count: number;
  }): Promise<string[]> {
    console.log(`Seeding ${count} mock news...`);

    // Process each news fully concurrently, generating data inside each promise
    const promises = Array.from({ length: count }, async () => {
      const title = faker.lorem.sentence({ min: 1, max: 1 }).slice(0, 100); // ensure max 100 chars
      const body = faker.lorem.paragraphs({ min: 1, max: 5 }).slice(0, 5000); // optional, max 5000
      const numAdditionalImages = randomInt(1, 4);

      try {
        const result = await newsUsecase.create({ title, body });

        const file = await fileCache.getRandomCachedImage("avatar");
        await newsUsecase.updatePreviewImage({ id: result.id, file });

        await Promise.all(
          Array.from({ length: numAdditionalImages }, async () => {
            const imgFile = await fileCache.getRandomCachedImage("picsum");
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

  async down({ ids }: { ids: string[] }): Promise<void> {
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

  name(): string {
    return "news";
  }
}
