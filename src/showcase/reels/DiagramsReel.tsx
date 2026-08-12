import React from "react";

import {DIAGRAMS_DEMO_SHOWCASE} from "../compositions";
import {ShowcaseReel, reelDuration} from "../ShowcaseReel";

export const DIAGRAMS_REEL_DURATION = reelDuration(DIAGRAMS_DEMO_SHOWCASE);

export const DiagramsReel: React.FC = () => (
  <ShowcaseReel entries={DIAGRAMS_DEMO_SHOWCASE} />
);
