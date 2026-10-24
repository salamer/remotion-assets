import fs from "node:fs";
import path from "node:path";
import { createBundleServer } from "./bundle-server";
import {
  selectComposition,
  renderStill,
  openBrowser,
} from "@remotion/renderer";
import { readEpisode } from "./io";
import { compileTimeline } from "../src/program/timeline";

async function main() {
  const [file = "examples/template-gallery.json", out = "out/stills"] =
    process.argv.slice(2);
  const episode = readEpisode(file);
  fs.mkdirSync(out, { recursive: true });
  const inputProps = { episode };
  const server = await createBundleServer();
  const serveUrl = server.url;
  console.log("Bundle ready. Opening browser.");
  const browser = await openBrowser("chrome", {
    chromiumOptions: { enableMultiProcessOnLinux: true, gl: "swangle" },
  });
  try {
    console.log("Selecting composition");
    const composition = await selectComposition({
      chromiumOptions: { enableMultiProcessOnLinux: true, gl: "swangle" },
      serveUrl,
      id: "FinanceEpisode",
      inputProps,
      puppeteerInstance: browser,
    });
    console.log("Composition ready");
    for (const [i, entry] of compileTimeline(episode).entries()) {
      const name = `${String(i + 1).padStart(2, "0")}-${entry.scene.type}.png`;
      await renderStill({
        chromiumOptions: { enableMultiProcessOnLinux: true, gl: "swangle" },
        serveUrl,
        composition,
        inputProps,
        frame:
          entry.from +
          Math.min(Math.round(episode.fps * 2.5), entry.durationInFrames - 1),
        output: path.join(out, name),
        scale: 0.5,
        puppeteerInstance: browser,
      });
      console.log(name);
    }
  } finally {
    await browser.close({ silent: true });
    await server.close();
  }
}
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
