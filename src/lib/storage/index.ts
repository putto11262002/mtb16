import "dotenv/config";
import { getEnv } from "../utils/env";
import { createLocalFileStore, type LocalFileStoreConfig } from "./local";
import { createNetlifyFileStore, type NetlifyFileStoreConfig } from "./netlify";
import type { FileStore } from "./types";

// Singleton instance
let instance: FileStore | null = null;

/**
 * Factory function that returns a singleton FileStore instance
 * Reads configuration from environment variables
 */
export function getFileStore(): FileStore {
  console.log(process.env.NODE_ENV);
  if (!instance) {
    if (process.env.NODE_ENV !== "production") {
      // Read config from environment variables with Astro-friendly defaults
      const config: LocalFileStoreConfig = {
        baseDirectory: getEnv("FILE_STORE_BASE_DIR") || "temp/uploads",
        createDirectory: getEnv("FILE_STORE_CREATE_DIR") === "true" || true,
      };

      instance = createLocalFileStore(config);
    } else {
      // Use Netlify Blobs in production
      const config: NetlifyFileStoreConfig = {
        storeName: import.meta.env.FILESTORE_STORE_NAME || "files",
        // siteID and token are auto-detected in Netlify environment
      };

      instance = createNetlifyFileStore(config);
    }
  }
  return instance;
}
