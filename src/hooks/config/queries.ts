import type { ContactConfig, LandingPageConfig } from "@/core/config/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetLandingPageConfig = () =>
  useQuery({
    queryKey: ["config", "landing_page"],
    queryFn: async (): Promise<LandingPageConfig> => {
      const result = await actions.config.landingPage.get.orThrow({});
      return result as LandingPageConfig;
    },
  });

export const useGetContactConfig = () =>
  useQuery({
    queryKey: ["config", "contact"],
    queryFn: async (): Promise<ContactConfig> => {
      const result = await actions.config.contact.get.orThrow({});
      return result as ContactConfig;
    },
  });
