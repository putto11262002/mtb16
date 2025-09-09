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
    if (import.meta.env.DEV) {
      // Read config from environment variables with Astro-friendly defaults
      const config: LocalFileStoreConfig = {
        baseDirectory: import.meta.env.FILESTORE_DIR || "./uploads",
        createDirectory: import.meta.env.FILESTORE_CREATE_DIR !== "true", // defaults to true unless explicitly set to 'false'
      };

      instance = createLocalFileStore(config);
    } else {
      throw new Error("NetlifyFileStore not implemented yet");
    }
  }
  return instance;
}
