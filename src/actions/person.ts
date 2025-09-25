import {
  createPersonInputSchema,
  deletePersonInputSchema,
  getManyPersonsInputSchema,
  updatePersonInputSchema,
  updatePortraitInputSchema,
} from "@/core/person/schema";
import { personUsecase } from "@/core/person/usecase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { handleError, isAuthenticated } from "./shared";

export const person = {
  create: defineAction({
    input: createPersonInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await personUsecase.create(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  update: defineAction({
    input: updatePersonInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await personUsecase.update(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  updatePortrait: defineAction({
    accept: "form",
    input: updatePortraitInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await personUsecase.updatePortrait(input);
        return;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  delete: defineAction({
    input: deletePersonInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        await personUsecase.deletePerson(input);
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
        const result = await personUsecase.getById(id);
        if (!result) {
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Person not found",
          });
        }
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getMany: defineAction({
    input: getManyPersonsInputSchema,
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await personUsecase.getMany(input);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getAll: defineAction({
    input: z.object({}),
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await personUsecase.getAll();
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getPersonsByUnit: defineAction({
    input: z.object({ unitId: z.string().uuid() }),
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await personUsecase.getPersonsByUnit(input.unitId);
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),

  getPersonRankTree: defineAction({
    input: z.object({}),
    handler: async (input, ctx) => {
      try {
        const { success, error } = isAuthenticated(ctx);
        if (!success) throw error;
        const result = await personUsecase.getPersonRankTree();
        return result;
      } catch (error) {
        throw handleError(error, ctx);
      }
    },
  }),
};
