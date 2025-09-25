import type {
  AddAttachmentInput,
  createNewsInput,
  DeleteNewsInput,
  RemoveAttachmentInput,
  updateNewsInput,
  UpdatePreviewImage,
} from "@/core/news/schema";
import { transformToFormData } from "@/lib/utils/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeleteNewsInput) => {
      await actions.news.delete.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const usePublishNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await actions.news.publish.orThrow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUnpublishNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await actions.news.unpublish.orThrow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: createNewsInput) => {
      await actions.news.create.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: updateNewsInput) => {
      await actions.news.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateNewsPreviewImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdatePreviewImage) => {
      const formData = new FormData();
      transformToFormData(data, formData);
      await actions.news.updatePreviewImage.orThrow(formData);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useAddNewsAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddAttachmentInput) => {
      const formData = new FormData();
      transformToFormData(data, formData);
      await actions.news.addAttachment.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRemoveNewsAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RemoveAttachmentInput) => {
      await actions.news.removeAttachment.orThrow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
