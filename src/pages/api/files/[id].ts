import { getFileStore } from "@/lib/storage";
import type { APIRoute } from "astro";
import type { Readable } from "node:stream";
const storage = getFileStore();
export const prerender = false;

export const nodejsReadableStreamToWebReadableStream = (
  node: Readable,
): ReadableStream => {
  return new ReadableStream({
    start(controller) {
      // https://streams.spec.whatwg.org/#example-rs-push-backpressure
      node.on("data", (chunk) => {
        controller.enqueue(chunk);
        if (!controller.desiredSize) {
          node.pause();
        }
      });
      node.on("end", () => {
        controller.close();
      });
      node.on("error", (err) => {
        controller.error(err);
      });
    },
    pull() {
      if (node.isPaused()) {
        node.resume();
      }
    },
    cancel() {
      node.destroy();
    },
  });
};

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
