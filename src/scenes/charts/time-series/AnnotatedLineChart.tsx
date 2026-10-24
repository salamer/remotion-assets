import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const data = [42, 48, 51, 58, 54, 63, 72, 69, 81, 88, 83, 96];
const events = [
  { index: 3, label: "PRICE CUT" },
  { index: 6, label: "NEW PRODUCT" },
  { index: 9, label: "RATE SHOCK" },
];

const LEGACY_DEFAULT_data = data;
const LEGACY_DEFAULT_events = events;

export const AnnotatedLineChart: React.FC<{
  data?: typeof LEGACY_DEFAULT_data;
  events?: typeof LEGACY_DEFAULT_events;
  title?: string;
  eyebrow?: string;
}> = ({
  data = LEGACY_DEFAULT_data,
  events = LEGACY_DEFAULT_events,
  title = "Tell the story on the chart.",
  eyebrow = "ANNOTATED SERIES",
}) => {
  const frame = useCurrentFrame(),
    W = 1480,
    H = 500,
    min = Math.min(...data),
    max = Math.max(...data);
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - 40 - ((v - min) / (max - min)) * (H - 90),
  }));
  const d = pts
      .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
      .join(" "),
    lineP = reveal(frame, 10, 45);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-12">
        <svg width={W} height={H + 110} viewBox={`0 0 ${W} ${H + 110}`}>
          {[0.25, 0.5, 0.75].map((r) => (
            <line
              key={r}
              x1={0}
              x2={W}
              y1={H * r}
              y2={H * r}
              stroke={palette.ink}
              strokeOpacity={0.1}
              strokeWidth={2}
            />
          ))}
          <path
            d={d}
            fill="none"
            stroke={palette.ink}
            strokeWidth={7}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - lineP}
          />
          {events.map((e, i) => {
            const p = reveal(frame, 32 + i * 12, 14),
              pt = pts[e.index],
              above = i % 2 === 0;
            return (
              <g key={e.label} opacity={p}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={9}
                  fill={palette.yellow}
                  stroke={palette.ink}
                  strokeWidth={3}
                />
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={above ? pt.y - 92 : pt.y + 92}
                  stroke={palette.ink}
                  strokeWidth={2}
                />
                <rect
                  x={pt.x - 95}
                  y={above ? pt.y - 145 : pt.y + 92}
                  width={190}
                  height={54}
                  fill={palette.yellow}
                  stroke={palette.ink}
                  strokeWidth={2}
                />
                <text
                  x={pt.x}
                  y={above ? pt.y - 111 : pt.y + 127}
                  textAnchor="middle"
                  fontFamily={
                    'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace'
                  }
                  fontWeight={600}
                  fontSize={18}
                >
                  {e.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Frame>
  );
};
