import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { tween } from "../../../lib/chartMotion";
import { smoothPath, VIZ } from "../../../components/viz/chartPrimitives";

type Series = { label: string; ranks: number[]; highlight?: boolean };
const DEFAULT: Series[] = [
  { label: "A", ranks: [3, 2, 2, 1, 1], highlight: true },
  { label: "B", ranks: [1, 1, 1, 2, 3] },
  { label: "C", ranks: [2, 3, 4, 4, 2] },
  { label: "D", ranks: [4, 4, 3, 3, 4] },
];
export const BumpChart: React.FC<{
  eyebrow?: string;
  title?: string;
  series?: Series[];
  periods?: string[];
}> = ({
  eyebrow = "RANK OVER TIME",
  title = "Show who overtook whom.",
  series = DEFAULT,
  periods = ["2021", "2022", "2023", "2024", "2025"],
}) => {
  const frame = useCurrentFrame();
  const width = 1680,
    height = 600,
    left = 130,
    right = 130,
    top = 55,
    bottom = 70,
    chartW = width - left - right,
    chartH = height - top - bottom;
  const maxRank = Math.max(...series.flatMap((s) => s.ranks));
  const x = (i: number) =>
    left + (i / Math.max(1, periods.length - 1)) * chartW;
  const y = (rank: number) =>
    top + ((rank - 1) / Math.max(1, maxRank - 1)) * chartH;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <svg width={width} height={height} className="mt-6">
        {Array.from({ length: maxRank }).map((_, i) => (
          <line
            key={i}
            x1={left}
            x2={width - right}
            y1={y(i + 1)}
            y2={y(i + 1)}
            stroke={VIZ.ink}
            strokeOpacity={0.1}
            strokeWidth={2}
          />
        ))}
        {series.map((s, si) => {
          const p = tween(frame, 8 + si * 6, 50);
          const pts = s.ranks.map((r, i) => ({ x: x(i), y: y(r) }));
          return (
            <g key={s.label}>
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={s.highlight ? VIZ.yellow : VIZ.ink}
                strokeWidth={s.highlight ? 10 : 4}
                strokeOpacity={s.highlight ? 1 : 0.55}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
              {pts.map((pt, i) => (
                <g key={i} opacity={tween(frame, 34 + si * 5 + i * 2, 8)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={s.highlight ? 16 : 10}
                    fill={s.highlight ? VIZ.yellow : VIZ.white}
                    stroke={VIZ.ink}
                    strokeWidth={2}
                  />
                  {i === periods.length - 1 ? (
                    <text
                      x={pt.x + 28}
                      y={pt.y + 7}
                      fontFamily="IBM Plex Mono"
                      fontSize={20}
                      fill={VIZ.ink}
                    >
                      {s.label}
                    </text>
                  ) : null}
                </g>
              ))}
            </g>
          );
        })}
        {periods.map((p, i) => (
          <text
            key={p}
            x={x(i)}
            y={height - 25}
            textAnchor="middle"
            fontFamily="IBM Plex Mono"
            fontSize={18}
            fill={VIZ.muted}
          >
            {p}
          </text>
        ))}
      </svg>
    </Frame>
  );
};
