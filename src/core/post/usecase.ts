import { tagUsecase } from "@/core/tag/usecase";
import { db } from "@/db";
import { posts, type Post } from "@/db/schema";
import { getFileStore } from "@/lib/storage";
import {
  and,
  arrayContains,
  asc,
  count,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  sql,
} from "drizzle-orm";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../shared/constants";
import type { PaginatedResult } from "../shared/types";
import { createPaginatedResult } from "../shared/utils";
import type {
  AddAttachmentInput,
  createPostInput,
  DeletePostInput,
  GetManyPostsInput,
  RemoveAttachmentInput,
  updatePostInput,
  UpdatePreviewImage,
} from "./schema";

const create = async (input: createPostInput) => {
  let validatedTags: string[] | undefined;
  if (input.tags && input.tags.length > 0) {
    validatedTags = await tagUsecase.validateTags(input.tags, input.type);
  }
  let previewImageMeta: Post["previewImage"] | undefined;
  let attachmentsMeta: Post["attachments"] = [];

  const id = await db
    .insert(posts)
    .values({
      title: input.title,
      body: input.body,
      tags: validatedTags,
      type: input.type,
      previewImage: previewImageMeta,
      attachments: attachmentsMeta,
    })
    .returning({ id: posts.id })
    .then((result) => result?.[0].id);
  return { id };
};

const update = async (input: updatePostInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Post not found");
  }
  let validatedTags: string[] | undefined;
  if (input.tags && input.tags.length > 0) {
    const type = await getPostType(input.id);
    await tagUsecase.validateTags(input.tags, type);
  }
  await db
    .update(posts)
    .set({
      title: input.title,
      body: input.body,
      tags: validatedTags,
    })
    .where(eq(posts.id, input.id));
};

const publish = async (id: string) => {
  if (!(await exist(id))) {
    throw new Error("Post not found");
  }
  await db
    .update(posts)
    .set({ publishedAt: new Date() })
    .where(eq(posts.id, id));
};

const unpublish = async (id: string) => {
  if (!(await exist(id))) {
    throw new Error("Post not found");
  }
  await db.update(posts).set({ publishedAt: null }).where(eq(posts.id, id));
};

const exist = async (id: string): Promise<boolean> => {
  const countResult = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.id, id));
  return countResult[0].count > 0;
};

export const getPostType = async (id: string): Promise<Post["type"]> => {
  const post = await db
    .select({ type: posts.type })
    .from(posts)
    .where(eq(posts.id, id))
    .then((res) => res?.[0]);
  if (!post) {
    throw new Error("Post not found");
  }
  return post.type;
};

const updatePreviewImage = async (input: UpdatePreviewImage) => {
  if (!(await exist(input.id))) {
    throw new Error("Post not found");
  }

  await db.transaction(async (tx) => {
    const existingFileId = await tx.query.posts
      .findFirst({
        where: eq(posts.id, input.id),
        columns: { previewImage: true },
      })
      .then((res) => res?.previewImage?.id);

    const metadata = await getFileStore().store(
      Buffer.from(await input.file.arrayBuffer()),
      {
        mimeType: input.file.type,
        name: input.file.name,
      },
    );
    await db
      .update(posts)
      .set({ previewImage: { id: metadata.id, mimeType: input.file.type } })
      .where(eq(posts.id, input.id));

    if (existingFileId) {
      await getFileStore().delete(existingFileId);
    }
  });
};

const addAttachment = async (input: AddAttachmentInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Post not found");
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

const removeAttachment = async (args: RemoveAttachmentInput) => {
  if (!(await exist(args.id))) {
    throw new Error("Post not found");
  }

  await db.transaction(async (tx) => {
    const existingFileId = await tx
      .select({
        existingFileId: sql<string>`(SELECT attachment->>'id' FROM unnest(attachments) AS attachment WHERE (attachment->>'id') = ${args.attachmentId})`,
      })
      .from(posts)
      .where(eq(posts.id, args.id))
      .then((res) => res?.[0].existingFileId);

    if (!existingFileId) {
      return;
    }
    await db
      .update(posts)
      .set({
        attachments: sql`array_remove(attachments, (SELECT attachment FROM unnest(attachments) AS attachment WHERE (attachment->>'id') = ${args.attachmentId}))`,
      })
      .where(eq(posts.id, args.id));

    await getFileStore().delete(existingFileId);
  });
};

const getMany = async ({
  page = DEFAULT_PAGE_NUMBER,
  pageSize = DEFAULT_PAGE_SIZE,
  q,
  published,
  tags,
  year,
  type,
  orderBy = "createdAt",
  direction = "desc",
}: GetManyPostsInput): Promise<PaginatedResult<Post>> => {
  const [items, itemCount] = await Promise.all([
    db.query.posts.findMany({
      where: and(
        q ? ilike(posts.title, `${q}%`) : undefined,
        published === true
          ? isNotNull(posts.publishedAt)
          : published === false
            ? isNull(posts.publishedAt)
            : undefined,
        tags && tags.length > 0 ? arrayContains(posts.tags, tags) : undefined,
        year
          ? sql`EXTRACT(YEAR FROM ${posts.publishedAt}) = ${year}`
          : undefined,
        type ? eq(posts.type, type) : undefined,
      ),

      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: (direction === "asc" ? asc : desc)(
        posts[orderBy as "createdAt" | "publishedAt" | "title"],
      ),
    }),
    db
      .select({ count: count() })
      .from(posts)
      .where(
        and(
          q ? ilike(posts.title, `${q}%`) : undefined,
          published === true
            ? isNotNull(posts.publishedAt)
            : published === false
              ? isNull(posts.publishedAt)
              : undefined,
          tags && tags.length > 0 ? arrayContains(posts.tags, tags) : undefined,
          year
            ? sql`EXTRACT(YEAR FROM ${posts.publishedAt}) = ${year}`
            : undefined,
          type ? eq(posts.type, type) : undefined,
        ),
      )
      .then((res) => res[0].count),
  ]);

  return createPaginatedResult(items, itemCount, page, pageSize);
};

const getById = async (id: string): Promise<Post | undefined> => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
  return post;
};

const deletePost = async (args: DeletePostInput) => {
  if (!(await exist(args.id))) {
    throw new Error("Post not found");
  }
  await db.delete(posts).where(eq(posts.id, args.id));
};

export const postUsecase = {
  publish,
  unpublish,
  create,
  update,
  getMany,
  getById,
  updatePreviewImage,
  addAttachment,
  removeAttachment,
  deletePost,
};
