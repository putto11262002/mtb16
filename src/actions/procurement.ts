import {
  addProcurementAttachmentInputSchema,
  createProcurementInputSchema,
  deleteProcurementInputSchema,
  getManyProcurementsInputSchema,
  removeProcurementAttachmentInputSchema,
  updateAnnualPlanInputSchema,
  updateInvitationDocsInputSchema,
  updatePriceDisclosureDocsInputSchema,
  updateProcurementInputSchema,
  updateWinnerDeclarationDocsInputSchema,
} from "@/core/procurement/schema";
import { procurementUsecase } from "@/core/procurement/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { handleError, isAuthenticated } from "./shared";

export const procurement = {
  create: defineAction({
    input: createProcurementInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await procurementUsecase.create(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  update: defineAction({
    input: updateProcurementInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.update(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  delete: defineAction({
    input: deleteProcurementInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.deleteProcurement(input);
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
        const result = await procurementUsecase.getById(id);
        if (!result) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Procurement not found",
          });
        }
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getMany: defineAction({
    input: getManyProcurementsInputSchema,
    handler: async (input, ctx) => {
      const { success, error } = isAuthenticated(ctx);
      if (!success) throw error;
      try {
        const result = await procurementUsecase.getMany(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  updateAnnualPlan: defineAction({
    accept: "form",
    input: updateAnnualPlanInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.updateAnnualPlan(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  updateInvitationDocs: defineAction({
    accept: "form",
    input: updateInvitationDocsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.updateInvitationDocs(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  updatePriceDisclosureDocs: defineAction({
    accept: "form",
    input: updatePriceDisclosureDocsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.updatePriceDisclosureDocs(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  updateWinnerDeclarationDocs: defineAction({
    accept: "form",
    input: updateWinnerDeclarationDocsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.updateWinnerDeclarationDocs(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  addAttachment: defineAction({
    accept: "form",
    input: addProcurementAttachmentInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.addAttachment(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  removeAttachment: defineAction({
    input: removeProcurementAttachmentInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await procurementUsecase.removeAttachment(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
};
