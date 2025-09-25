import type {
  createDirectoryEntryInput,
  deleteDirectoryEntryInput,
  UpdateDirectoryEntryImage,
  updateDirectoryEntryInput,
} from "@/core/directory/schema";
import { transformToFormData } from "@/lib/utils/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useDeleteDirectoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: deleteDirectoryEntryInput) => {
      await actions.directory.deleteEntry.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryEntries"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateDirectoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: createDirectoryEntryInput) => {
      await actions.directory.create.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryEntries"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateDirectoryEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: updateDirectoryEntryInput) => {
      await actions.directory.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryEntries"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateDirectoryEntryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateDirectoryEntryImage) => {
      const formData = new FormData();
      transformToFormData(data, formData);
      await actions.directory.updateImage.orThrow(formData);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directoryEntries"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
