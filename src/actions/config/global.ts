import type { MutationResult } from "@/actions/shared";
import { handleError, isAuthenticated } from "@/actions/shared";
import {
  updateAboutUsHeroImageInputSchema,
  updateGlobalSettingsInputSchema,
  updateHeroImageInputSchema,
  updatePopupImageInputSchema,
  type GlobalSettings,
} from "@/core/config/schema";
import { configUsecase } from "@/core/config/usecase";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const get = defineAction({
  input: z.object({}),
  handler: async (input, ctx): Promise<GlobalSettings> => {
    try {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      const config = await configUsecase.getGlobalSettings(input);
      return config;
    } catch (error) {
      throw handleError(error, ctx);
    }
  },
});

export const update = defineAction({
  input: updateGlobalSettingsInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    try {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;

      await configUsecase.updateGlobalSettings(input);
      return {
        ok: true,
        id: "global_settings",
        message: "Global settings updated",
      };
    } catch (error) {
      throw handleError(error, ctx);
    }
  },
});

export const updateHeroImage = defineAction({
  accept: "form",
  handler: async (input, ctx): Promise<MutationResult> => {
    try {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      const validation = updateHeroImageInputSchema.safeParse({
        heroImage: input.get("heroImage"),
      });
      if (!validation.success) {
        throw validation.error;
      }

      await configUsecase.updateHeroImage(validation.data);
      return {
        ok: true,
        id: "global_hero_image",
        message: "Hero image updated",
      };
    } catch (error) {
      throw handleError(error, ctx);
    }
  },
});

export const updatePopupImage = defineAction({
  accept: "form",
  handler: async (input, ctx): Promise<MutationResult> => {
    try {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      const validation = updatePopupImageInputSchema.safeParse({
        popupImage: input.get("popupImage"),
      });
      if (!validation.success) {
        throw validation.error;
      }

      await configUsecase.updatePopupImage(validation.data);
      return {
        ok: true,
        id: "global_popup_image",
        message: "Popup image updated",
      };
    } catch (error) {
      throw handleError(error, ctx);
    }
  },
});

export const updateAboutUsHeroImage = defineAction({
  accept: "form",
  handler: async (input, ctx): Promise<MutationResult> => {
    try {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      const validation = updateAboutUsHeroImageInputSchema.safeParse({
        aboutUsHeroImage: input.get("aboutUsHeroImage"),
      });
      if (!validation.success) {
        throw validation.error;
      }

      await configUsecase.updateAboutUsHeroImage(validation.data);
      return {
        ok: true,
        id: "global_about_us_hero_image",
        message: "About us hero image updated",
      };
    } catch (error) {
      throw handleError(error, ctx);
    }
  },
});

export const global = {
  get,
  update,
  updateHeroImage,
  updatePopupImage,
  updateAboutUsHeroImage,
};
