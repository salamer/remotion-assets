import React from "react";

import {TickerOverlay} from "../scenes/overlays/TickerOverlay";
import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

type TickerProps = React.ComponentProps<typeof TickerOverlay>;

/**
 * TickerOverlay has no Frame background.
 * Studio preview wraps it on the paper canvas.
 */
export const TickerPreview: React.FC<TickerProps> = (props) => {
  return (
    <Frame>
      <SceneHeader eyebrow="MARKET DATA" title="Live ticker overlay for B-roll." />
      <TickerOverlay {...props} />
    </Frame>
  );
};
