import { directoryUsecase } from "@/core/directory/usecase";
import type { Faker } from "@faker-js/faker";
import type { MockFileCache } from "scripts/mock-file-cache";
import type { Seed } from "../seed";

export class DirectorySeeder implements Seed {
  async up({
    faker,
    fileCache,
    count,
  }: {
    faker: Faker;
    fileCache: MockFileCache;
    count: number;
  }): Promise<string[]> {
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
          const file = await fileCache.getRandomCachedFile("avatar");
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

  async down({ ids }: { ids: string[] }): Promise<void> {
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

  name(): string {
    return "directory";
  }
}
