import type { PaginatedResult } from "./types";

export const createPaginatedResult = <T>(
  items: T[],
  count: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> => {
  return {
    items: items,
    pageSize: pageSize,
    page: page,
    totalItems: count,
    totalPages: Math.ceil(count / (pageSize ?? 10)),
    prevPage: page && page > 1 ? page - 1 : null,
    nextPage: page && page * pageSize < count ? page + 1 : null,
  };
};
