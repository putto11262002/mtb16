import { z } from "astro:schema";

export const putConfigInputSchema = z.object({
  group: z.string().trim().min(1).max(255),
  key: z.string().trim().min(1).max(255),
  value: z.unknown(),
});

export type PutConfigInput = z.infer<typeof putConfigInputSchema>;

export const getManyConfigsInputSchema = z.object({
  group: z.string().trim().optional(),
});

export type GetManyConfigsInput = z.infer<typeof getManyConfigsInputSchema>;

export const getConfigInputSchema = z.object({
  group: z.string().trim().min(1).max(255),
  key: z.string().trim().min(1).max(255),
});

export type GetConfigInput = z.infer<typeof getConfigInputSchema>;

export const deleteConfigInputSchema = z.object({
  group: z.string().trim().min(1).max(255),
  key: z.string().trim().min(1).max(255),
});

export type DeleteConfigInput = z.infer<typeof deleteConfigInputSchema>;
