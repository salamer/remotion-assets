import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { tween } from "../../../lib/chartMotion";
import {
  extent,
  GridLines,
  scale,
  smoothPath,
  VIZ,
} from "../../../components/viz/chartPrimitives";

type Row = { label: string; a: number; b: number; c: number };
const DEFAULT: Row[] = [
  { label: "2020", a: 100, b: 100, c: 100 },
  { label: "2021", a: 118, b: 107, c: 102 },
  { label: "2022", a: 137, b: 112, c: 98 },
  { label: "2023", a: 159, b: 121, c: 105 },
  { label: "2024", a: 181, b: 133, c: 108 },
  { label: "2025", a: 214, b: 147, c: 116 },
];
export const IndexedLineChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Row[];
  labels?: [string, string, string];
}> = ({
  eyebrow = "INDEXED COMPARISON",
  title = "Rebase everything to 100 to compare growth rates.",
  data = DEFAULT,
  labels = ["A", "B", "C"],
}) => {
  const frame = useCurrentFrame();
  const width = 1680,
    height = 600,
    left = 80,
    right = 80,
    top = 35,
    bottom = 75,
    chartW = width - left - right,
    chartH = height - top - bottom;
  const vals = data.flatMap((d) => [d.a, d.b, d.c]);
  const [mn0, mx0] = extent(vals);
  const pad = (mx0 - mn0) * 0.08,
    mn = Math.min(90, mn0 - pad),
    mx = mx0 + pad;
  const x = (i: number) => left + (i / Math.max(1, data.length - 1)) * chartW,
    y = (v: number) => scale(v, mn, mx, top + chartH, top);
  const series = [
    { k: "a" as const, label: labels[0], stroke: VIZ.yellow, w: 10 },
    { k: "b" as const, label: labels[1], stroke: VIZ.ink, w: 6 },
    { k: "c" as const, label: labels[2], stroke: VIZ.muted, w: 4 },
  ];
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-2 text-[18px] text-muted">BASE YEAR = 100</div>
      <svg width={width} height={height} className="mt-2">
        <GridLines
          width={width}
          height={height}
          left={left}
          right={right}
          top={top}
          bottom={bottom}
        />
        <line
          x1={left}
          x2={width - right}
          y1={y(100)}
          y2={y(100)}
          stroke={VIZ.ink}
          strokeWidth={3}
          strokeDasharray="12 8"
          strokeOpacity={0.45}
        />
        {series.map((s, si) => {
          const p = tween(frame, 8 + si * 8, 50);
          const pts = data.map((d, i) => ({ x: x(i), y: y(Number(d[s.k])) }));
          return (
            <g key={s.label}>
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={s.stroke}
                strokeWidth={s.w}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
              <text
                x={pts.at(-1)!.x + 22}
                y={pts.at(-1)!.y + 6}
                fontFamily="IBM Plex Mono"
                fontSize={19}
                fill={VIZ.ink}
              >
                {s.label}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={x(i)}
            y={height - 28}
            textAnchor="middle"
            fontFamily="IBM Plex Mono"
            fontSize={17}
            fill={VIZ.muted}
          >
            {d.label}
          </text>
        ))}
      </svg>
    </Frame>
  );
};
