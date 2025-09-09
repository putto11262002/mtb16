import { promises as fs } from "fs";
import { createReadStream, createWriteStream } from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";
import type {
  FileStore,
  FileMetadata,
  StoredFile,
  StoreFileOptions,
  ListFilesOptions,
  ListFilesResult,
} from "./types";

export interface LocalFileStoreConfig {
  /** Base directory for file storage */
  baseDirectory: string;
  /** Whether to create the directory if it doesn't exist */
  createDirectory?: boolean;
}

interface StoredFileInfo {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a new LocalFileStore instance
 */
export function createLocalFileStore(config: LocalFileStoreConfig): FileStore {
  const { baseDirectory, createDirectory = true } = config;

  // Ensure base directory exists
  const initializeDirectory = async () => {
    if (createDirectory) {
      try {
        await fs.mkdir(baseDirectory, { recursive: true });
      } catch (error) {
        console.error("Error creating base directory:", error);
      }
    }
  };

  const getFilePath = (id: string): string => {
    return path.join(baseDirectory, id);
  };

  const getMetadataPath = (id: string): string => {
    return path.join(baseDirectory, `${id}.meta.json`);
  };

  const saveMetadata = async (metadata: FileMetadata): Promise<void> => {
    const metaPath = getMetadataPath(metadata.id);
    const fileInfo: StoredFileInfo = {
      id: metadata.id,
      name: metadata.name,
      size: metadata.size,
      mimeType: metadata.mimeType,
      createdAt: metadata.createdAt.toISOString(),
      updatedAt: metadata.updatedAt.toISOString(),
    };
    await fs.writeFile(metaPath, JSON.stringify(fileInfo, null, 2));
  };

  const loadMetadata = async (id: string): Promise<FileMetadata | null> => {
    try {
      const metaPath = getMetadataPath(id);
      const data = await fs.readFile(metaPath, "utf-8");
      const fileInfo: StoredFileInfo = JSON.parse(data);

      return {
        id: fileInfo.id,
        name: fileInfo.name,
        size: fileInfo.size,
        mimeType: fileInfo.mimeType,
        createdAt: new Date(fileInfo.createdAt),
        updatedAt: new Date(fileInfo.updatedAt),
      };
    } catch (error) {
      return null;
    }
  };

  const fileStore: FileStore = {
    async storeStream(
      stream: Readable,
      options: StoreFileOptions,
    ): Promise<FileMetadata> {
      await initializeDirectory();

      const id = options.id || uuidv4();
      const filePath = getFilePath(id);
      const mimeType =
        options.mimeType ||
        mime.lookup(options.name) ||
        "application/octet-stream";

      // Create write stream and pipe data
      const writeStream = createWriteStream(filePath);
      await pipeline(stream, writeStream);

      // Get file size
      const stats = await fs.stat(filePath);
      const now = new Date();

      const metadata: FileMetadata = {
        id,
        name: options.name,
        size: stats.size,
        mimeType,
        createdAt: now,
        updatedAt: now,
      };

      await saveMetadata(metadata);
      return metadata;
    },

    async store(
      content: Buffer,
      options: StoreFileOptions,
    ): Promise<FileMetadata> {
      await initializeDirectory();

      const id = options.id || uuidv4();
      const filePath = getFilePath(id);
      const mimeType =
        options.mimeType ||
        mime.lookup(options.name) ||
        "application/octet-stream";

      await fs.writeFile(filePath, content);

      const now = new Date();
      const metadata: FileMetadata = {
        id,
        name: options.name,
        size: content.length,
        mimeType,
        createdAt: now,
        updatedAt: now,
      };

      await saveMetadata(metadata);
      return metadata;
    },

    async getStream(id: string): Promise<Readable | null> {
      try {
        const filePath = getFilePath(id);
        await fs.access(filePath); // Check if file exists
        return createReadStream(filePath);
      } catch (error) {
        return null;
      }
    },

    async get(id: string): Promise<StoredFile | null> {
      try {
        const metadata = await loadMetadata(id);
        if (!metadata) return null;

        const filePath = getFilePath(id);
        const content = await fs.readFile(filePath);

        return {
          ...metadata,
          content,
        };
      } catch (error) {
        return null;
      }
    },

    async getMetadata(id: string): Promise<FileMetadata | null> {
      return await loadMetadata(id);
    },

    async exists(id: string): Promise<boolean> {
      try {
        const filePath = getFilePath(id);
        await fs.access(filePath);
        return true;
      } catch (error) {
        return false;
      }
    },

    async delete(id: string): Promise<boolean> {
      try {
        const filePath = getFilePath(id);
        const metaPath = getMetadataPath(id);

        await fs.unlink(filePath);
        await fs.unlink(metaPath);
        return true;
      } catch (error) {
        return false;
      }
    },

    async list(options: ListFilesOptions = {}): Promise<ListFilesResult> {
      await initializeDirectory();

      try {
        const files = await fs.readdir(baseDirectory);
        const metaFiles = files.filter((file) => file.endsWith(".meta.json"));

        let allMetadata: FileMetadata[] = [];

        for (const metaFile of metaFiles) {
          const id = metaFile.replace(".meta.json", "");
          const metadata = await loadMetadata(id);
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
        await initializeDirectory();
        const files = await fs.readdir(baseDirectory);
        return files.filter((file) => file.endsWith(".meta.json")).length;
      } catch (error) {
        return 0;
      }
    },
  };

  return fileStore;
}
