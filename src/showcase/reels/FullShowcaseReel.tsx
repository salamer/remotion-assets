import React from "react";

import { ALL_SHOWCASE_COMPOSITIONS } from "../compositions";
import { ShowcaseReel, reelDuration } from "../ShowcaseReel";

export const FULL_SHOWCASE_REEL_DURATION = reelDuration(
  ALL_SHOWCASE_COMPOSITIONS,
);

export const FullShowcaseReel: React.FC = () => (
  <ShowcaseReel entries={ALL_SHOWCASE_COMPOSITIONS} />
);
