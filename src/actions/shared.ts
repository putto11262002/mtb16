/**
 * A generic type for mutation results.
 * Represents either a successful result with an ID and message,
 * or a failure with an error message.
 */
export type MutationResult =
  | {
      ok: true;
      id: string;
      message: string;
    }
  | {
      ok: false;
      error: string;
    };

/**
 * A generic type for paginated query results.
 * @template T - The type of items in the paginated result.
 */
export type PaginatedQueryResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  prevPage: number | null;
  nextPage: number | null;
  totalPages: number;
  totalItems: number;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};
