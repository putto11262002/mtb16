import {
  addAttachmentInputSchema,
  createNewsInputSchema,
  deleteNewsInputSchema,
  getManyNewsInputSchema,
  removeAttachmentInputSchema,
  updateNewsInputSchema,
  updatePreviewImageInputSchema,
} from "@/core/news/schema";
import { newsUsecase } from "@/core/news/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { handleError, isAuthenticated } from "./shared";

export const news = {
  create: defineAction({
    input: createNewsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await newsUsecase.create(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  update: defineAction({
    input: updateNewsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.update(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  updatePreviewImage: defineAction({
    accept: "form",
    input: updatePreviewImageInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.updatePreviewImage(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  addAttachment: defineAction({
    accept: "form",
    input: addAttachmentInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.addAttachment(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  removeAttachment: defineAction({
    input: removeAttachmentInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.removeAttachment(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  delete: defineAction({
    input: deleteNewsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.deleteNews(input);
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
        const result = await newsUsecase.getById(id);
        if (!result) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "News not found",
          });
        }
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getMany: defineAction({
    input: getManyNewsInputSchema,
    handler: async (input, ctx) => {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      try {
        const result = await newsUsecase.getMany(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  publish: defineAction({
    input: z.string().uuid(),
    handler: async (id, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.publish(id);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  unpublish: defineAction({
    input: z.string().uuid(),
    handler: async (id, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await newsUsecase.unpublish(id);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
};
