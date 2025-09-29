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

export const landingPageConfigSchema = z.object({
  heroTitle: z.string().trim().max(255).optional(),
  heroImage: z
    .object({
      id: z.string(),
      mimeType: z.string().optional(),
    })
    .optional(),
  newsTag: z.string().trim().optional(),
  announcementsTag: z.string().trim().optional(),
  popupEnabled: z.boolean().optional(),
  popupImage: z
    .object({
      id: z.string(),
      mimeType: z.string().optional(),
    })
    .optional(),
});

export type LandingPageConfig = z.infer<typeof landingPageConfigSchema>;

export const updateLandingPageConfigInputSchema = z.object({
  heroTitle: z.string().trim().min(1).max(255),
  newsTag: z.string().trim().optional(),
  announcementsTag: z.string().trim().optional(),
  popupEnabled: z.boolean(),
});

export type UpdateLandingPageConfigInput = z.infer<
  typeof updateLandingPageConfigInputSchema
>;

export const updateLandingPageHeroImageInputSchema = z.object({
  heroImage: z.instanceof(File),
});

export type UpdateLandingPageHeroImageInput = z.infer<
  typeof updateLandingPageHeroImageInputSchema
>;

export const updateLandingPagePopupImageInputSchema = z.object({
  popupImage: z.instanceof(File),
});

export type UpdateLandingPagePopupImageInput = z.infer<
  typeof updateLandingPagePopupImageInputSchema
>;

export const setLandingPageConfigInputSchema = z.object({
  heroTitle: z.string().trim().min(1).max(255),
  heroImage: z.instanceof(File).optional(),
  newsTag: z.string().trim().optional(),
  announcementsTag: z.string().trim().optional(),
});

export type SetLandingPageConfigInput = z.infer<
  typeof setLandingPageConfigInputSchema
>;

export const getLandingPageConfigInputSchema = z.object({});

export type GetLandingPageConfigInput = z.infer<
  typeof getLandingPageConfigInputSchema
>;

export const contactConfigSchema = z.object({
  addressTh: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  mapEmbed: z.string().optional(),
  facebookOfficial: z.string().optional(),
  facebookNews: z.string().optional(),
  tiktok: z.string().optional(),
});

export type ContactConfig = z.infer<typeof contactConfigSchema>;

export const setContactConfigInputSchema = contactConfigSchema;

export type SetContactConfigInput = z.infer<typeof setContactConfigInputSchema>;

export const getContactConfigInputSchema = z.object({});

export type GetContactConfigInput = z.infer<typeof getContactConfigInputSchema>;
