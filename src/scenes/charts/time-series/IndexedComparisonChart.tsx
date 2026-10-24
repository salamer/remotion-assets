import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const series = [
  { name: "COMPANY A", values: [100, 110, 118, 132, 145, 160], accent: true },
  { name: "PEER", values: [100, 104, 109, 111, 118, 123], accent: false },
  { name: "MARKET", values: [100, 102, 108, 114, 119, 125], accent: false },
];

const LEGACY_DEFAULT_series = series;

export const IndexedComparisonChart: React.FC<{
  series?: typeof LEGACY_DEFAULT_series;
  title?: string;
  eyebrow?: string;
}> = ({
  series = LEGACY_DEFAULT_series,
  title = "Start everyone at 100.",
  eyebrow = "INDEXED COMPARISON",
}) => {
  const frame = useCurrentFrame(),
    W = 1450,
    H = 500,
    min = 90,
    max = 170,
    toY = (v: number) => H - 30 - ((v - min) / (max - min)) * (H - 70),
    p = reveal(frame, 10, 48);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-12">
        <svg width={W} height={H + 70}>
          <line
            x1={0}
            x2={W}
            y1={toY(100)}
            y2={toY(100)}
            stroke={palette.ink}
            strokeOpacity={0.16}
            strokeWidth={2}
          />
          {series.map((s) => {
            const points = s.values.map((v, i) => ({
                x: (i / (s.values.length - 1)) * W,
                y: toY(v),
              })),
              d = points
                .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
                .join(" "),
              last = points[points.length - 1];
            return (
              <g key={s.name}>
                <path
                  d={d}
                  fill="none"
                  stroke={s.accent ? palette.ink : palette.muted}
                  strokeWidth={s.accent ? 7 : 3}
                  strokeDasharray={s.accent ? undefined : "10 9"}
                  pathLength={1}
                  strokeDashoffset={1 - p}
                />
                <rect
                  x={last.x - 150}
                  y={last.y - 26}
                  width={145}
                  height={42}
                  fill={s.accent ? palette.yellow : palette.white}
                  stroke={palette.ink}
                  strokeWidth={2}
                />
                <text
                  x={last.x - 78}
                  y={last.y + 2}
                  textAnchor="middle"
                  fontFamily={
                    'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace'
                  }
                  fontSize={16}
                  fontWeight={600}
                >
                  {s.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Frame>
  );
};
