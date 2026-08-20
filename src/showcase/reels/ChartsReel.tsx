import React from "react";

import { CHARTS_DEMO_SHOWCASE } from "../compositions";
import { ShowcaseReel, reelDuration } from "../ShowcaseReel";

export const CHARTS_REEL_DURATION = reelDuration(CHARTS_DEMO_SHOWCASE);

export const ChartsReel: React.FC = () => (
  <ShowcaseReel entries={CHARTS_DEMO_SHOWCASE} />
);
