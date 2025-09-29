import type { MutationResult } from "@/actions/shared";
import {
  updateLandingPageConfigInputSchema,
  updateLandingPageHeroImageInputSchema,
  updateLandingPagePopupImageInputSchema,
  type LandingPageConfig,
} from "@/core/config/schema";
import { configUsecase } from "@/core/config/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const get = defineAction({
  input: z.object({}),
  handler: async (input, ctx): Promise<LandingPageConfig | undefined> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });
    const config = await configUsecase.getLandingPageConfig();
    return config;
  },
});

export const update = defineAction({
  input: updateLandingPageConfigInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.setLandingPageConfig(input);
    return {
      ok: true,
      id: "landing_page_config",
      message: "Landing page config updated",
    };
  },
});

export const updateHeroImage = defineAction({
  accept: "form",
  input: updateLandingPageHeroImageInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.setLandingPageHeroImage(input);
    return {
      ok: true,
      id: "landing_page_hero_image",
      message: "Landing page hero image updated",
    };
  },
});

export const updatePopupImage = defineAction({
  accept: "form",
  input: updateLandingPagePopupImageInputSchema,
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.setLandingPagePopupImage(input);
    return {
      ok: true,
      id: "landing_page_popup_image",
      message: "Landing page popup image updated",
    };
  },
});

export const landingPage = { get, update, updateHeroImage, updatePopupImage };
