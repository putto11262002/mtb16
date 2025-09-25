import { z } from "astro:schema";
import { MAX_IMAGE_SIZE_MB, SUPPORTED_IMAGE_TYPES } from "../shared/constants";
import { tagSchema } from "../tag/schema";

export const createDirectoryEntryInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters"),
  tag: tagSchema.optional(),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  notes: z.string().optional(),
  order: z.number().int().optional(),
});

export type createDirectoryEntryInput = z.infer<
  typeof createDirectoryEntryInputSchema
>;

export const updateDirectoryEntryInputSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters")
    .optional(),
  tag: tagSchema.optional(),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  notes: z.string().optional(),
  order: z.number().int().optional(),
});

export type updateDirectoryEntryInput = z.infer<
  typeof updateDirectoryEntryInputSchema
>;

export const deleteDirectoryEntryInputSchema = z.object({
  id: z.string().uuid(),
});

export type deleteDirectoryEntryInput = z.infer<
  typeof deleteDirectoryEntryInputSchema
>;

export const getManyDirectoryEntriesInputSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).default(10).optional(),
  q: z.string().optional(),
  tag: tagSchema.optional(),
});

export type getManyDirectoryEntriesInput = z.infer<
  typeof getManyDirectoryEntriesInputSchema
>;

export const updateDirectoryEntryImageInputSchema = z.object({
  id: z.string().uuid(),
  file: z
    .instanceof(File)
    .refine(
      (file) => SUPPORTED_IMAGE_TYPES.includes(file.type),
      "Unsupported image type",
    )
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
      `Image size must be less than ${MAX_IMAGE_SIZE_MB} MB`,
    ),
});

export type UpdateDirectoryEntryImage = z.infer<
  typeof updateDirectoryEntryImageInputSchema
>;
