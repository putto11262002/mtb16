import {
  isDeleteAnnouncementAction,
  isPublishAnnouncementAction,
  isUnpublishAnnouncementAction,
  useAnnouncementAction,
} from "@/components/announcement/admin/announcement-action-context";
import {
  useDeleteAnnouncement,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
} from "@/hooks/announcement/mutation";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAnnouncementFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const parsedPublished = () => {
    if (searchParams.get("published") === "true") return true;
    if (searchParams.get("published") === "false") return false;
    return undefined;
  };

  const [q, setQ] = useState("");
  const [published, setPublished] = useState<boolean | undefined>(
    parsedPublished,
  );

  const debouncedQ = useDebounce(q, 300);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      ...(q ? { q } : {}),
    }));
  }, [debouncedQ]);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      ...(published !== undefined ? { published: String(published) } : {}),
    }));
  }, [published]);

  return {
    q,
    debouncedQ,
    setQ,
    published,
    setPublished,
  };
};

export const useAnnouncementActions = () => {
  const { announcementAction } = useAnnouncementAction();

  const { mutate: _deleteAnnouncement, isPending: isDeleting } =
    useDeleteAnnouncement();

  const { mutate: unpublish, isPending: isUnpublishing } =
    useUnpublishAnnouncement();
  const { mutate: publish, isPending: isPublishing } = usePublishAnnouncement();

  const publishAnnouncement = () => {
    if (!isPublishAnnouncementAction(announcementAction)) {
      return;
    }
    publish(announcementAction.id, {
      onSuccess: () => {
        toast("Announcement published successfully", {});
      },
      onError: () => {
        toast.error("Something went wrong, please try again.");
      },
    });
  };

  const unpublishAnnouncement = () => {
    if (!isUnpublishAnnouncementAction(announcementAction)) {
      return;
    }
    unpublish(announcementAction.id, {
      onSuccess: () => {
        toast("Announcement unpublished successfully", {});
      },
      onError: (err) => {
        toast.error(err?.message || "Something went wrong, please try again.");
      },
    });
  };

  const deleteAnnouncement = () => {
    if (!isDeleteAnnouncementAction(announcementAction)) {
      return;
    }
    _deleteAnnouncement(
      { id: announcementAction.id },
      {
        onSuccess: () => toast("Announcement deleted successfully", {}),
        onError: (err) => {
          toast.error(
            err?.message || "Something went wrong, please try again.",
          );
        },
      },
    );
  };

  return {
    announcementAction,
    publishAnnouncement,
    unpublishAnnouncement,
    deleteAnnouncement,
    isDeleting,
    isUnpublishing,
    isPublishing,
  };
};
