import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { tween } from "../../../lib/chartMotion";
import {
  GridLines,
  smoothPath,
  VIZ,
} from "../../../components/viz/chartPrimitives";

type Point = { label: string; value: number };
const DEFAULT: Point[] = [
  { label: "Q1", value: 12 },
  { label: "Q2", value: 18 },
  { label: "Q3", value: 15 },
  { label: "Q4", value: 27 },
  { label: "Q5", value: 32 },
  { label: "Q6", value: 41 },
  { label: "Q7", value: 38 },
  { label: "Q8", value: 52 },
];
export const AreaChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Point[];
  suffix?: string;
}> = ({
  eyebrow = "AREA",
  title = "Use area when accumulated magnitude matters.",
  data = DEFAULT,
  suffix = "",
}) => {
  const frame = useCurrentFrame(),
    p = tween(frame, 10, 55);
  const width = 1680,
    height = 600,
    left = 80,
    right = 50,
    top = 40,
    bottom = 75,
    chartW = width - left - right,
    chartH = height - top - bottom;
  const max = Math.max(...data.map((d) => d.value)) * 1.12;
  const pts = data.map((d, i) => ({
    x: left + (i / Math.max(1, data.length - 1)) * chartW,
    y: top + chartH - (d.value / max) * chartH,
  }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts.at(-1)?.x} ${top + chartH} L ${pts[0].x} ${top + chartH} Z`;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <svg width={width} height={height} className="mt-8">
        <defs>
          <clipPath id="area-reveal">
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
        <g clipPath="url(#area-reveal)">
          <path d={area} fill={VIZ.yellow} fillOpacity={0.72} />
          <path d={line} fill="none" stroke={VIZ.ink} strokeWidth={8} />
        </g>
        {pts.map((pt, i) => (
          <g key={i} opacity={tween(frame, 35 + i * 3, 10)}>
            <rect
              x={pt.x - 7}
              y={pt.y - 7}
              width={14}
              height={14}
              fill={i === pts.length - 1 ? VIZ.ink : VIZ.white}
              stroke={VIZ.ink}
              strokeWidth={2}
            />
            <text
              x={pt.x}
              y={height - 28}
              textAnchor="middle"
              fontFamily={
                'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace'
              }
              fontSize={17}
              fill={VIZ.muted}
            >
              {data[i].label}
            </text>
          </g>
        ))}
        <text
          x={pts.at(-1)!.x - 10}
          y={pts.at(-1)!.y - 22}
          textAnchor="end"
          fontFamily={
            'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace'
          }
          fontSize={20}
          fontWeight={600}
        >
          {data.at(-1)!.value}
          {suffix}
        </text>
      </svg>
    </Frame>
  );
};
