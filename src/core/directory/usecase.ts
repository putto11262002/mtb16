import { tagUsecase } from "@/core/tag/usecase";
import { db } from "@/db";
import { directoryEntries } from "@/db/schema";
import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../shared/constants";
import type { PaginatedResult } from "../shared/types";
import { createPaginatedResult } from "../shared/utils";
import type {
  createDirectoryEntryInput,
  deleteDirectoryEntryInput,
  getManyDirectoryEntriesInput,
  updateDirectoryEntryInput,
} from "./schema";

const create = async (input: createDirectoryEntryInput) => {
  if (input.tag) {
    await tagUsecase.validateTags([input.tag]);
  }
  const [result] = await db
    .insert(directoryEntries)
    .values({
      name: input.name,
      tag: input.tag || null,
      link: input.link || null,
      phone: input.phone || null,
      email: input.email || null,
      notes: input.notes || null,
      order: input.order || null,
    })
    .returning({ id: directoryEntries.id });
  return { id: result.id };
};

const update = async (input: updateDirectoryEntryInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Directory entry not found");
  }
  if (input.tag) {
    await tagUsecase.validateTags([input.tag]);
  }
  await db
    .update(directoryEntries)
    .set({
      name: input.name,
      tag: input.tag,
      link: input.link,
      phone: input.phone,
      email: input.email,
      notes: input.notes,
      order: input.order,
    })
    .where(eq(directoryEntries.id, input.id));
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
}: getManyDirectoryEntriesInput): Promise<
  PaginatedResult<typeof directoryEntries.$inferSelect>
> => {
  const [items, itemCount] = await Promise.all([
    db.query.directoryEntries.findMany({
      where: q ? ilike(directoryEntries.name, `${q}%`) : undefined,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: [asc(directoryEntries.order), desc(directoryEntries.createdAt)],
    }),
    db
      .select({ count: count() })
      .from(directoryEntries)
      .where(q ? ilike(directoryEntries.name, `${q}%`) : undefined)
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
  getMany,
  getById,
  deleteEntry,
};
