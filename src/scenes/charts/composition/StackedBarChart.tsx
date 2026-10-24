import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";

const segments = [
  {
    label: "STAYS",
    value: 82,
    className: "bg-yellow",
  },
  {
    label: "EXPERIENCES",
    value: 12,
    className: "bg-ink text-white",
  },
  {
    label: "OTHER",
    value: 6,
    className: "bg-soft",
  },
];

const LEGACY_DEFAULT_segments = segments;

export const StackedBarChart: React.FC<{
  segments?: typeof LEGACY_DEFAULT_segments;
  title?: string;
  eyebrow?: string;
}> = ({
  segments = LEGACY_DEFAULT_segments,
  title = "Where does the money actually come from?",
  eyebrow = "REVENUE MIX",
}) => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-28 flex h-[150px] w-full border-2 border-ink">
        {segments.map((segment, index) => {
          const p = interpolate(
            frame,
            [10 + index * 10, 35 + index * 10],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={segment.label}
              className={`
                flex
                items-center
                justify-center
                overflow-hidden
                border-r-2
                border-ink
                text-[24px]
                font-semibold
                last:border-r-0
                ${segment.className}
              `}
              style={{
                width: `${
                  (segment.value /
                    Math.max(
                      1e-9,
                      segments.reduce((sum, s) => sum + s.value, 0),
                    )) *
                  100 *
                  p
                }%`,
              }}
            >
              {p > 0.65 && (
                <span>
                  {segment.label} / {segment.value}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
