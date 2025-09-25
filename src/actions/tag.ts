import { createTagInputSchema } from "@/core/tag/schema";
import { tagUsecase } from "@/core/tag/usecase";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { handleError, isAuthenticated } from "./shared";

export const tag = {
  create: defineAction({
    input: createTagInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await tagUsecase.create(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getAllTags: defineAction({
    input: z.void(),
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await tagUsecase.getAllTags();
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
};
