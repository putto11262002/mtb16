import { db } from "@/db";
import { tags } from "@/db/schema";
import type {
  createTagInput,
  getAllTagsOutput,
  validateTagsInput,
} from "./schema";

const create = async (input: createTagInput): Promise<void> => {
  await db.insert(tags).values({ id: input.name }).onConflictDoNothing();
};

const getAllTags = async (): Promise<getAllTagsOutput> => {
  const result = await db.select({ id: tags.id }).from(tags);
  return result.map((r) => r.id);
};

const validateTags = async (input: validateTagsInput): Promise<void> => {
  const uniqueTags = [...new Set(input)];
  await Promise.all(uniqueTags.map((name) => create({ name })));
};

export const tagUsecase = {
  create,
  getAllTags,
  validateTags,
};
