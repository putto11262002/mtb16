import { z } from "astro:schema";

export const tagSchema = z
  .string()
  .trim()
  .min(1, "Tag name must be at least 1 character")
  .max(255, "Tag name must not exceed 255 characters");

export const createTagInputSchema = z.object({
  name: tagSchema,
});

export type CreateTagInput = z.infer<typeof createTagInputSchema>;

export const getAllTagsOutputSchema = z.array(tagSchema);

export type GetAllTagsOutput = z.infer<typeof getAllTagsOutputSchema>;

export const validateTagsInputSchema = z.array(tagSchema);

export type ValidateTagsInput = z.infer<typeof validateTagsInputSchema>;
