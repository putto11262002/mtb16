import { getStore } from "@netlify/blobs";
import mime from "mime-types";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { webReadableStreamToNodejsReadableStream } from "../utils/stream";
import type {
  FileMetadata,
  FileStore,
  ListFilesOptions,
  ListFilesResult,
  StoredFile,
  StoreFileOptions,
} from "./types";

export interface NetlifyFileStoreConfig {
  /** Name of the Netlify Blobs store */
  storeName: string;
  /** Site ID (optional, auto-detected in Netlify environment) */
  siteID?: string;
  /** Access token (optional, auto-detected in Netlify environment) */
  token?: string;
}

/**
 * Converts a Readable stream to a Buffer
 */
async function streamToBuffer(stream: Readable): Promise<ArrayBuffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).buffer;
}

/**
 * Creates a new NetlifyFileStore instance
 */
export function createNetlifyFileStore(
  config: NetlifyFileStoreConfig,
): FileStore {
  const { storeName, siteID, token } = config;

  // Get the Netlify Blobs store
  const store = getStore({ name: storeName });

  const fileStore: FileStore = {
    async storeStream(
      stream: Readable,
      options: StoreFileOptions,
    ): Promise<FileMetadata> {
      const id = options.id || uuidv4();
      const mimeType =
        options.mimeType ||
        mime.lookup(options.name) ||
        "application/octet-stream";

      // Convert stream to Buffer
      const content = await streamToBuffer(stream);
      const now = new Date();

      const metadata: FileMetadata = {
        id,
        name: options.name,
        size: content.byteLength,
        mimeType,
        createdAt: now,
        updatedAt: now,
      };

      // Store metadata in Netlify Blobs metadata
      await store.set(id, content, {
        metadata: {
          name: metadata.name,
          size: metadata.size.toString(),
          mimeType: metadata.mimeType,
          createdAt: metadata.createdAt.toISOString(),
          updatedAt: metadata.updatedAt.toISOString(),
        },
      });

      return metadata;
    },

    async store(
      content: Buffer,
      options: StoreFileOptions,
    ): Promise<FileMetadata> {
      const id = options.id || uuidv4();
      const mimeType =
        options.mimeType ||
        mime.lookup(options.name) ||
        "application/octet-stream";

      const now = new Date();
      const metadata: FileMetadata = {
        id,
        name: options.name,
        size: content.length,
        mimeType,
        createdAt: now,
        updatedAt: now,
      };

      // Store metadata in Netlify Blobs metadata
      await store.set(id, Buffer.concat([content]).buffer, {
        metadata: {
          name: metadata.name,
          size: metadata.size.toString(),
          mimeType: metadata.mimeType,
          createdAt: metadata.createdAt.toISOString(),
          updatedAt: metadata.updatedAt.toISOString(),
        },
      });

      return metadata;
    },

    async getStream(id: string): Promise<Readable | null> {
      try {
        const result = await store.get(id, { type: "stream" });
        return webReadableStreamToNodejsReadableStream(result);
      } catch (error) {
        return null;
      }
    },

    async get(id: string): Promise<StoredFile | null> {
      try {
        const result = await store.getWithMetadata(id, { type: "arrayBuffer" });
        if (!result) return null;

        const { data, metadata } = result;
        if (!data || !metadata) return null;

        return {
          id,
          name: metadata.name as string,
          size: parseInt(metadata.size as string),
          mimeType: metadata.mimeType as string,
          createdAt: new Date(metadata.createdAt as string),
          updatedAt: new Date(metadata.updatedAt as string),
          content: Buffer.from(data as ArrayBuffer),
        };
      } catch (error) {
        return null;
      }
    },

    async getMetadata(id: string): Promise<FileMetadata | null> {
      try {
        const result = await store.getMetadata(id);
        if (!result || !result.metadata) return null;

        const { metadata } = result;
        return {
          id,
          name: metadata.name as string,
          size: parseInt(metadata.size as string),
          mimeType: metadata.mimeType as string,
          createdAt: new Date(metadata.createdAt as string),
          updatedAt: new Date(metadata.updatedAt as string),
        };
      } catch (error) {
        return null;
      }
    },

    async exists(id: string): Promise<boolean> {
      const metadata = await this.getMetadata(id);
      return metadata !== null;
    },

    async delete(id: string): Promise<boolean> {
      try {
        await store.delete(id);
        return true;
      } catch (error) {
        return false;
      }
    },

    async list(options: ListFilesOptions = {}): Promise<ListFilesResult> {
      try {
        const { blobs } = await store.list({
          prefix: options.mimeType ? undefined : undefined, // No direct filter, will filter later
        });

        // Get metadata for each blob to build FileMetadata
        const allMetadata: FileMetadata[] = [];
        for (const blob of blobs) {
          const metadata = await this.getMetadata(blob.key);
          if (metadata) {
            // Filter by MIME type if specified
            if (!options.mimeType || metadata.mimeType === options.mimeType) {
              allMetadata.push(metadata);
            }
          }
        }

        // Sort by creation date (newest first)
        allMetadata.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );

        const total = allMetadata.length;
        const offset = options.offset || 0;
        const limit = options.limit || total;

        const paginatedFiles = allMetadata.slice(offset, offset + limit);
        const hasMore = offset + limit < total;

        return {
          files: paginatedFiles,
          total,
          hasMore,
        };
      } catch (error) {
        return {
          files: [],
          total: 0,
          hasMore: false,
        };
      }
    },

    async count(): Promise<number> {
      try {
        const { blobs } = await store.list();
        return blobs.length;
      } catch (error) {
        return 0;
      }
    },
  };

  return fileStore;
}
