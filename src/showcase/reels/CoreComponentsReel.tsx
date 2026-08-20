import React from "react";

import { CORE_SHOWCASE } from "../compositions";
import { ShowcaseReel, reelDuration } from "../ShowcaseReel";

export const CORE_COMPONENTS_REEL_DURATION = reelDuration(CORE_SHOWCASE);

export const CoreComponentsReel: React.FC = () => (
  <ShowcaseReel entries={CORE_SHOWCASE} />
);
