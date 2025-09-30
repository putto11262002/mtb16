import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type {
  GetGlobalSettingsInput,
  GlobalSettings,
  UpdateAboutUsHeroImageInput,
  UpdateGlobalSettingsInput,
  UpdateHeroImageInput,
  UpdatePopupImageInput,
} from "./schema";

const GLOBAL_ID = "global";

const DEFAULT_SETTINGS: GlobalSettings = {
  id: GLOBAL_ID,
  heroTitle: undefined,
  heroImage: undefined,
  aboutUsHeroImage: undefined,
  newsTag: undefined,
  announcementsTag: undefined,
  popupEnabled: false,
  popupImage: undefined,
  addressTh: undefined,
  phone: undefined,
  email: undefined,
  mapEmbed: undefined,
  facebookOfficial: undefined,
  facebookNews: undefined,
  tiktok: undefined,
};

const getGlobalSettings = async (
  input: GetGlobalSettingsInput,
): Promise<GlobalSettings> => {
  const result = await db
    .select()
    .from(settings)
    .where(eq(settings.id, GLOBAL_ID));
  const existing = result?.[0];
  if (existing) {
    // Convert null to undefined for optional fields
    return {
      ...existing,
      heroTitle: existing.heroTitle ?? undefined,
      heroImage: existing.heroImage ?? undefined,
      aboutUsHeroImage: existing.aboutUsHeroImage ?? undefined,
      newsTag: existing.newsTag ?? undefined,
      announcementsTag: existing.announcementsTag ?? undefined,
      popupEnabled: existing.popupEnabled ?? false,
      popupImage: existing.popupImage ?? undefined,
      addressTh: existing.addressTh ?? undefined,
      phone: existing.phone ?? undefined,
      email: existing.email ?? undefined,
      mapEmbed: existing.mapEmbed ?? undefined,
      facebookOfficial: existing.facebookOfficial ?? undefined,
      facebookNews: existing.facebookNews ?? undefined,
      tiktok: existing.tiktok ?? undefined,
    };
  }
  return DEFAULT_SETTINGS;
};

const updateGlobalSettings = async (input: UpdateGlobalSettingsInput) => {
  const existing = await getGlobalSettings({});
  const updated = { ...existing, ...input };
  await db
    .insert(settings)
    .values(updated)
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        ...input,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });
};

const updateHeroImage = async (input: UpdateHeroImageInput) => {
  const { getFileStore } = await import("@/lib/storage");
  const files = getFileStore();

  // Get existing image
  const existing = await getGlobalSettings({});
  const existingImageId = existing.heroImage?.id;

  const buffer = Buffer.from(await input.heroImage.arrayBuffer());
  const heroImageMeta = await files.store(buffer, {
    name: input.heroImage.name,
    mimeType: input.heroImage.type,
  });

  await db
    .insert(settings)
    .values({ id: GLOBAL_ID, heroImage: heroImageMeta })
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        heroImage: heroImageMeta,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  // Delete old image if exists
  if (existingImageId) {
    await files.delete(existingImageId);
  }
};

const updatePopupImage = async (input: UpdatePopupImageInput) => {
  const { getFileStore } = await import("@/lib/storage");
  const files = getFileStore();

  // Get existing image
  const existing = await getGlobalSettings({});
  const existingImageId = existing.popupImage?.id;

  const buffer = Buffer.from(await input.popupImage.arrayBuffer());
  const popupImageMeta = await files.store(buffer, {
    name: input.popupImage.name,
    mimeType: input.popupImage.type,
  });

  await db
    .insert(settings)
    .values({ id: GLOBAL_ID, popupImage: popupImageMeta })
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        popupImage: popupImageMeta,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  // Delete old image if exists
  if (existingImageId) {
    await files.delete(existingImageId);
  }
};

const updateAboutUsHeroImage = async (input: UpdateAboutUsHeroImageInput) => {
  const { getFileStore } = await import("@/lib/storage");
  const files = getFileStore();

  // Get existing image
  const existing = await getGlobalSettings({});
  const existingImageId = existing.aboutUsHeroImage?.id;

  const buffer = Buffer.from(await input.aboutUsHeroImage.arrayBuffer());
  const aboutUsHeroImageMeta = await files.store(buffer, {
    name: input.aboutUsHeroImage.name,
    mimeType: input.aboutUsHeroImage.type,
  });

  await db
    .insert(settings)
    .values({ id: GLOBAL_ID, aboutUsHeroImage: aboutUsHeroImageMeta })
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        aboutUsHeroImage: aboutUsHeroImageMeta,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });

  // Delete old image if exists
  if (existingImageId) {
    await files.delete(existingImageId);
  }
};

export const configUsecase = {
  getGlobalSettings,
  updateGlobalSettings,
  updateHeroImage,
  updatePopupImage,
  updateAboutUsHeroImage,
};
