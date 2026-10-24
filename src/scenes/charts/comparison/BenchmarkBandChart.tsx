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

type Point = {
  label: string;
  value: number;
  benchmarkLow: number;
  benchmarkHigh: number;
};
const DEFAULT: Point[] = [
  { label: "Q1", value: 42, benchmarkLow: 35, benchmarkHigh: 45 },
  { label: "Q2", value: 47, benchmarkLow: 38, benchmarkHigh: 48 },
  { label: "Q3", value: 51, benchmarkLow: 41, benchmarkHigh: 51 },
  { label: "Q4", value: 58, benchmarkLow: 44, benchmarkHigh: 54 },
  { label: "Q5", value: 62, benchmarkLow: 47, benchmarkHigh: 57 },
];
export const BenchmarkBandChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Point[];
}> = ({
  eyebrow = "VS BENCHMARK RANGE",
  title = "Show when performance breaks out of the normal band.",
  data = DEFAULT,
}) => {
  const frame = useCurrentFrame(),
    p = tween(frame, 10, 52);
  const width = 1680,
    height = 600,
    left = 80,
    right = 60,
    top = 35,
    bottom = 75,
    chartW = width - left - right,
    chartH = height - top - bottom;
  const [mn0, mx0] = extent(
    data.flatMap((d) => [d.value, d.benchmarkLow, d.benchmarkHigh]),
  );
  const pad = (mx0 - mn0) * 0.12,
    mn = mn0 - pad,
    mx = mx0 + pad;
  const x = (i: number) => left + (i / Math.max(1, data.length - 1)) * chartW,
    y = (v: number) => scale(v, mn, mx, top + chartH, top);
  const lo = data.map((d, i) => ({ x: x(i), y: y(d.benchmarkLow) })),
    hi = data.map((d, i) => ({ x: x(i), y: y(d.benchmarkHigh) })),
    val = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const band = [...hi, ...lo.slice().reverse()]
    .map((q) => `${q.x},${q.y}`)
    .join(" ");
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <svg width={width} height={height} className="mt-8">
        <defs>
          <clipPath id="bench-reveal">
            <rect x={left} y={0} width={chartW * p} height={height} />
          </clipPath>
        </defs>
        <GridLines
          width={width}
          height={height}
          left={left}
          right={right}
          top={top}
          bottom={bottom}
        />
        <g clipPath="url(#bench-reveal)">
          <polygon
            points={band}
            fill={VIZ.soft}
            stroke={VIZ.ink}
            strokeOpacity={0.25}
          />
          <path
            d={smoothPath(val)}
            fill="none"
            stroke={VIZ.yellow}
            strokeWidth={10}
          />
          <path
            d={smoothPath(val)}
            fill="none"
            stroke={VIZ.ink}
            strokeWidth={3}
          />
        </g>
        {data.map((d, i) => (
          <text
            key={d.label}
            x={x(i)}
            y={height - 28}
            textAnchor="middle"
            fontFamily={
              'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace'
            }
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
