import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useProcurementFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState("");

  const parseStatus = () => {
    const statusParam = searchParams.get("status");
    if (statusParam === "open" || statusParam === "closed") {
      return statusParam;
    }
    return undefined;
  };
  const [status, setStatus] = useState<"open" | "closed" | undefined>(
    parseStatus,
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
      ...(status ? { status } : {}),
    }));
  }, [status]);

  return {
    q,
    debouncedQ,
    setQ,
    status,
    setStatus,
  };
};
