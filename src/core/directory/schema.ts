import { z } from "astro:schema";
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
});

export type getManyDirectoryEntriesInput = z.infer<
  typeof getManyDirectoryEntriesInputSchema
>;
