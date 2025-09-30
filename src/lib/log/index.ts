import { createConsoleLogger } from "./console";

/**
 * Defines a standard logging interface with methods for different log levels.
 *
 * @remarks
 * This interface can be implemented by any logger class, providing flexibility.
 */
export interface Logger {
  /** Logs a message with a "debug" level. */
  debug(message: string, ...args: any[]): void;

  /** Logs a message with an "info" level. */
  info(message: string, ...args: any[]): void;

  /** Logs a message with a "warn" level. */
  warn(message: string, ...args: any[]): void;

  /** Logs a message with an "error" level. */
  error(message: string, ...args: any[]): void;
}

const logger: null | Logger = null;
export const getLogger = (): Logger => {
  if (logger) return logger;
  const level = process.env.LOG_LEVEL || "info";
  return createConsoleLogger(level);
};
