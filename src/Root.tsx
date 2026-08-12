/**
 * Remotion Composition entry — semantic reels + per-scene compositions.
 */
import React from "react";
import {Composition} from "remotion";

import "./index.css";

import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./config";
import {ALL_SHOWCASE_COMPOSITIONS} from "./showcase/compositions";
import {
  CoreComponentsReel,
  CORE_COMPONENTS_REEL_DURATION,
} from "./showcase/reels/CoreComponentsReel";
import {ChartsReel, CHARTS_REEL_DURATION} from "./showcase/reels/ChartsReel";
import {DiagramsReel, DIAGRAMS_REEL_DURATION} from "./showcase/reels/DiagramsReel";
import {
  FrameworksReel,
  FRAMEWORKS_REEL_DURATION,
} from "./showcase/reels/FrameworksReel";
import {
  FullShowcaseReel,
  FULL_SHOWCASE_REEL_DURATION,
} from "./showcase/reels/FullShowcaseReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
        ({id, component, defaultProps, durationInFrames}) => (
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
    </>
  );
};
