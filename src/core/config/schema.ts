import { z } from "astro:schema";

type FileMeta = { id: string; mimeType?: string };

export const globalSettingsSchema = z.object({
  id: z.string().default("global"),
  heroTitle: z.string().optional(),
  heroImage: z
    .object({ id: z.string(), mimeType: z.string().optional() })
    .optional(),
  aboutUsHeroImage: z
    .object({ id: z.string(), mimeType: z.string().optional() })
    .optional(),
  newsTag: z.string().optional(),
  announcementsTag: z.string().optional(),
  popupEnabled: z.boolean().optional(),
  popupImage: z
    .object({ id: z.string(), mimeType: z.string().optional() })
    .optional(),
  addressTh: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  mapEmbed: z.string().optional(),
  facebookOfficial: z.string().optional(),
  facebookNews: z.string().optional(),
  tiktok: z.string().optional(),
});

export type GlobalSettings = z.infer<typeof globalSettingsSchema>;

export const updateGlobalSettingsInputSchema = z.object({
  heroTitle: z.string().trim().min(1).max(255).optional(),
  newsTag: z.string().trim().optional(),
  announcementsTag: z.string().trim().optional(),
  popupEnabled: z.boolean().optional(),
  addressTh: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  mapEmbed: z.string().optional(),
  facebookOfficial: z.string().optional(),
  facebookNews: z.string().optional(),
  tiktok: z.string().optional(),
});

export type UpdateGlobalSettingsInput = z.infer<
  typeof updateGlobalSettingsInputSchema
>;

export const updateHeroImageInputSchema = z.object({
  heroImage: z.instanceof(Blob),
});

export type UpdateHeroImageInput = z.infer<typeof updateHeroImageInputSchema>;

export const updatePopupImageInputSchema = z.object({
  popupImage: z.instanceof(Blob),
});

export type UpdatePopupImageInput = z.infer<typeof updatePopupImageInputSchema>;

export const updateAboutUsHeroImageInputSchema = z.object({
  aboutUsHeroImage: z.instanceof(Blob),
});

export type UpdateAboutUsHeroImageInput = z.infer<
  typeof updateAboutUsHeroImageInputSchema
>;

export const getGlobalSettingsInputSchema = z.object({});

export type GetGlobalSettingsInput = z.infer<
  typeof getGlobalSettingsInputSchema
>;
