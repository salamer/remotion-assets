import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { tween } from "../../../lib/chartMotion";
import {
  extent,
  GridLines,
  MiniLegend,
  scale,
  smoothPath,
  VIZ,
} from "../../../components/viz/chartPrimitives";

type Row = { label: string; [key: string]: string | number };
const DEFAULT: Row[] = [
  { label: "2021", A: 100, B: 100, C: 100 },
  { label: "2022", A: 113, B: 106, C: 102 },
  { label: "2023", A: 129, B: 111, C: 107 },
  { label: "2024", A: 148, B: 118, C: 105 },
  { label: "2025", A: 171, B: 126, C: 112 },
];
export const MultiLineChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Row[];
  series?: string[];
  source?: string;
}> = ({
  eyebrow = "MULTI-SERIES TREND",
  title = "Compare trajectories on one common scale.",
  data = DEFAULT,
  series = ["A", "B", "C"],
  source,
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
  const vals = data.flatMap((r) => series.map((s) => Number(r[s])));
  const [mn0, mx0] = extent(vals);
  const pad = (mx0 - mn0) * 0.12;
  const mn = mn0 - pad,
    mx = mx0 + pad;
  const x = (i: number) => left + (i / Math.max(1, data.length - 1)) * chartW;
  const y = (v: number) => scale(v, mn, mx, top + chartH, top);
  const styles = [
    { stroke: VIZ.ink, w: 8, dash: "" },
    { stroke: VIZ.yellow, w: 10, dash: "" },
    { stroke: VIZ.muted, w: 5, dash: "16 10" },
  ];
  return (
    <Frame>
      <div className="flex items-start justify-between">
        <SceneHeader eyebrow={eyebrow} title={title} />
        <div className="mt-4">
          <MiniLegend
            items={series.map((s, i) => ({
              label: s,
              kind: "line" as const,
              yellow: i === 1,
            }))}
          />
        </div>
      </div>
      <svg width={width} height={height} className="mt-5">
        <GridLines
          width={width}
          height={height}
          left={left}
          right={right}
          top={top}
          bottom={bottom}
        />
        {series.map((s, si) => {
          const p = tween(frame, 10 + si * 9, 48);
          const pts = data.map((r, i) => ({ x: x(i), y: y(Number(r[s])) }));
          return (
            <g key={s}>
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={styles[si % styles.length].stroke}
                strokeWidth={styles[si % styles.length].w}
                pathLength={1}
                strokeDasharray={styles[si % styles.length].dash || 1}
                strokeDashoffset={styles[si % styles.length].dash ? 0 : 1 - p}
                opacity={styles[si % styles.length].dash ? p : 1}
              />
              {pts.map((pt, i) => (
                <rect
                  key={i}
                  x={pt.x - 6}
                  y={pt.y - 6}
                  width={12}
                  height={12}
                  fill={si === 1 ? VIZ.yellow : VIZ.white}
                  stroke={VIZ.ink}
                  strokeWidth={2}
                  opacity={tween(frame, 35 + si * 9 + i * 2, 10)}
                />
              ))}
            </g>
          );
        })}
        {data.map((r, i) => (
          <text
            key={r.label}
            x={x(i)}
            y={height - 28}
            textAnchor="middle"
            fontFamily="IBM Plex Mono"
            fontSize={18}
            fill={VIZ.muted}
          >
            {r.label}
          </text>
        ))}
      </svg>
      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
