import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useDirectoryFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | undefined>(
    searchParams.get("tag") || undefined,
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
      ...(tag ? { tag } : {}),
    }));
  }, [tag]);

  return {
    q,
    debouncedQ,
    setQ,
    tag,
    setTag,
  };
};
