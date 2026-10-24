import { readEpisode } from "./io";
import { durationInFrames } from "../src/program/timeline";
try {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: pnpm validate examples/episode.json");
  const e = readEpisode(file);
  console.log(
    `VALID: ${e.scenes.length} scenes, ${durationInFrames(e)} frames, ${e.fps} fps, ${e.format}`,
  );
} catch (err) {
  console.error(String(err));
  process.exitCode = 1;
}
