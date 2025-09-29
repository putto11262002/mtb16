import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useUpdateGlobalSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      heroTitle?: string;
      newsTag?: string;
      announcementsTag?: string;
      popupEnabled?: boolean;
      addressTh?: string;
      phone?: string;
      email?: string;
      mapEmbed?: string;
      facebookOfficial?: string;
      facebookNews?: string;
      tiktok?: string;
    }) => {
      await actions.config.global.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "global"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { heroImage: File }) => {
      const formData = new FormData();
      formData.append("heroImage", input.heroImage);
      await actions.config.global.updateHeroImage.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "global"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdatePopupImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { popupImage: File }) => {
      const formData = new FormData();
      formData.append("popupImage", input.popupImage);
      await actions.config.global.updatePopupImage.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "global"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAboutUsHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { aboutUsHeroImage: File }) => {
      const formData = new FormData();
      formData.append("aboutUsHeroImage", input.aboutUsHeroImage);
      await actions.config.global.updateAboutUsHeroImage.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "global"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
