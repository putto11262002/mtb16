import { faker } from "@faker-js/faker";
import { existsSync, mkdirSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import * as path from "node:path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const PDFDocument = require("pdfkit");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, "../temp/mock-file-cache");

function ensureExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export type FileType = "avatar" | "picsum" | "pdf";

export class MockFileCache {
  private static instance: MockFileCache;
  private cacheReady = new Map<FileType, boolean>();

  static getInstance(): MockFileCache {
    if (!MockFileCache.instance) {
      MockFileCache.instance = new MockFileCache();
    }
    return MockFileCache.instance;
  }

  async ensureCacheReady(type: FileType, count = 10): Promise<void> {
    if (this.cacheReady.get(type)) return;

    ensureExists(CACHE_DIR);
    const typeDir = path.join(CACHE_DIR, type);
    ensureExists(typeDir);

    const existingFiles = await readdir(typeDir).catch(() => []);
    if (existingFiles.length >= count) {
      this.cacheReady.set(type, true);
      return;
    }

    if (type === "pdf") {
      console.log(`Generating ${count} ${type} files for cache...`);
      const promises = Array.from({ length: count })
        .fill(0)
        .map(async (_, i) => {
          try {
            const doc = new PDFDocument();
            const buffers: Buffer[] = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {});

            // Add some content
            doc.fontSize(25).text(faker.lorem.sentence(), 100, 100);
            doc.fontSize(18).text(faker.lorem.paragraph(), 100, 150);
            doc.fontSize(14).text(faker.lorem.paragraphs(2), 100, 200);

            doc.end();

            await new Promise<void>((resolve) => {
              doc.on("end", resolve);
            });

            const buffer = Buffer.concat(buffers);
            const filename = `${type}_${i}.pdf`;
            const filepath = path.join(typeDir, filename);

            await writeFile(filepath, buffer);
            console.log(`Generated ${filename}`);
          } catch (error) {
            console.warn(`Failed to generate ${type} file ${i}:`, error);
          }
        });

      await Promise.all(promises);
    } else {
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
    }

    this.cacheReady.set(type, true);
    console.log(`Mock file cache ready for ${type}`);
  }

  async getRandomCachedFile(type: FileType): Promise<File> {
    await this.ensureCacheReady(type);

    const typeDir = path.join(CACHE_DIR, type);
    const files = await readdir(typeDir);

    if (files.length === 0) {
      throw new Error(`No cached files found for type: ${type}`);
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
    else if (ext === ".pdf") mimeType = "application/pdf";

    return new File([new Uint8Array(buffer)], randomFile, { type: mimeType });
  }
}

// Convenience functions
export const mockFileCache = MockFileCache.getInstance();

export async function getCachedAvatar(): Promise<File> {
  return mockFileCache.getRandomCachedFile("avatar");
}

export async function getCachedPicsum(): Promise<File> {
  return mockFileCache.getRandomCachedFile("picsum");
}

export async function getCachedPdf(): Promise<File> {
  return mockFileCache.getRandomCachedFile("pdf");
}
