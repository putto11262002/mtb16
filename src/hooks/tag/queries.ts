import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetAllTags = () =>
  useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const result = await actions.tag.getAllTags.orThrow();
      return result;
    },
  });
