import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger, tween } from "../../../lib/chartMotion";
import {
  niceMax,
  smoothPath,
  VIZ,
} from "../../../components/viz/chartPrimitives";

type Item = { label: string; value: number };
const DEFAULT: Item[] = [
  { label: "A", value: 42 },
  { label: "B", value: 26 },
  { label: "C", value: 14 },
  { label: "D", value: 9 },
  { label: "E", value: 5 },
  { label: "OTHER", value: 4 },
];
export const ParetoChart: React.FC<{
  eyebrow?: string;
  title?: string;
  items?: Item[];
}> = ({
  eyebrow = "PARETO",
  title = "How much of the outcome comes from the top few drivers?",
  items = DEFAULT,
}) => {
  const frame = useCurrentFrame();
  const width = 1680,
    height = 600,
    left = 80,
    right = 70,
    top = 35,
    bottom = 75,
    chartW = width - left - right,
    chartH = height - top - bottom;
  const max = niceMax(Math.max(...items.map((i) => i.value)) * 1.05),
    total = items.reduce((a, b) => a + b.value, 0),
    groupW = chartW / items.length;
  let run = 0;
  const cum = items.map((it, i) => {
    run += it.value;
    return {
      x: left + groupW * (i + 0.5),
      y: top + chartH - (run / total) * chartH,
    };
  });
  const lineP = tween(frame, 35, 45);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <svg width={width} height={height} className="mt-7">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <line
            key={r}
            x1={left}
            x2={width - right}
            y1={top + chartH * (1 - r)}
            y2={top + chartH * (1 - r)}
            stroke={VIZ.ink}
            strokeOpacity={0.1}
            strokeWidth={2}
          />
        ))}
        {items.map((it, i) => {
          const p = stagger(frame, i, 8, 4, 18),
            h = (it.value / max) * chartH * p,
            x = left + groupW * i + groupW * 0.2,
            w = groupW * 0.6;
          return (
            <g key={it.label}>
              <rect
                x={x}
                y={top + chartH - h}
                width={w}
                height={h}
                fill={i < 2 ? VIZ.yellow : VIZ.white}
                stroke={VIZ.ink}
                strokeWidth={2}
              />
              <text
                x={x + w / 2}
                y={height - 28}
                textAnchor="middle"
                fontFamily={
                  'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace'
                }
                fontSize={17}
                fill={VIZ.muted}
              >
                {it.label}
              </text>
            </g>
          );
        })}
        <path
          d={smoothPath(cum)}
          fill="none"
          stroke={VIZ.ink}
          strokeWidth={7}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - lineP}
        />
        {cum.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={8}
            fill={VIZ.ink}
            opacity={tween(frame, 55 + i * 2, 8)}
          />
        ))}
      </svg>
    </Frame>
  );
};
