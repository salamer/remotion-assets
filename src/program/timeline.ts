import type { Episode, Scene } from "./schema";

/** Round boundaries rather than individual durations; no accumulated frame drift. */
export function compileTimeline(episode: Episode) {
  let seconds = 0;
  return episode.scenes.map((scene) => {
    const from = Math.round(seconds * episode.fps);
    seconds += scene.duration;
    const end = Math.round(seconds * episode.fps);
    return { scene, from, durationInFrames: end - from };
  });
}
export const durationInFrames = (episode: Episode) =>
  Math.round(episode.scenes.reduce((n, s) => n + s.duration, 0) * episode.fps);
export const captionAt = (episode: Episode, frame: number) =>
  episode.captions.find(
    (c) =>
      frame >= Math.round(c.start * episode.fps) &&
      frame < Math.round(c.end * episode.fps),
  );

/** Keep planned captions attached to scenes when editing order or duration. */
export function retimeScenes(
  episode: Episode,
  scenes: Scene[],
  origins: Record<string, string> = {},
): Episode {
  const old = compileTimeline(episode);
  const next = { ...episode, scenes };
  const captions: Episode["captions"] = [];
  for (const entry of compileTimeline(next)) {
    const previous = old.find(
      (s) => s.scene.id === (origins[entry.scene.id] || entry.scene.id),
    );
    if (!previous) continue;
    const start = previous.from / episode.fps,
      end = (previous.from + previous.durationInFrames) / episode.fps;
    const factor = entry.durationInFrames / previous.durationInFrames;
    for (const c of episode.captions) {
      const a = Math.max(c.start, start),
        b = Math.min(c.end, end);
      if (b <= a) continue;
      captions.push({
        text: c.text,
        start: entry.from / episode.fps + (a - start) * factor,
        end: entry.from / episode.fps + (b - start) * factor,
      });
    }
  }
  return { ...next, captions: captions.sort((a, b) => a.start - b.start) };
}
