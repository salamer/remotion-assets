import fs from "node:fs";
import path from "node:path";
import type { Episode } from "../src/program/schema";
import { validateEpisode } from "../src/program/validate";
import { compileTimeline } from "../src/program/timeline";

export function readEpisode(file: string): Episode {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = validateEpisode(raw.episode || raw);
  for (const i of result.issues)
    console[i.level === "error" ? "error" : "warn"](
      `${i.level.toUpperCase()} ${i.path}: ${i.message}`,
    );
  if (result.issues.some((i) => i.level === "error") || !result.episode)
    throw new Error("Episode validation failed");
  checkAssets(result.episode);
  return result.episode;
}
export function checkAssets(episode: Episode) {
  const refs = [
    episode.brand.logo,
    episode.audio?.voiceover,
    episode.audio?.music,
    ...episode.scenes.flatMap((s) =>
      s.type === "media" || s.type === "presenter" ? [s.asset] : [],
    ),
  ].filter((s): s is string => Boolean(s));
  const root = fs.realpathSync("public");
  for (const ref of refs) {
    const resolved = path.resolve("public", ref);
    if (
      !resolved.startsWith(root + path.sep) ||
      !fs.existsSync(resolved) ||
      !fs.statSync(resolved).isFile() ||
      !fs.realpathSync(resolved).startsWith(root + path.sep)
    )
      throw new Error(`Missing or unsafe local asset: ${ref}`);
  }
}
const stamp = (seconds: number) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};
export function sidecars(episode: Episode, base: string) {
  const plan = compileTimeline(episode).map(
    ({ scene, from, durationInFrames }) => ({
      id: scene.id,
      type: scene.type,
      title: scene.title,
      start: from / episode.fps,
      end: (from + durationInFrames) / episode.fps,
      narration: scene.narration || "",
      sourceIds: scene.sourceIds,
    }),
  );
  fs.writeFileSync(
    `${base}.storyboard.json`,
    JSON.stringify(plan, null, 2) + "\n",
  );
  fs.writeFileSync(
    `${base}.props.json`,
    JSON.stringify({ episode }, null, 2) + "\n",
  );
  if (episode.captions.length)
    fs.writeFileSync(
      `${base}.srt`,
      episode.captions
        .map(
          (c, i) =>
            `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`,
        )
        .join("\n"),
    );
  if (plan.some((s) => s.narration))
    fs.writeFileSync(
      `${base}.narration.md`,
      plan
        .map(
          (s) =>
            `## ${s.id} / ${s.start.toFixed(2)}–${s.end.toFixed(2)}s\n\n${s.narration || "[无旁白]"}\n`,
        )
        .join("\n"),
    );
}
