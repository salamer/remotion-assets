/**
 * Remotion Composition entry — semantic reels + per-scene compositions.
 */
import React from "react";
import { useFonts } from "./style/fonts";
import { Composition, Folder } from "remotion";
import { z } from "zod";
import { FinanceEpisode } from "./program/Episode";
import { episodeSchema, dimensions } from "./program/schema";
import { parseEpisode } from "./program/validate";
import { durationInFrames } from "./program/timeline";
import sample from "../examples/episode.json";
import gallery from "../examples/template-gallery.json";
import shorts from "../examples/shorts.json";
import { presets } from "./brand/presets";
import { makeBrandPreview } from "./showcase/brandPreviews";
import type { Brand } from "./brand/schema";

import "./index.css";

import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./config";
import { ALL_SHOWCASE_COMPOSITIONS } from "./showcase/compositions";
import {
  CoreComponentsReel,
  CORE_COMPONENTS_REEL_DURATION,
} from "./showcase/reels/CoreComponentsReel";
import { ChartsReel, CHARTS_REEL_DURATION } from "./showcase/reels/ChartsReel";
import {
  DiagramsReel,
  DIAGRAMS_REEL_DURATION,
} from "./showcase/reels/DiagramsReel";
import {
  FrameworksReel,
  FRAMEWORKS_REEL_DURATION,
} from "./showcase/reels/FrameworksReel";
import {
  FullShowcaseReel,
  FULL_SHOWCASE_REEL_DURATION,
} from "./showcase/reels/FullShowcaseReel";

export const RemotionRoot: React.FC = () => {
  useFonts();
  return (
    <>
      <Folder name="Production">
        {[
          ["FinanceEpisode", sample],
          ["TemplateGallery", gallery],
          ["FinanceShorts", shorts],
        ].map(([id, data]) => {
          const episode = parseEpisode(data);
          return (
            <Composition
              key={String(id)}
              id={String(id)}
              component={FinanceEpisode}
              defaultProps={{ episode }}
              schema={z.object({ episode: episodeSchema })}
              durationInFrames={durationInFrames(episode)}
              fps={episode.fps}
              {...dimensions[episode.format]}
              calculateMetadata={({ props }) => {
                const e = parseEpisode(props.episode);
                return {
                  ...dimensions[e.format],
                  fps: e.fps,
                  durationInFrames: durationInFrames(e),
                  props: { episode: e },
                };
              }}
            />
          );
        })}
      </Folder>
      <Folder name="Brand-Previews">
        {Object.keys(presets).map((preset) => {
          const episode = makeBrandPreview(preset as Brand["preset"]);
          return (
            <Composition
              key={preset}
              id={`Brand-${preset}`}
              component={FinanceEpisode}
              defaultProps={{ episode }}
              durationInFrames={durationInFrames(episode)}
              fps={episode.fps}
              {...dimensions[episode.format]}
            />
          );
        })}
      </Folder>
      <Folder name="Original-Catalog">
        <Composition
          id="CoreComponentsReel"
          component={CoreComponentsReel}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          fps={VIDEO_FPS}
          durationInFrames={CORE_COMPONENTS_REEL_DURATION}
        />
        <Composition
          id="ChartsReel"
          component={ChartsReel}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          fps={VIDEO_FPS}
          durationInFrames={CHARTS_REEL_DURATION}
        />
        <Composition
          id="DiagramsReel"
          component={DiagramsReel}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          fps={VIDEO_FPS}
          durationInFrames={DIAGRAMS_REEL_DURATION}
        />
        <Composition
          id="FrameworksReel"
          component={FrameworksReel}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          fps={VIDEO_FPS}
          durationInFrames={FRAMEWORKS_REEL_DURATION}
        />
        <Composition
          id="FullShowcaseReel"
          component={FullShowcaseReel}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          fps={VIDEO_FPS}
          durationInFrames={FULL_SHOWCASE_REEL_DURATION}
        />

        {ALL_SHOWCASE_COMPOSITIONS.map(
          ({ id, component, defaultProps, durationInFrames }) => (
            <Composition
              key={id}
              id={id}
              component={component}
              defaultProps={defaultProps}
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              fps={VIDEO_FPS}
              durationInFrames={durationInFrames}
            />
          ),
        )}
      </Folder>
    </>
  );
};
