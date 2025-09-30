import {
  createDirectoryEntryInputSchema,
  deleteDirectoryEntryInputSchema,
  getManyDirectoryEntriesInputSchema,
  updateDirectoryEntryImageInputSchema,
  updateDirectoryEntryInputSchema,
} from "@/core/directory/schema";
import { directoryUsecase } from "@/core/directory/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";
import { handleError, isAuthenticated } from "./shared";

export const directory = {
  create: defineAction({
    input: createDirectoryEntryInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await directoryUsecase.create(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  update: defineAction({
    input: updateDirectoryEntryInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await directoryUsecase.update(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
  updateImage: defineAction({
    accept: "form",
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const validation = updateDirectoryEntryImageInputSchema.safeParse({
          id: input.get("id"),
          file: input.get("file"),
        });
        if (!validation.success) {
          throw validation.error;
        }
        await directoryUsecase.updateImage(validation.data);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  deleteEntry: defineAction({
    input: deleteDirectoryEntryInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await directoryUsecase.deleteEntry(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getById: defineAction({
    input: z.string().uuid(),
    handler: async (id, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await directoryUsecase.getById(id);
        if (!result) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Directory entry not found",
          });
        }
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getMany: defineAction({
    input: getManyDirectoryEntriesInputSchema,
    handler: async (input, ctx) => {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      try {
        const result = await directoryUsecase.getMany(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
};
