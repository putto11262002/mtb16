import { z } from "astro:schema";

export const tagSchema = z
  .string()
  .trim()
  .min(1, "ชื่อแท็กต้องมีอย่างน้อย 1 ตัวอักษร")
  .max(255, "ชื่อแท็กต้องไม่เกิน 255 ตัวอักษร");

export const createTagInputSchema = z.object({
  name: tagSchema,
  type: z.string(),
});

export type createTagInput = z.infer<typeof createTagInputSchema>;

export type getAllTagsOutput = string[];
