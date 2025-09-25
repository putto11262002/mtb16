import { useMemo, useState } from "react";

export const usePersonFilters = () => {
  const [q, setQ] = useState("");
  const [unitId, setUnitId] = useState<string | undefined>();
  const [rank, setRank] = useState<string | undefined>();

  const debouncedQ = useMemo(() => {
    // Simple debounce, in real app use a proper debounce hook
    return q;
  }, [q]);

  return {
    q,
    setQ,
    debouncedQ,
    unitId,
    setUnitId,
    rank,
    setRank,
  };
};
