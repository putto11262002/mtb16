import { getFileStore } from "@/lib/storage";
import { nodejsReadableStreamToWebReadableStream } from "@/lib/utils/stream";
import type { APIRoute } from "astro";
const storage = getFileStore();
export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const id = params.id!;
  const [stream, metadata] = await Promise.all([
    storage.getStream(id),
    storage.getMetadata(id),
  ]);

  if (!stream) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(nodejsReadableStreamToWebReadableStream(stream), {
    status: 200,
    headers: {
      "Content-Type": metadata?.mimeType || "application/octet-stream",
    },
  });
};
