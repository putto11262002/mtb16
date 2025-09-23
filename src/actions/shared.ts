import { ActionError, type ActionAPIContext } from "astro:actions";
import { getLogger } from "@/lib/log";

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

/**
 * Logs an error using the application logger.
 * Separates logging concerns from error serialization.
 */
export const logError = (error: unknown, context?: string): void => {
  const logger = getLogger();
  const contextMessage = context ? `[${context}] ` : "";
  
  if (error instanceof Error) {
    logger.error(`${contextMessage}${error.message}`, {
      stack: error.stack,
      name: error.name,
    });
  } else {
    logger.error(`${contextMessage}Unknown error occurred`, { error });
  }
};

/**
 * Serializes an error into an ActionError format.
 * Does not handle logging - use logError() separately for that.
 */
export const serializeError = (error: unknown): ActionError => {
  if (error instanceof Error) {
    return new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
      stack: error.stack,
    });
  }

  return new ActionError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unknown error occurred",
  });
};

/**
 * Extracts context information from ActionAPIContext for error logging.
 * Attempts to get action name and route information automatically.
 */
const extractErrorContext = (ctx?: ActionAPIContext): string => {
  if (!ctx) return "unknown";

  try {
    // Try to get action information from the URL or request
    const pathname = ctx.url?.pathname || ctx.request?.url;
    
    // If it's an action request, it might follow the pattern /_actions/[action-name]
    if (pathname && pathname.includes("/_actions/")) {
      const actionPath = pathname.split("/_actions/")[1];
      if (actionPath) {
        return `action:${actionPath}`;
      }
    }
    
    // Fall back to route pattern or pathname
    if (ctx.routePattern) {
      return `route:${ctx.routePattern}`;
    }
    
    if (pathname) {
      const url = new URL(pathname, "http://localhost");
      return `path:${url.pathname}`;
    }
    
    return "action:unknown";
  } catch {
    return "action:parse-error";
  }
};

/**
 * Combined function that logs and serializes an error with automatic context extraction.
 * Automatically extracts context information from the ActionAPIContext.
 */
export const handleError = (error: unknown, ctx?: ActionAPIContext): ActionError => {
  const context = extractErrorContext(ctx);
  logError(error, context);
  return serializeError(error);
};

/**
 * Checks if the user is authenticated in the current action context.
 * Returns a standardized result object indicating success/failure.
 */
export const isAuthenticated = (ctx: ActionAPIContext) => {
  if (!ctx.locals.session) {
    return {
      success: false,
      error: new ActionError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
      }),
    } as const;
  }
  return { success: true, error: null } as const;
};

/**
 * A higher-order function that wraps action handlers with authentication.
 * Automatically checks authentication and handles the error if not authenticated.
 */
export const withAuth = <TInput, TOutput>(
  handler: (input: TInput, ctx: ActionAPIContext) => Promise<TOutput>
) => {
  return async (input: TInput, ctx: ActionAPIContext): Promise<TOutput> => {
    const { success, error } = isAuthenticated(ctx);
    if (!success) throw error;
    return handler(input, ctx);
  };
};
