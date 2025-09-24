import {
  addAttachmentInputSchema,
  createAnnouncementInputSchema,
  deleteAnnouncementInputSchema,
  getManyAnnouncementsInputSchema,
  removeAttachmentInputSchema,
  updateAnnouncementInputSchema,
  updatePreviewImageInputSchema,
} from "@/core/announcement/schema";
import { annouyncementsUsecase } from "@/core/announcement/usecase";
import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { z } from "astro:content";
import { handleError, isAuthenticated } from "./shared";

export const announcement = {
  create: defineAction({
    input: createAnnouncementInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await annouyncementsUsecase.create(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  update: defineAction({
    input: updateAnnouncementInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await annouyncementsUsecase.update(input);
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
        await annouyncementsUsecase.updatePreviewImage(input);
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
        await annouyncementsUsecase.addAttachment(input);
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
        await annouyncementsUsecase.removeAttatch(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  delete: defineAction({
    input: deleteAnnouncementInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await annouyncementsUsecase.deleteAnnouncement(input);
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
        const result = await annouyncementsUsecase.getById(id);
        if (!result) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Announcement not found",
          });
        }
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getMany: defineAction({
    input: getManyAnnouncementsInputSchema,
    handler: async (input, ctx) => {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      try {
        const result = await annouyncementsUsecase.getMany(input);
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
        await annouyncementsUsecase.publish(id);
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
        await annouyncementsUsecase.unpublish(id);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
};
