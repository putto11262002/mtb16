import type {
  CreatePersonInput,
  DeletePersonInput,
  UpdatePersonInput,
  UpdatePortraitInput,
} from "@/core/person/schema";
import { transformToFormData } from "@/lib/utils/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useDeletePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeletePersonInput) => {
      await actions.person.delete.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePersonInput) => {
      await actions.person.create.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePersonInput) => {
      await actions.person.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdatePersonPortrait = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdatePortraitInput) => {
      const formData = new FormData();
      transformToFormData(data, formData);
      await actions.person.updatePortrait.orThrow(formData);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
