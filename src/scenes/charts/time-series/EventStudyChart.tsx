import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const data = [
  { x: -5, a: 0, b: 0 },
  { x: -4, a: 1, b: 0.5 },
  { x: -3, a: 0.5, b: 0.2 },
  { x: -2, a: 1.2, b: 0.8 },
  { x: -1, a: 1, b: 0.7 },
  { x: 0, a: 1, b: 0.8 },
  { x: 1, a: 5, b: 1.2 },
  { x: 2, a: 7, b: 1.5 },
  { x: 3, a: 8, b: 1.8 },
  { x: 4, a: 7.5, b: 2 },
  { x: 5, a: 8.2, b: 2.2 },
];

export const EventStudyChart: React.FC = () => {
  const frame = useCurrentFrame(),
    W = 1480,
    H = 500,
    toX = (x: number) => ((x + 5) / 10) * W,
    toY = (y: number) => H - 30 - (y / 9) * (H - 70),
    p = reveal(frame, 12, 45);
  const dA = data
      .map((r, i) => `${i === 0 ? "M" : "L"} ${toX(r.x)} ${toY(r.a)}`)
      .join(" "),
    dB = data
      .map((r, i) => `${i === 0 ? "M" : "L"} ${toX(r.x)} ${toY(r.b)}`)
      .join(" ");
  return (
    <Frame>
      <SceneHeader
        eyebrow="EVENT STUDY"
        title="What changed after the event?"
      />
      <div className="mt-12">
        <svg width={W} height={H + 80}>
          <line
            x1={toX(0)}
            x2={toX(0)}
            y1={0}
            y2={H}
            stroke={palette.yellow}
            strokeWidth={8}
          />
          <text
            x={toX(0) + 12}
            y={28}
            fontFamily="IBM Plex Mono"
            fontSize={18}
            fontWeight={600}
          >
            EVENT
          </text>
          <path
            d={dA}
            fill="none"
            stroke={palette.ink}
            strokeWidth={7}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
          <path
            d={dB}
            fill="none"
            stroke={palette.muted}
            strokeWidth={4}
            strokeDasharray="10 10"
          />
          {[-5, 0, 5].map((x) => (
            <text
              key={x}
              x={toX(x)}
              y={H + 42}
              textAnchor="middle"
              fontFamily="IBM Plex Mono"
              fontSize={18}
              fill={palette.muted}
            >
              {x}
            </text>
          ))}
          <text
            x={W - 10}
            y={toY(8.2) - 16}
            textAnchor="end"
            fontFamily="IBM Plex Mono"
            fontSize={20}
            fontWeight={600}
          >
            TREATED
          </text>
          <text
            x={W - 10}
            y={toY(2.2) + 30}
            textAnchor="end"
            fontFamily="IBM Plex Mono"
            fontSize={20}
            fill={palette.muted}
          >
            CONTROL
          </text>
        </svg>
      </div>
    </Frame>
  );
};
