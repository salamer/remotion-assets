import React from "react";
import {Composition} from "remotion";

import "./index.css";

import {
  SCENE_DURATION,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./config";
import {DemoReel} from "./DemoReel";
import {SCENES} from "./scenes";

const DEMO_REEL_SCENES = 5;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoReel"
        component={DemoReel}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        fps={VIDEO_FPS}
        durationInFrames={SCENE_DURATION * DEMO_REEL_SCENES}
      />

      {SCENES.map(({id, component}) => (
        <Composition
          key={id}
          id={id}
          component={component}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          fps={VIDEO_FPS}
          durationInFrames={SCENE_DURATION}
        />
      ))}
    </>
  );
};
