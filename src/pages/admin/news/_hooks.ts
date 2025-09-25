import {
  isDeleteNewsAction,
  isPublishNewsAction,
  isUnpublishNewsAction,
  useNewsAction,
} from "@/components/news/admin/news-action-context";
import {
  useDeleteNews,
  usePublishNews,
  useUnpublishNews,
} from "@/hooks/news/mutation";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useNewsFilters = () => {
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

export const useNewsActions = () => {
  const { newsAction } = useNewsAction();

  const { mutate: _deleteNews, isPending: isDeleting } = useDeleteNews();

  const { mutate: unpublish, isPending: isUnpublishing } = useUnpublishNews();
  const { mutate: publish, isPending: isPublishing } = usePublishNews();

  const publishNews = () => {
    if (!isPublishNewsAction(newsAction)) {
      return;
    }
    publish(newsAction.id, {
      onSuccess: () => {
        toast("News published successfully", {});
      },
      onError: () => {
        toast.error("Something went wrong, please try again.");
      },
    });
  };

  const unpublishNews = () => {
    if (!isUnpublishNewsAction(newsAction)) {
      return;
    }
    unpublish(newsAction.id, {
      onSuccess: () => {
        toast("News unpublished successfully", {});
      },
      onError: (err) => {
        toast.error(err?.message || "Something went wrong, please try again.");
      },
    });
  };

  const deleteNews = () => {
    if (!isDeleteNewsAction(newsAction)) {
      return;
    }
    _deleteNews(
      { id: newsAction.id },
      {
        onSuccess: () => toast("News deleted successfully", {}),
        onError: (err) => {
          toast.error(
            err?.message || "Something went wrong, please try again.",
          );
        },
      },
    );
  };

  return {
    newsAction,
    publishNews,
    unpublishNews,
    deleteNews,
    isDeleting,
    isUnpublishing,
    isPublishing,
  };
};
