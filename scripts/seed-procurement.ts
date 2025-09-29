import { procurementUsecase } from "@/core/procurement/usecase";
import { faker } from "@faker-js/faker";
import * as path from "node:path";
import { TEMP_DIR } from "scripts";
import { getCachedPdf } from "./mock-file-cache";
import { down, parseArgs, up } from "./utils";

const TEMP_FILE_NAME = "seeded_procurements.json";
const TEMP_FILE = path.join(TEMP_DIR, TEMP_FILE_NAME);

async function seedProcurements(count: number): Promise<string[]> {
  console.log(`Seeding ${count} mock procurements...`);

  // Process each procurement fully concurrently, generating data inside each promise
  const promises = Array.from({ length: count }, async () => {
    const title = faker.lorem.sentence({ min: 3, max: 5 }).slice(0, 255); // ensure max 255 chars
    const status = faker.helpers.arrayElement(["open", "closed"]);
    const date = faker.date.past({ years: 5 }); // past 5 years
    const year = date.getFullYear();
    const details = faker.lorem.sentences({ min: 1, max: 3 }).slice(0, 5000); // optional, max 5000

    try {
      const result = await procurementUsecase.create({
        title,
        status,
        date,
        year,
        details,
      });

      // Randomly add docs
      const docPromises = [];
      if (Math.random() < 0.6) {
        // 60% chance
        const files = [await getCachedPdf()];
        docPromises.push(
          procurementUsecase.updateInvitationDocs({ id: result.id, files }),
        );
      }
      if (Math.random() < 0.4) {
        // 40% chance
        const files = [await getCachedPdf()];
        docPromises.push(
          procurementUsecase.updatePriceDisclosureDocs({
            id: result.id,
            files,
          }),
        );
      }
      if (Math.random() < 0.3) {
        // 30% chance
        const files = [await getCachedPdf()];
        docPromises.push(
          procurementUsecase.updateWinnerDeclarationDocs({
            id: result.id,
            files,
          }),
        );
      }
      if (Math.random() < 0.5) {
        // 50% chance
        const file = await getCachedPdf();
        const label = faker.lorem.words(2);
        docPromises.push(
          procurementUsecase.addAttachment({ id: result.id, label, file }),
        );
      }

      await Promise.all(docPromises);

      console.log(`Created procurement: "${title}" with ID: ${result.id}`);
      return result.id;
    } catch (error) {
      console.error(`Failed to create procurement: "${title}"`, error);
      return null;
    }
  });

  const ids = (await Promise.all(promises)).filter(
    (id): id is string => id !== null,
  );

  console.log("Seeding completed.");
  return ids;
}

async function removeProcurements(ids: string[]) {
  console.log(`Removing ${ids.length} procurements...`);

  const promises = ids.map(async (id) => {
    try {
      await procurementUsecase.deleteProcurement({ id });
      console.log(`Deleted procurement with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to delete procurement with ID: ${id}`, error);
    }
  });

  await Promise.all(promises);

  console.log("Removal completed.");
}

// Run the command
const { command, n } = parseArgs();
if (command === "up") {
  up(() => seedProcurements(n), TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else if (command === "down") {
  down(removeProcurements, TEMP_FILE)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  console.error("Invalid command. Use 'up' or 'down'.");
}
