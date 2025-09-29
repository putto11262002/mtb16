import { z } from "astro:schema";
import {
  MAX_ATTACHMENT_SIZE_MB,
  MAX_IMAGE_SIZE_MB,
  SUPPORTED_ATTACHMENT_TYPES,
  SUPPORTED_IMAGE_TYPES,
} from "../shared/constants";

export const createPostInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(100, "หัวข้อต้องไม่เกิน 100 ตัวอักษร"),
  body: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 5000,
      "เนื้อหาต้องไม่เกิน 5000 ตัวอักษร",
    ),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "แท็กต้องมีอย่างน้อย 1 ตัวอักษร")
        .max(20, "แท็กต้องไม่เกิน 20 ตัวอักษร"),
    )
    .optional()
    .nullable()
    .refine((tags) => !tags || tags.length <= 10, "แท็กต้องไม่เกิน 10 แท็ก")
    .refine(
      (tags) => !tags || new Set(tags).size === tags.length,
      "แท็กต้องไม่ซ้ำกัน",
    ),
  type: z
    .string()
    .trim()
    .min(1, "ประเภทเป็นสิ่งจำเป็น")
    .max(50, "ประเภทต้องไม่เกิน 50 ตัวอักษร"),
});

export type createPostInput = z.infer<typeof createPostInputSchema>;

export const updatePostInputSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .trim()
    .min(3, "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(100, "หัวข้อต้องไม่เกิน 100 ตัวอักษร")
    .optional(),
  body: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 5000,
      "เนื้อหาต้องไม่เกิน 5000 ตัวอักษร",
    ),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "แท็กต้องมีอย่างน้อย 1 ตัวอักษร")
        .max(20, "แท็กต้องไม่เกิน 20 ตัวอักษร"),
    )
    .optional()
    .refine((tags) => !tags || tags.length <= 10, "แท็กต้องไม่เกิน 10 แท็ก")
    .refine(
      (tags) => !tags || new Set(tags).size === tags.length,
      "แท็กต้องไม่ซ้ำกัน",
    ),
  published: z.boolean().optional(),
  type: z
    .string()
    .trim()
    .min(1, "ประเภทเป็นสิ่งจำเป็น")
    .max(50, "ประเภทต้องไม่เกิน 50 ตัวอักษร")
    .optional(),
});

export type updatePostInput = z.infer<typeof updatePostInputSchema>;

export const updatePreviewImageInputSchema = z.object({
  id: z.string().uuid(),
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

export type UpdatePreviewImage = z.infer<typeof updatePreviewImageInputSchema>;

export const addAttachmentInputSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  file: z
    .instanceof(Blob)
    .refine(
      (file) => file.size <= MAX_ATTACHMENT_SIZE_MB * 1024 * 1024,
      `File size must be less than ${MAX_ATTACHMENT_SIZE_MB} MB`,
    )
    .refine(
      (file) => SUPPORTED_ATTACHMENT_TYPES.includes(file.type),
      "Unsupported file type",
    ),
});

export type AddAttachmentInput = z.infer<typeof addAttachmentInputSchema>;

export const removeAttachmentInputSchema = z.object({
  id: z.string().uuid(),
  attachmentId: z.string().uuid(),
});

export type RemoveAttachmentInput = z.infer<typeof removeAttachmentInputSchema>;

export const deletePostInputSchema = z.object({
  id: z.string().uuid(),
});

export type DeletePostInput = z.infer<typeof deletePostInputSchema>;

export const getManyPostsInputSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).default(10).optional(),
  q: z.string().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  year: z.coerce.number().min(1900).max(2100).optional(),
  type: z.string().optional(),
  orderBy: z.enum(["createdAt", "publishedAt", "title"]).optional(),
  direction: z.enum(["asc", "desc"]).optional(),
});

export type GetManyPostsInput = z.infer<typeof getManyPostsInputSchema>;
