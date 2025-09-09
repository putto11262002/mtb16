import type { Readable } from "stream";

/**
 * Represents file metadata
 */
export interface FileMetadata {
  /** Unique identifier for the file */
  id: string;
  /** Original filename */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type of the file */
  mimeType: string;
  /** Timestamp when file was created */
  createdAt: Date;
  /** Timestamp when file was last modified */
  updatedAt: Date;
}

/**
 * File content with metadata
 */
export interface StoredFile extends FileMetadata {
  /** File content as Buffer */
  content: Buffer;
}

/**
 * Options for storing a file
 */
export interface StoreFileOptions {
  /** Original filename */
  name: string;
  /** MIME type (optional, will be inferred if not provided) */
  mimeType?: string;
  /** Custom file ID (optional, will be generated if not provided) */
  id?: string;
}

/**
 * Options for listing files
 */
export interface ListFilesOptions {
  /** Maximum number of files to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Filter by MIME type */
  mimeType?: string;
}

/**
 * Result of listing files operation
 */
export interface ListFilesResult {
  /** Array of file metadata */
  files: FileMetadata[];
  /** Total count of files (before pagination) */
  total: number;
  /** Whether there are more files available */
  hasMore: boolean;
}

/**
 * Abstract interface for file storage operations
 */
export interface FileStore {
  /**
   * Store a file from a readable stream
   * @param stream Readable stream containing file content
   * @param options Store options
   * @returns Promise resolving to file metadata
   */
  storeStream(
    stream: Readable,
    options: StoreFileOptions,
  ): Promise<FileMetadata>;

  /**
   * Store a file from buffer (convenience method)
   * @param content File content as Buffer
   * @param options Store options
   * @returns Promise resolving to file metadata
   */
  store(content: Buffer, options: StoreFileOptions): Promise<FileMetadata>;

  /**
   * Get a readable stream for a file by ID
   * @param id File ID
   * @returns Promise resolving to readable stream or null if not found
   */
  getStream(id: string): Promise<Readable | null>;

  /**
   * Retrieve a file by ID (loads entire file into memory)
   * @param id File ID
   * @returns Promise resolving to stored file or null if not found
   */
  get(id: string): Promise<StoredFile | null>;

  /**
   * Get file metadata by ID
   * @param id File ID
   * @returns Promise resolving to file metadata or null if not found
   */
  getMetadata(id: string): Promise<FileMetadata | null>;

  /**
   * Check if a file exists
   * @param id File ID
   * @returns Promise resolving to boolean
   */
  exists(id: string): Promise<boolean>;

  /**
   * Delete a file by ID
   * @param id File ID
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: string): Promise<boolean>;

  /**
   * List files with optional filtering and pagination
   * @param options List options
   * @returns Promise resolving to list result
   */
  list(options?: ListFilesOptions): Promise<ListFilesResult>;

  /**
   * Get total count of stored files
   * @returns Promise resolving to number of files
   */
  count(): Promise<number>;
}
