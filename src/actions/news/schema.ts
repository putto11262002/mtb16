import { z } from "astro:schema";

export const CreateNewsInputSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().max(255).optional(),
  caption: z.string().max(255).optional(),
  body: z.string().optional(),
  heroImage: z.instanceof(File).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      ogImage: z.instanceof(File).optional(),
    })
    .optional(),
});

export const UpdateNewsInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().max(255).optional(),
  caption: z.string().max(255).optional(),
  body: z.string().optional(),
  heroImage: z.instanceof(File).optional(),
  publishedAt: z.string().datetime().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      ogImage: z.instanceof(File).optional(),
    })
    .optional(),
});

export const PublishNewsInputSchema = z.object({
  id: z.string(),
});

export const CreateNewsOutputSchema = z.object({
  ok: z.boolean(),
  id: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type CreateNewsInput = z.infer<typeof CreateNewsInputSchema>;
export type CreateNewsOutput = z.infer<typeof CreateNewsOutputSchema>;
export type UpdateNewsInput = z.infer<typeof UpdateNewsInputSchema>;
export type PublishNewsInput = z.infer<typeof PublishNewsInputSchema>;
