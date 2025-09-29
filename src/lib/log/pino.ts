import pino from "pino";
import type { Logger } from "./index";

export const createPinoLogger = (level: string): Logger => {
  const pinoLogger = pino({});

  return {
    debug: (message: string, ...args: any[]) =>
      pinoLogger.debug(message, ...args),
    info: (message: string, ...args: any[]) =>
      pinoLogger.info(message, ...args),
    warn: (message: string, ...args: any[]) =>
      pinoLogger.warn(message, ...args),
    error: (message: string, ...args: any[]) =>
      pinoLogger.error(message, ...args),
  };
};
