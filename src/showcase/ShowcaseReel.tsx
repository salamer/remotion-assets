/**
 * Stitch ShowcaseEntry list into a reel Sequence.
 * `from` accumulates on Sequence; AbsoluteFill must not set `from`.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import type { ShowcaseEntry } from "./compositions";

export const reelDuration = (entries: ShowcaseEntry[]) =>
  entries.reduce((sum, entry) => sum + entry.durationInFrames, 0);

export const ShowcaseReel: React.FC<{ entries: ShowcaseEntry[] }> = ({
  entries,
}) => {
  let from = 0;

  return (
    <AbsoluteFill>
      {entries.map((entry) => {
        const start = from;
        from += entry.durationInFrames;
        const Comp = entry.component;
        return (
          <Sequence
            key={entry.id}
            from={start}
            durationInFrames={entry.durationInFrames}
          >
            <Comp {...(entry.defaultProps ?? {})} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
