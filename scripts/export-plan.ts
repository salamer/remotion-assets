import fs from "node:fs";
import path from "node:path";
import { readEpisode, sidecars } from "./io";
try {
  const [file, base = "out/episode"] = process.argv.slice(2);
  if (!file)
    throw new Error("Usage: pnpm export:plan episode.json out/episode");
  const episode = readEpisode(file);
  fs.mkdirSync(path.dirname(base), { recursive: true });
  sidecars(episode, base);
  console.log(`Exported plan: ${base}.storyboard.json`);
} catch (err) {
  console.error(String(err));
  process.exitCode = 1;
}
