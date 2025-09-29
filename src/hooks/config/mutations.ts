import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useUpdateLandingPageConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      heroTitle: string;
      newsTag?: string;
      announcementsTag?: string;
      popupEnabled: boolean;
    }) => {
      await actions.config.landingPage.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "landing_page"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateLandingPageHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { heroImage: File }) => {
      const formData = new FormData();
      formData.append("heroImage", input.heroImage);
      await actions.config.landingPage.updateHeroImage.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "landing_page"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateLandingPagePopupImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { popupImage: File }) => {
      const formData = new FormData();
      formData.append("popupImage", input.popupImage);
      await actions.config.landingPage.updatePopupImage.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "landing_page"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateContactConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      addressTh?: string;
      phone?: string;
      email?: string;
      mapEmbed?: string;
      facebookOfficial?: string;
      facebookNews?: string;
      tiktok?: string;
    }) => {
      await actions.config.contact.set.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config", "contact"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
