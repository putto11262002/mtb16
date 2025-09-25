import { db } from "@/db";
import { posts, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
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

const getTagsByType = async (type: string): Promise<string[]> => {
  const result = await db
    .select({ tags: posts.tags })
    .from(posts)
    .where(eq(posts.type, type));
  const allTags = result.flatMap((r) => r.tags || []);
  return [...new Set(allTags)];
};

export const tagUsecase = {
  create,
  getAllTags,
  validateTags,
  getTagsByType,
};
