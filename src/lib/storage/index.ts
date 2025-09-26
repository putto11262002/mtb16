import { Config } from "@/config";
import { getEnv } from "../utils/env";
import { createLocalFileStore, type LocalFileStoreConfig } from "./local";
import type { FileStore } from "./types";

// Singleton instance
let instance: FileStore | null = null;

/**
 * Factory function that returns a singleton FileStore instance
 * Reads configuration from environment variables
 */
export function getFileStore(): FileStore {
  if (!instance) {
    if (Config.dev) {
      // Read config from environment variables with Astro-friendly defaults
      const config: LocalFileStoreConfig = {
        baseDirectory: getEnv("FILE_STORE_BASE_DIR") || "temp/uploads",
        createDirectory: getEnv("FILE_STORE_CREATE_DIR") === "true" || true,
      };

      instance = createLocalFileStore(config);
    } else {
      throw new Error("NetlifyFileStore not implemented yet");
    }
  }
  return instance;
}
