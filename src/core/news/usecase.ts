import { postUsecase } from "@/core/post/usecase";
import type { Post } from "@/db/schema";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getFileStore } from "@/lib/storage";
import { eq, sql } from "drizzle-orm";
import type { PaginatedResult } from "../shared/types";
import type {
  AddAttachmentInput,
  createNewsInput,
  DeleteNewsInput,
  GetManyNewsInput,
  RemoveAttachmentInput,
  updateNewsInput,
  UpdatePreviewImage,
} from "./schema";

const create = async (input: createNewsInput) => {
  return await postUsecase.create({
    title: input.title,
    body: input.body,
    type: "news",
  });
};

const update = async (input: updateNewsInput) => {
  await postUsecase.update({
    id: input.id,
    title: input.title,
    body: input.body,
    type: "news",
  });
};

const publish = async (id: string) => {
  await postUsecase.publish(id);
};

const unpublish = async (id: string) => {
  await postUsecase.unpublish(id);
};

const updatePreviewImage = async (input: UpdatePreviewImage) => {
  await postUsecase.updatePreviewImage(input);
};

const addAttachment = async (input: AddAttachmentInput) => {
  if (!(await postUsecase.getById(input.id))) {
    throw new Error("News not found");
  }

  const metadata = await getFileStore().store(
    Buffer.from(await input.file.arrayBuffer()),
    {
      mimeType: input.file.type,
      name: input.file.name,
    },
  );

  await db
    .update(posts)
    .set({
      attachments: sql`array_append(attachments, ${JSON.stringify({
        label: input.label,
        file: { id: metadata.id, mimeType: input.file.type },
        id: metadata.id,
      })}::jsonb)`,
    })
    .where(eq(posts.id, input.id));
};

const removeAttachment = async (input: RemoveAttachmentInput) => {
  await postUsecase.removeAttachment(input);
};

const getMany = async (
  input: GetManyNewsInput,
): Promise<PaginatedResult<Post>> => {
  return await postUsecase.getMany({
    ...input,
    type: "news",
  });
};

const getById = async (id: string): Promise<Post | undefined> => {
  return await postUsecase.getById(id);
};

const deleteNews = async (input: DeleteNewsInput) => {
  await postUsecase.deletePost(input);
};

export const newsUsecase = {
  publish,
  unpublish,
  create,
  update,
  getMany,
  getById,
  updatePreviewImage,
  addAttachment,
  removeAttachment,
  deleteNews,
};