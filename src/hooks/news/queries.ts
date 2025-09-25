import type { GetManyNewsInput } from "@/core/news/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetNews = (props: GetManyNewsInput) =>
  useQuery({
    queryKey: ["news", props],
    queryFn: async () => {
      const result = await actions.news.getMany.orThrow(props);
      return result;
    },
  });

export const useGetNewsById = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const result = await actions.news.getById.orThrow(id!);
      return result;
    },
    enabled: !!id,
  });
