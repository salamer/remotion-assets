import fs from "node:fs";
import path from "node:path";
import { getCompositions, renderStill, openBrowser } from "@remotion/renderer";
import catalog from "../schemas/legacy-catalog.json";
import { createBundleServer } from "./bundle-server";

async function main() {
  const out = process.argv[2] || "out/legacy-stills";
  fs.mkdirSync(out, { recursive: true });
  const server = await createBundleServer();
  const browser = await openBrowser("chrome", {
    chromiumOptions: { gl: "swangle" },
  });
  const ids = new Set(catalog.map((c) => c.id));
  try {
    const compositions = await getCompositions(server.url, {
      puppeteerInstance: browser,
    });
    const entries = compositions.filter((c) => ids.has(c.id));
    for (const [i, composition] of entries.entries()) {
      await renderStill({
        serveUrl: server.url,
        composition,
        frame: Math.min(75, composition.durationInFrames - 1),
        output: path.join(out, `${composition.id}.png`),
        scale: 0.35,
        puppeteerInstance: browser,
      });
      console.log(`${i + 1}/${entries.length} ${composition.id}`);
    }
  } finally {
    await browser.close({ silent: true });
    await server.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
