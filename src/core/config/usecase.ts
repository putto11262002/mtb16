import { db } from "@/db";
import { configs, type Config } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type {
  ContactConfig,
  DeleteConfigInput,
  GetConfigInput,
  GetContactConfigInput,
  GetManyConfigsInput,
  LandingPageConfig,
  PutConfigInput,
  SetContactConfigInput,
  UpdateLandingPageConfigInput,
  UpdateLandingPageHeroImageInput,
  UpdateLandingPagePopupImageInput,
} from "./schema";

const put = async (input: PutConfigInput) => {
  await db
    .insert(configs)
    .values({
      group: input.group,
      key: input.key,
      value: input.value,
    })
    .onConflictDoUpdate({
      target: [configs.key, configs.group],
      set: {
        value: input.value,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });
};

const getMany = async (input: GetManyConfigsInput): Promise<Config[]> => {
  return await db
    .select()
    .from(configs)
    .where(input.group ? eq(configs.group, input.group) : undefined);
};

const getConfig = async (
  input: GetConfigInput,
): Promise<Config | undefined> => {
  const result = await db
    .select()
    .from(configs)
    .where(and(eq(configs.group, input.group), eq(configs.key, input.key)));
  return result?.[0];
};

const deleteConfig = async (input: DeleteConfigInput) => {
  await db
    .delete(configs)
    .where(and(eq(configs.group, input.group), eq(configs.key, input.key)));
};

const getLandingPageConfig = async (): Promise<
  LandingPageConfig | undefined
> => {
  const config = await getConfig({ group: "landing_page", key: "config" });
  return config?.value !== undefined
    ? (config.value as LandingPageConfig)
    : undefined;
};

const setLandingPageConfig = async (input: UpdateLandingPageConfigInput) => {
  const existingConfig = await getLandingPageConfig();
  const config = {
    heroTitle: input.heroTitle,
    heroImage: existingConfig?.heroImage,
    newsTag: input.newsTag || undefined,
    announcementsTag: input.announcementsTag || undefined,
    popupEnabled: input.popupEnabled,
    popupImage: existingConfig?.popupImage,
  };

  await put({ group: "landing_page", key: "config", value: config });
};

const setLandingPageHeroImage = async (
  input: UpdateLandingPageHeroImageInput,
) => {
  const { getFileStore } = await import("@/lib/storage");
  const files = getFileStore();
  const buffer = Buffer.from(await input.heroImage.arrayBuffer());
  const heroImageMeta = await files.store(buffer, {
    name: input.heroImage.name,
    mimeType: input.heroImage.type,
  });

  const existingConfig = await getLandingPageConfig();
  const config = {
    heroTitle: existingConfig?.heroTitle || "",
    heroImage: heroImageMeta,
    newsTag: existingConfig?.newsTag,
    announcementsTag: existingConfig?.announcementsTag,
    popupEnabled: existingConfig?.popupEnabled,
    popupImage: existingConfig?.popupImage,
  };

  await put({ group: "landing_page", key: "config", value: config });
};

const setLandingPagePopupImage = async (
  input: UpdateLandingPagePopupImageInput,
) => {
  const { getFileStore } = await import("@/lib/storage");
  const files = getFileStore();
  const buffer = Buffer.from(await input.popupImage.arrayBuffer());
  const popupImageMeta = await files.store(buffer, {
    name: input.popupImage.name,
    mimeType: input.popupImage.type,
  });

  const existingConfig = await getLandingPageConfig();
  const config = {
    heroTitle: existingConfig?.heroTitle || "",
    heroImage: existingConfig?.heroImage,
    newsTag: existingConfig?.newsTag,
    announcementsTag: existingConfig?.announcementsTag,
    popupEnabled: existingConfig?.popupEnabled,
    popupImage: popupImageMeta,
  };

  await put({ group: "landing_page", key: "config", value: config });
};

const getContactConfig = async (
  input: GetContactConfigInput,
): Promise<ContactConfig> => {
  const config = await getConfig({ group: "contact", key: "config" });
  if (config?.value) {
    return config.value as ContactConfig;
  }
  // Return defaults when no config exists
  return {};
};

const setContactConfig = async (input: SetContactConfigInput) => {
  await put({ group: "contact", key: "config", value: input });
};

export const configUsecase = {
  put,
  getMany,
  getConfig,
  deleteConfig,
  getLandingPageConfig,
  setLandingPageConfig,
  setLandingPageHeroImage,
  setLandingPagePopupImage,
  getContactConfig,
  setContactConfig,
};
