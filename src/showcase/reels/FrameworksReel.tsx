import React from "react";

import {FRAMEWORKS_DEMO_SHOWCASE} from "../compositions";
import {ShowcaseReel, reelDuration} from "../ShowcaseReel";

export const FRAMEWORKS_REEL_DURATION = reelDuration(FRAMEWORKS_DEMO_SHOWCASE);

export const FrameworksReel: React.FC = () => (
  <ShowcaseReel entries={FRAMEWORKS_DEMO_SHOWCASE} />
);
