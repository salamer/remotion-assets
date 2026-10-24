import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { bundle } from "@remotion/bundler";
import { enableTailwind } from "@remotion/tailwind-v4";

/** A loopback-only static server also works in containers without interface enumeration. */
export async function createBundleServer() {
  const directory = await bundle({
    entryPoint: path.resolve("src/index.ts"),
    rspack: true,
    bundlerOverride: enableTailwind,
  });
  const mime: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
  };
  const server = http.createServer((req, res) => {
    try {
      const relative = decodeURIComponent(
        new URL(req.url || "/", "http://localhost").pathname,
      );
      const file = path.resolve(
        directory,
        "." + (relative === "/" ? "/index.html" : relative),
      );
      if (
        !file.startsWith(path.resolve(directory) + path.sep) ||
        !fs.existsSync(file) ||
        !fs.statSync(file).isFile()
      ) {
        res.writeHead(404).end();
        return;
      }
      const size = fs.statSync(file).size;
      const contentType =
        mime[path.extname(file)] || "application/octet-stream";
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) {
        const start = Number(range[1]),
          end = Math.min(range[2] ? Number(range[2]) : size - 1, size - 1);
        if (start > end) {
          res.writeHead(416).end();
          return;
        }
        res.writeHead(206, {
          "Content-Type": contentType,
          "Content-Range": `bytes ${start}-${end}/${size}`,
          "Content-Length": end - start + 1,
          "Accept-Ranges": "bytes",
        });
        fs.createReadStream(file, { start, end }).pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Type": contentType,
          "Content-Length": size,
          "Accept-Ranges": "bytes",
        });
        fs.createReadStream(file).pipe(res);
      }
    } catch {
      res.writeHead(400).end();
    }
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Cannot start preview server");
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
      fs.rmSync(directory, { recursive: true, force: true });
    },
  };
}
