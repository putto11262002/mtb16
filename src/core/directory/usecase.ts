import { tagUsecase } from "@/core/tag/usecase";
import { db } from "@/db";
import { directoryEntries } from "@/db/schema";
import { getFileStore } from "@/lib/storage";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../shared/constants";
import type { PaginatedResult } from "../shared/types";
import { createPaginatedResult } from "../shared/utils";
import type {
  createDirectoryEntryInput,
  deleteDirectoryEntryInput,
  getManyDirectoryEntriesInput,
  UpdateDirectoryEntryImage,
  updateDirectoryEntryInput,
} from "./schema";

const create = async (input: createDirectoryEntryInput) => {
  if (input.tag) {
    await tagUsecase.validateTags([input.tag], "directory");
  }
  const [result] = await db
    .insert(directoryEntries)
    .values(input)
    .returning({ id: directoryEntries.id });
  return { id: result.id };
};

const update = async (input: updateDirectoryEntryInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Directory entry not found");
  }
  if (input.tag) {
    await tagUsecase.validateTags([input.tag], "directory");
  }
  await db
    .update(directoryEntries)
    .set(input)
    .where(eq(directoryEntries.id, input.id));
};

const updateImage = async (input: UpdateDirectoryEntryImage) => {
  if (!(await exist(input.id))) {
    throw new Error("Directory entry not found");
  }

  await db.transaction(async (tx) => {
    const existingFileId = await tx.query.directoryEntries
      .findFirst({
        where: eq(directoryEntries.id, input.id),
        columns: { image: true },
      })
      .then((res) => res?.image?.id);

    const metadata = await getFileStore().store(
      Buffer.from(await input.file.arrayBuffer()),
      {
        mimeType: input.file.type,
        name: input.file.name,
      },
    );
    await db
      .update(directoryEntries)
      .set({ image: { id: metadata.id, mimeType: input.file.type } })
      .where(eq(directoryEntries.id, input.id));

    if (existingFileId) {
      await getFileStore().delete(existingFileId);
    }
  });
};

const exist = async (id: string): Promise<boolean> => {
  const countResult = await db
    .select({ count: count() })
    .from(directoryEntries)
    .where(eq(directoryEntries.id, id));
  return countResult[0].count > 0;
};

const getMany = async ({
  page = DEFAULT_PAGE_NUMBER,
  pageSize = DEFAULT_PAGE_SIZE,
  q,
  tag,
}: getManyDirectoryEntriesInput): Promise<
  PaginatedResult<typeof directoryEntries.$inferSelect>
> => {
  const [items, itemCount] = await Promise.all([
    db.query.directoryEntries.findMany({
      where: and(
        q ? ilike(directoryEntries.name, `${q}%`) : undefined,
        tag ? eq(directoryEntries.tag, tag) : undefined,
      ),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: [desc(directoryEntries.createdAt)],
    }),
    db
      .select({ count: count() })
      .from(directoryEntries)
      .where(
        and(
          q ? ilike(directoryEntries.name, `${q}%`) : undefined,
          tag ? eq(directoryEntries.tag, tag) : undefined,
        ),
      )
      .then((res) => res[0].count),
  ]);

  return createPaginatedResult(items, itemCount, page, pageSize);
};

const getById = async (id: string) => {
  return await db.query.directoryEntries.findFirst({
    where: eq(directoryEntries.id, id),
  });
};

const deleteEntry = async (input: deleteDirectoryEntryInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Directory entry not found");
  }
  await db.delete(directoryEntries).where(eq(directoryEntries.id, input.id));
};

export const directoryUsecase = {
  create,
  update,
  updateImage,
  getMany,
  getById,
  deleteEntry,
};
