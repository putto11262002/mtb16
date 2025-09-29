import type { GlobalSettings } from "@/core/config/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetGlobalSettings = () =>
  useQuery({
    queryKey: ["config", "global"],
    queryFn: async (): Promise<GlobalSettings> => {
      const result = await actions.config.global.get.orThrow({});
      return result;
    },
  });
