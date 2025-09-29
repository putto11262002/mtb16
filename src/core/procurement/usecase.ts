import { db } from "@/db";
import { procurements, type Procurement } from "@/db/schema";
import { getFileStore } from "@/lib/storage";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../shared/constants";
import type { PaginatedResult } from "../shared/types";
import { createPaginatedResult } from "../shared/utils";
import type {
  AddProcurementAttachmentInput,
  createProcurementInput,
  DeleteProcurementInput,
  GetManyProcurementsInput,
  RemoveProcurementAttachmentInput,
  UpdateAnnualPlanInput,
  UpdateInvitationDocsInput,
  UpdatePriceDisclosureDocsInput,
  updateProcurementInput,
  UpdateWinnerDeclarationDocsInput,
} from "./schema";

const create = async (input: createProcurementInput) => {
  const id = await db
    .insert(procurements)
    .values({
      title: input.title,
      status: input.status,
      date: new Date(input.date.toISOString()),
      year: input.date.getFullYear(),
      details: input.details,
    })
    .returning({ id: procurements.id })
    .then((result) => result?.[0].id);
  return { id };
};

const update = async (input: updateProcurementInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Procurement not found");
  }
  await db
    .update(procurements)
    .set({
      title: input.title,
      status: input.status,
      date: new Date(input.date.toISOString()),
      year: input.date.getFullYear(),
      details: input.details,
    })
    .where(eq(procurements.id, input.id));
};

const exist = async (id: string): Promise<boolean> => {
  const countResult = await db
    .select({ count: count() })
    .from(procurements)
    .where(eq(procurements.id, id));
  return countResult[0].count > 0;
};

const getMany = async ({
  page = DEFAULT_PAGE_NUMBER,
  pageSize = DEFAULT_PAGE_SIZE,
  q,
  status,
  year,
  orderBy = "createdAt",
  direction = "desc",
}: GetManyProcurementsInput): Promise<PaginatedResult<Procurement>> => {
  const [items, itemCount] = await Promise.all([
    db.query.procurements.findMany({
      where: and(
        q ? ilike(procurements.title, `${q}%`) : undefined,
        status ? eq(procurements.status, status) : undefined,
        year ? eq(procurements.year, year) : undefined,
      ),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: (direction === "asc" ? asc : desc)(
        procurements[orderBy as "createdAt" | "date" | "title"],
      ),
    }),
    db
      .select({ count: count() })
      .from(procurements)
      .where(
        and(
          q ? ilike(procurements.title, `${q}%`) : undefined,
          status ? eq(procurements.status, status) : undefined,
          year ? eq(procurements.year, year) : undefined,
        ),
      )
      .then((res) => res[0].count),
  ]);

  return createPaginatedResult(items, itemCount, page, pageSize);
};

const getById = async (id: string): Promise<Procurement | undefined> => {
  const procurement = await db.query.procurements.findFirst({
    where: eq(procurements.id, id),
  });
  return procurement;
};

const deleteProcurement = async (args: DeleteProcurementInput) => {
  if (!(await exist(args.id))) {
    throw new Error("Procurement not found");
  }
  await db.delete(procurements).where(eq(procurements.id, args.id));
};

const updateAnnualPlan = async (input: UpdateAnnualPlanInput) => {
  await updateDocumentFiles(input, "annualPlan");
};

// Generic function to update document files
const updateDocumentFiles = async <T extends { id: string; files: File[] }>(
  input: T,
  field: "annualPlan" | "invitation" | "priceDisclosure" | "winnerDeclaration",
) => {
  if (!(await exist(input.id))) {
    throw new Error("Procurement not found");
  }

  await db.transaction(async (tx) => {
    // Get existing file IDs
    const existingFiles = await tx.query.procurements
      .findFirst({
        where: eq(procurements.id, input.id),
        columns: { [field]: true },
      })
      .then((res) => (res as any)?.[field] || []);

    // Store new files
    const newFileMetas = await Promise.all(
      input.files.map(async (file: File) => {
        const metadata = await getFileStore().store(
          Buffer.from(await file.arrayBuffer()),
          {
            mimeType: file.type,
            name: file.name,
          },
        );
        return { id: metadata.id, mimeType: file.type };
      }),
    );

    // Update DB
    await tx
      .update(procurements)
      .set({ [field]: newFileMetas } as any)
      .where(eq(procurements.id, input.id));

    // Delete old files
    await Promise.all(
      existingFiles.map((file: { id: string }) =>
        getFileStore().delete(file.id),
      ),
    );
  });
};

const updateInvitationDocs = async (input: UpdateInvitationDocsInput) => {
  await updateDocumentFiles(input, "invitation");
};

const updatePriceDisclosureDocs = async (
  input: UpdatePriceDisclosureDocsInput,
) => {
  await updateDocumentFiles(input, "priceDisclosure");
};

const updateWinnerDeclarationDocs = async (
  input: UpdateWinnerDeclarationDocsInput,
) => {
  await updateDocumentFiles(input, "winnerDeclaration");
};

const addAttachment = async (input: AddProcurementAttachmentInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Procurement not found");
  }

  const metadata = await getFileStore().store(
    Buffer.from(await input.file.arrayBuffer()),
    {
      mimeType: input.file.type,
      name: input.file.name,
    },
  );

  await db
    .update(procurements)
    .set({
      attachments: sql`array_append(attachments, ${JSON.stringify({
        label: input.label,
        file: { id: metadata.id, mimeType: input.file.type },
        id: metadata.id,
      })}::jsonb)`,
    })
    .where(eq(procurements.id, input.id));
};

const removeAttachment = async (args: RemoveProcurementAttachmentInput) => {
  if (!(await exist(args.id))) {
    throw new Error("Procurement not found");
  }

  await db.transaction(async (tx) => {
    const existingFileId = await tx
      .select({
        existingFileId: sql<string>`(SELECT attachment->>'id' FROM unnest(attachments) AS attachment WHERE (attachment->>'id') = ${args.attachmentId})`,
      })
      .from(procurements)
      .where(eq(procurements.id, args.id))
      .then((res) => res?.[0].existingFileId);

    if (!existingFileId) {
      return;
    }
    await tx
      .update(procurements)
      .set({
        attachments: sql`array_remove(attachments, (SELECT attachment FROM unnest(attachments) AS attachment WHERE (attachment->>'id') = ${args.attachmentId}))`,
      })
      .where(eq(procurements.id, args.id));

    await getFileStore().delete(existingFileId);
  });
};

export const procurementUsecase = {
  create,
  update,
  getMany,
  getById,
  deleteProcurement,
  updateAnnualPlan,
  updateInvitationDocs,
  updatePriceDisclosureDocs,
  updateWinnerDeclarationDocs,
  addAttachment,
  removeAttachment,
};
