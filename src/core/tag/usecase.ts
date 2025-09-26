import { db } from "@/db";
import { tags } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import type { createTagInput, getAllTagsOutput } from "./schema";

const create = async (input: createTagInput): Promise<void> => {
  await db
    .insert(tags)
    .values({ name: input.name, type: input.type })
    .onConflictDoNothing();
};

const getAllTags = async (type: string): Promise<getAllTagsOutput> => {
  const result = await db
    .select({ name: tags.name })
    .from(tags)
    .where(eq(tags.type, type));
  return result.map((r) => r.name);
};

/**
 * Validates if the tags for a given resource exist if not create them
 */
const validateTags = async (
  _tags: string[],
  type: string,
): Promise<string[]> => {
  const uniqueTags = [...new Set(_tags)];

  const existingTags = await db
    .select({ name: tags.name })
    .from(tags)
    .where(and(eq(tags.type, type), inArray(tags.name, uniqueTags)))
    .then((res) => res.map((r) => r.name));

  const newTags = uniqueTags.filter((tag) => !existingTags.includes(tag));
  if (newTags.length > 0) {
    await db
      .insert(tags)
      .values(newTags.map((name) => ({ name, type: type })))
      .onConflictDoNothing();
  }

  return uniqueTags;
};

export const tagUsecase = {
  create,
  getAllTags,
  validateTags,
};
