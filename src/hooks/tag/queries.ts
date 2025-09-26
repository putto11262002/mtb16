import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetAllTags = (type: string) =>
  useQuery({
    queryKey: ["tags", type],
    queryFn: async () => {
      const result = await actions.tag.getAllTags.orThrow({ type });
      return result;
    },
  });
