import * as Sentry from "@sentry/astro";
import type { Logger } from "./index";

const LOG_LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

export const createSentryLogger = (level: string): Logger => {
  const currentLevel = LOG_LEVELS[level as LogLevel] ?? LOG_LEVELS.info;

  return {
    debug: (message: string, ...args: any[]) => {
      if (currentLevel <= LOG_LEVELS.debug) {
        Sentry.logger.debug(message, ...args);
      }
    },
    info: (message: string, ...args: any[]) => {
      if (currentLevel <= LOG_LEVELS.info) {
        Sentry.logger.info(message, ...args);
      }
    },
    warn: (message: string, ...args: any[]) => {
      if (currentLevel <= LOG_LEVELS.warn) {
        Sentry.logger.warn(message, ...args);
      }
    },
    error: (message: string, ...args: any[]) => {
      if (currentLevel <= LOG_LEVELS.error) {
        Sentry.logger.error(message, ...args);
      }
    },
  };
};
