import type { MutationResult } from "@/actions/shared";
import {
  updateAboutUsHeroImageInputSchema,
  updateGlobalSettingsInputSchema,
  updateHeroImageInputSchema,
  updatePopupImageInputSchema,
  type GlobalSettings,
} from "@/core/config/schema";
import { configUsecase } from "@/core/config/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const get = defineAction({
  input: z.object({}),
  handler: async (input, ctx): Promise<GlobalSettings> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });
    const config = await configUsecase.getGlobalSettings(input);
    return config;
  },
});

export const update = defineAction({
  input: updateGlobalSettingsInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.updateGlobalSettings(input);
    return {
      ok: true,
      id: "global_settings",
      message: "Global settings updated",
    };
  },
});

export const updateHeroImage = defineAction({
  accept: "form",
  input: updateHeroImageInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.updateHeroImage(input);
    return {
      ok: true,
      id: "global_hero_image",
      message: "Hero image updated",
    };
  },
});

export const updatePopupImage = defineAction({
  accept: "form",
  input: updatePopupImageInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.updatePopupImage(input);
    return {
      ok: true,
      id: "global_popup_image",
      message: "Popup image updated",
    };
  },
});

export const updateAboutUsHeroImage = defineAction({
  accept: "form",
  input: updateAboutUsHeroImageInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.updateAboutUsHeroImage(input);
    return {
      ok: true,
      id: "global_about_us_hero_image",
      message: "About us hero image updated",
    };
  },
});

export const global = {
  get,
  update,
  updateHeroImage,
  updatePopupImage,
  updateAboutUsHeroImage,
};
