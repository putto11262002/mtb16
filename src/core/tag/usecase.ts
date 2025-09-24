import { db } from "@/db";
import { posts, tags } from "@/db/schema";
import { eq } from "drizzle-orm";

const create = async (name: string): Promise<void> => {
  await db.insert(tags).values({ id: name }).onConflictDoNothing();
};

const getAllTags = async (): Promise<string[]> => {
  const result = await db.select({ id: tags.id }).from(tags);
  return result.map((r) => r.id);
};

const validateTags = async (tags: string[]): Promise<void> => {
  const uniqueTags = [...new Set(tags)];
  await Promise.all(uniqueTags.map((name) => create(name)));
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
