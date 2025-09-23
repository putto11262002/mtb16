import { z } from "astro:schema";

/**
 * A generic type for paginated query results.
 * @template T - The type of items in the paginated result.
 */
export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  prevPage: number | null;
  nextPage: number | null;
  totalPages: number;
  totalItems: number;
};

export const paginationParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  pageSize: z.coerce.number().min(1).max(100).default(10).optional(),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
