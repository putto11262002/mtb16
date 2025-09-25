import type { getManyDirectoryEntriesInput } from "@/core/directory/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetDirectoryEntries = (props: getManyDirectoryEntriesInput) =>
  useQuery({
    queryKey: ["directoryEntries", props],
    queryFn: async () => {
      const result = await actions.directory.getMany.orThrow(props);
      return result;
    },
  });

export const useGetDirectoryEntry = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["directoryEntries", id],
    queryFn: async () => {
      const result = await actions.directory.getById.orThrow(id!);
      return result;
    },
    enabled: !!id,
  });
