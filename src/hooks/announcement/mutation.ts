import type {
  AddAttachmentInput,
  createAnnouncementInput,
  DeleteAnnouncementInput,
  RemoveAttachmentInput,
  updateAnnouncementInput,
  UpdatePreviewImage,
} from "@/core/announcement/schema";
import { transformToFormData } from "@/lib/utils/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeleteAnnouncementInput) => {
      await actions.announcement.delete.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const usePublishAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await actions.announcement.publish.orThrow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUnpublishAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await actions.announcement.unpublish.orThrow(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: createAnnouncementInput) => {
      await actions.announcement.create.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: updateAnnouncementInput) => {
      await actions.announcement.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdatePreviewImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdatePreviewImage) => {
      const formData = new FormData();
      transformToFormData(data, formData);
      await actions.announcement.updatePreviewImage.orThrow(formData);
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useAddAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddAttachmentInput) => {
      const formData = new FormData();
      transformToFormData(data, formData);
      await actions.announcement.addAttachment.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRemoveAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RemoveAttachmentInput) => {
      await actions.announcement.removeAttachment.orThrow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
