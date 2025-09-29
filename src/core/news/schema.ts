import type { Post } from "@/db/schema";
import { z } from "astro:schema";
import {
  createPostInputSchema,
  deletePostInputSchema as PostDeletePostInputSchema,
  getManyPostsInputSchema as PostGetManyPostsInputSchema,
  removeAttachmentInputSchema as PostRemoveAttachmentInputSchema,
  updatePreviewImageInputSchema as PostUpdatePreviewImageInputSchema,
  updatePostInputSchema,
} from "../post/schema";
import { MAX_IMAGE_SIZE_MB, SUPPORTED_IMAGE_TYPES } from "../shared/constants";

export type News = Post;

export const createNewsInputSchema = createPostInputSchema.omit({
  type: true,
  tags: true,
});

export type createNewsInput = z.infer<typeof createNewsInputSchema>;

export const updateNewsInputSchema = updatePostInputSchema.omit({
  type: true,
  tags: true,
});

export type updateNewsInput = z.infer<typeof updateNewsInputSchema>;

export const updatePreviewImageInputSchema = PostUpdatePreviewImageInputSchema;

export type UpdatePreviewImage = z.infer<typeof updatePreviewImageInputSchema>;

export const addAttachmentInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string().optional(),
  file: z
    .instanceof(Blob)
    .refine(
      (file) => SUPPORTED_IMAGE_TYPES.includes(file.type),
      "Unsupported image type",
    )
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
      `Image size must be less than ${MAX_IMAGE_SIZE_MB} MB`,
    ),
});

export type AddAttachmentInput = z.infer<typeof addAttachmentInputSchema>;

export const removeAttachmentInputSchema = PostRemoveAttachmentInputSchema;

export type RemoveAttachmentInput = z.infer<typeof removeAttachmentInputSchema>;

export const deleteNewsInputSchema = PostDeletePostInputSchema;

export type DeleteNewsInput = z.infer<typeof deleteNewsInputSchema>;

export const getManyNewsInputSchema = PostGetManyPostsInputSchema.omit({
  tags: true,
});

export type GetManyNewsInput = z.infer<typeof getManyNewsInputSchema>;
