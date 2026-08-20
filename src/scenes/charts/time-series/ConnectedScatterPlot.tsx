import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const pts = [
  { year: "2019", x: 25, y: 22 },
  { year: "2020", x: 32, y: 28 },
  { year: "2021", x: 46, y: 41 },
  { year: "2022", x: 58, y: 55 },
  { year: "2023", x: 67, y: 63 },
  { year: "2024", x: 78, y: 72 },
];

export const ConnectedScatterPlot: React.FC = () => {
  const frame = useCurrentFrame(),
    p = reveal(frame, 12, 50),
    W = 1400,
    H = 520;
  const d = pts
    .map(
      (pt, i) =>
        `${i === 0 ? "M" : "L"} ${(pt.x / 100) * W} ${H - (pt.y / 100) * H}`,
    )
    .join(" ");
  return (
    <Frame>
      <SceneHeader
        eyebrow="CONNECTED SCATTER"
        title="How the relationship evolved over time."
      />
      <div className="mt-14">
        <svg width={W} height={H + 60}>
          <line
            x1={0}
            y1={H}
            x2={W}
            y2={H}
            stroke={palette.ink}
            strokeWidth={2}
          />
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={H}
            stroke={palette.ink}
            strokeWidth={2}
          />
          <path
            d={d}
            fill="none"
            stroke={palette.ink}
            strokeWidth={5}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
          {pts.map((pt, i) => {
            const r = reveal(frame, 18 + i * 6, 12),
              x = (pt.x / 100) * W,
              y = H - (pt.y / 100) * H;
            return (
              <g key={pt.year} opacity={r}>
                <circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill={i === pts.length - 1 ? palette.yellow : palette.white}
                  stroke={palette.ink}
                  strokeWidth={3}
                />
                <text
                  x={x + 18}
                  y={y - 14}
                  fontFamily="IBM Plex Mono"
                  fontSize={17}
                >
                  {pt.year}
                </text>
              </g>
            );
          })}
          <text
            x={W / 2}
            y={H + 50}
            textAnchor="middle"
            fontFamily="IBM Plex Mono"
            fontSize={18}
            fill={palette.muted}
          >
            PRICE →
          </text>
        </svg>
      </div>
    </Frame>
  );
};
