import type { Post } from "@/db/schema";
import { z } from "astro:schema";
import {
  createPostInputSchema,
  addAttachmentInputSchema as PostAddAttachmentInputSchema,
  deletePostInputSchema as PostDeletePostInputSchema,
  getManyPostsInputSchema as PostGetManyPostsInputSchema,
  removeAttachmentInputSchema as PostRemoveAttachmentInputSchema,
  updatePreviewImageInputSchema as PostUpdatePreviewImageInputSchema,
  updatePostInputSchema,
} from "../post/schema";

export type Announcement = Post;

export const createAnnouncementInputSchema = createPostInputSchema
  .omit({ type: true, title: true, body: true, tags: true })
  .extend({
    title: z
      .string()
      .trim()
      .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(30, "หัวข้อต้องไม่เกิน 30 ตัวอักษร"),
    body: z
      .string()
      .trim()
      .min(1, "เนื้อหาต้องมีอย่างน้อย 1 ตัวอักษร")
      .max(5000, "เนื้อหาต้องไม่เกิน 5000 ตัวอักษร")
      .optional(),
    tags: z
      .array(
        z
          .string()
          .trim()
          .min(1, "แท็กต้องมีอย่างน้อย 1 ตัวอักษร")
          .max(20, "แท็กต้องไม่เกิน 20 ตัวอักษร"),
      )
      .max(3, "แท็กต้องไม่เกิน 3 แท็ก")
      .optional()
      .nullable()
      .refine(
        (tags) => !tags || new Set(tags).size === tags.length,
        "แท็กต้องไม่ซ้ำกัน",
      ),
  });

export type createAnnouncementInput = z.infer<
  typeof createAnnouncementInputSchema
>;

export const updateAnnouncementInputSchema = updatePostInputSchema.omit({
  type: true,
});

export type updateAnnouncementInput = z.infer<
  typeof updateAnnouncementInputSchema
>;

export const updatePreviewImageInputSchema = PostUpdatePreviewImageInputSchema;

export type UpdatePreviewImage = z.infer<typeof updatePreviewImageInputSchema>;

export const addAttachmentInputSchema = PostAddAttachmentInputSchema;

export type AddAttachmentInput = z.infer<typeof addAttachmentInputSchema>;

export const removeAttachmentInputSchema = PostRemoveAttachmentInputSchema;

export type RemoveAttachmentInput = z.infer<typeof removeAttachmentInputSchema>;

export const deleteAnnouncementInputSchema = PostDeletePostInputSchema;

export type DeleteAnnouncementInput = z.infer<
  typeof deleteAnnouncementInputSchema
>;

export const getManyAnnouncementsInputSchema = PostGetManyPostsInputSchema;

export type GetManyAnnouncementsInput = z.infer<
  typeof getManyAnnouncementsInputSchema
>;
