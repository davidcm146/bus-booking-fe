"use client";

import { useMemo, useState } from "react";

export function usePagination<T>(items: readonly T[], pageSize = 4) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, pageSize, safePage],
  );
  return {
    page: safePage,
    setPage,
    totalPages,
    pageItems,
    totalItems: items.length,
  } as const;
}
