import type { MutationResult } from "@/actions/shared";
import type { ContactConfig } from "@/core/config/schema";
import { configUsecase } from "@/core/config/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const get = defineAction({
  input: z.object({}),
  handler: async (input, ctx): Promise<ContactConfig> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });
    const config = await configUsecase.getContactConfig(input);
    return config;
  },
});

export const set = defineAction({
  input: z.object({
    addressTh: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    mapEmbed: z.string().optional(),
    facebookOfficial: z.string().optional(),
    facebookNews: z.string().optional(),
    tiktok: z.string().optional(),
  }),
  handler: async (input, ctx): Promise<MutationResult> => {
    if (!ctx.locals.user)
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Login required.",
      });

    await configUsecase.setContactConfig(input);
    return {
      ok: true,
      id: "contact_config",
      message: "Contact config updated",
    };
  },
});

export const contact = { get, set };
