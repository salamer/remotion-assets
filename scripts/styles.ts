import fs from "node:fs";
import path from "node:path";
import {
  selectComposition,
  renderStill,
  openBrowser,
} from "@remotion/renderer";
import { createBundleServer } from "./bundle-server";
import { presets } from "../src/brand/presets";

async function main() {
  const out = process.argv[2] || "out/brands";
  fs.mkdirSync(out, { recursive: true });
  const server = await createBundleServer();
  const browser = await openBrowser("chrome", {
    chromiumOptions: { gl: "swangle" },
  });
  try {
    for (const preset of Object.keys(presets)) {
      const composition = await selectComposition({
        serveUrl: server.url,
        id: `Brand-${preset}`,
        puppeteerInstance: browser,
      });
      await renderStill({
        serveUrl: server.url,
        composition,
        frame: 75,
        output: path.join(out, `${preset}.png`),
        scale: 0.5,
        puppeteerInstance: browser,
      });
      console.log(preset);
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
