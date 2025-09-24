import type { GetManyAnnouncementsInput } from "@/core/announcement/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetAnnouncements = (props: GetManyAnnouncementsInput) =>
  useQuery({
    queryKey: ["announcements", props],
    queryFn: async () => {
      const result = await actions.announcement.getMany.orThrow(props);
      return result;
    },
  });

export const useGetAnouncement = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["announcements", id],
    queryFn: async () => {
      const result = await actions.announcement.getById.orThrow(id!);
      return result;
    },
    enabled: !!id,
  });
