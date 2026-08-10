import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

export const Donut: React.FC<{
  value?: number;
}> = ({
  value = 72,
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(
    frame,
    [15, 55],
    [0, value / 100],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const r = 190;
  const circumference = 2 * Math.PI * r;

  return (
    <Frame>
      <SceneHeader
        eyebrow="REVENUE MIX"
        title="Most revenue comes from one segment."
      />

      <div className="mt-16 flex items-center gap-28">

        <svg
          width={500}
          height={500}
          viewBox="0 0 500 500"
        >
          <circle
            cx={250}
            cy={250}
            r={r}
            fill="none"
            stroke="#ECECE7"
            strokeWidth={55}
          />

          <circle
            cx={250}
            cy={250}
            r={r}
            fill="none"
            stroke="#FFD43B"
            strokeWidth={55}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference * (1 - p)
            }
            transform="rotate(-90 250 250)"
          />

          <text
            x={250}
            y={270}
            textAnchor="middle"
            fontSize={90}
            fontWeight={600}
            fontFamily="IBM Plex Mono"
          >
            {Math.round(p * 100)}%
          </text>
        </svg>

        <div>
          <div className="text-[34px] font-semibold">
            CORE BUSINESS
          </div>

          <div className="mt-5 max-w-[650px] text-[28px] leading-[1.5] text-muted">
            The business remains heavily concentrated
            in its largest revenue segment.
          </div>
        </div>

      </div>
    </Frame>
  );
};