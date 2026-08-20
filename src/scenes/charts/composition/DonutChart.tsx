import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { chart, typography } from "../../../style/theme";

export const DonutChart: React.FC<{
  value?: number;
}> = ({ value = 72 }) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [15, 55], [0, value / 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const r = 190;
  const circumference = 2 * Math.PI * r;

  return (
    <Frame>
      <SceneHeader
        eyebrow="REVENUE MIX"
        title="Stays still dominate Airbnb revenue."
      />

      <div className="mt-16 flex items-center gap-28">
        <svg width={500} height={500} viewBox="0 0 500 500">
          <circle
            cx={250}
            cy={250}
            r={r}
            fill="none"
            stroke={chart.colors.track}
            strokeWidth={chart.donutStrokeWidth}
          />

          <circle
            cx={250}
            cy={250}
            r={r}
            fill="none"
            stroke={chart.colors.emphasis}
            strokeWidth={chart.donutStrokeWidth}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - p)}
            transform="rotate(-90 250 250)"
          />

          <text
            x={250}
            y={270}
            textAnchor="middle"
            fontSize={90}
            fontWeight={typography.weight.semibold}
            fontFamily={typography.fontFamily}
          >
            {Math.round(p * 100)}%
          </text>
        </svg>

        <div>
          <div className="text-[34px] font-semibold">STAYS & NIGHTS</div>

          <div className="mt-5 max-w-[650px] text-[28px] leading-[1.5] text-muted">
            Short-term rentals remain the core revenue engine.
          </div>
        </div>
      </div>
    </Frame>
  );
};
