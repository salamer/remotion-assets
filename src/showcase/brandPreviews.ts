import sample from "../../examples/episode.json";
import type { Brand } from "../brand/schema";
import { parseEpisode } from "../program/validate";

/** A preview is its own timeline; whole-episode captions/audio must not leak in. */
export const makeBrandPreview = (preset: Brand["preset"]) =>
  parseEpisode({
    ...sample,
    scenes: [sample.scenes[2]],
    brand: { ...sample.brand, preset },
    captions: [],
    audio: undefined,
  });
