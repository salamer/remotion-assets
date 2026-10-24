import fs from "node:fs";
import path from "node:path";
import { readEpisode } from "./io";
import { parseSrt } from "../src/program/captions";
import { parseEpisode } from "../src/program/validate";
try {
  const [srt, ep, out] = process.argv.slice(2);
  if (!srt || !ep || !out)
    throw new Error(
      "Usage: pnpm captions:import input.srt episode.json out/episode.json",
    );
  if (fs.existsSync(out))
    throw new Error(`Output exists: ${out}; choose a new filename`);
  const episode = readEpisode(ep);
  episode.captions = parseSrt(fs.readFileSync(srt, "utf8"));
  parseEpisode(episode);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(episode, null, 2) + "\n");
  console.log(`Imported ${episode.captions.length} cues`);
} catch (err) {
  console.error(String(err));
  process.exitCode = 1;
}
