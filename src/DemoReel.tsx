import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SCENE_DURATION } from "./config";
import { BarChart } from "./scenes/BarChart";
import { BigNumber } from "./scenes/BigNumber";
import { Compare } from "./scenes/Compare";
import { Flow } from "./scenes/Flow";
import { Ranking } from "./scenes/Ranking";

export const DemoReel: React.FC = () => {
  return (
    <AbsoluteFill from={-74}>
      <Sequence durationInFrames={SCENE_DURATION}>
        <BigNumber />
      </Sequence>
      <Sequence from={SCENE_DURATION} durationInFrames={SCENE_DURATION}>
        <Compare />
      </Sequence>
      <Sequence from={SCENE_DURATION * 2} durationInFrames={SCENE_DURATION}>
        <BarChart />
      </Sequence>
      <Sequence from={SCENE_DURATION * 3} durationInFrames={SCENE_DURATION}>
        <Flow />
      </Sequence>
      <Sequence from={SCENE_DURATION * 4} durationInFrames={SCENE_DURATION}>
        <Ranking />
      </Sequence>
    </AbsoluteFill>
  );
};
