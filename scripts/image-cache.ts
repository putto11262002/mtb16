import { existsSync, mkdirSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, "../temp/image-cache");

function ensureExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export type ImageType = "avatar" | "picsum";

export class ImageCache {
  private static instance: ImageCache;
  private cacheReady = new Map<ImageType, boolean>();

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  async ensureCacheReady(type: ImageType, count = 10): Promise<void> {
    if (this.cacheReady.get(type)) return;

    ensureExists(CACHE_DIR);
    const typeDir = path.join(CACHE_DIR, type);
    ensureExists(typeDir);

    const existingFiles = await readdir(typeDir).catch(() => []);
    if (existingFiles.length >= count) {
      this.cacheReady.set(type, true);
      return;
    }

    console.log(`Downloading ${count} ${type} images for cache...`);

    const promises = Array.from({ length: count })
      .fill(0)
      .map(async (_, i) => {
        try {
          let url: string;
          if (type === "avatar") {
            // Use pravatar.cc for avatars
            url = `https://i.pravatar.cc/150?img=${i + 1}`;
          } else {
            // Use picsum with random parameter
            url = `https://picsum.photos/800/600?random=${i}`;
          }

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }

          const buffer = await response.arrayBuffer();
          const ext = "jpg";
          const filename = `${type}_${i}.${ext}`;
          const filepath = path.join(typeDir, filename);

          await writeFile(filepath, Buffer.from(buffer));
          console.log(`Cached ${filename}`);
        } catch (error) {
          console.warn(`Failed to cache ${type} image ${i}:`, error);
        }
      });

    await Promise.all(promises);
    this.cacheReady.set(type, true);
    console.log(`Image cache ready for ${type}`);
  }

  async getRandomCachedImage(type: ImageType): Promise<File> {
    await this.ensureCacheReady(type);

    const typeDir = path.join(CACHE_DIR, type);
    const files = await readdir(typeDir);

    if (files.length === 0) {
      throw new Error(`No cached images found for type: ${type}`);
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filepath = path.join(typeDir, randomFile);
    const buffer = await readFile(filepath);

    // Determine MIME type
    const ext = path.extname(randomFile).toLowerCase();
    let mimeType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".png") mimeType = "image/png";
    else if (ext === ".svg") mimeType = "image/svg+xml";

    return new File([new Uint8Array(buffer)], randomFile, { type: mimeType });
  }
}

// Convenience functions
export const imageCache = ImageCache.getInstance();

export async function getCachedAvatar(): Promise<File> {
  return imageCache.getRandomCachedImage("avatar");
}

export async function getCachedPicsum(): Promise<File> {
  return imageCache.getRandomCachedImage("picsum");
}
