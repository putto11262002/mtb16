import { Readable } from "node:stream";

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

export const webReadableStreamToNodejsReadableStream = (
  web: ReadableStream,
): Readable => {
  const reader = web.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (error) {
        this.destroy(error as Error);
      }
    },
    destroy(err, callback) {
      reader
        .cancel()
        .then(() => callback(err))
        .catch(callback);
    },
  });
};
