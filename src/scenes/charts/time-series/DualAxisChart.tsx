import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {Source} from "../../../components/Source";
import {tween} from "../../../lib/motion";
import {colors} from "../../../style/theme";
import {InlineLegend} from "../../../components/viz/overlayShared";

type DualMetricPoint = {
  label: string;
  bar: number;
  line: number;
};

const DEFAULT_DATA: DualMetricPoint[] = [
  {label: "2018", bar: 48, line: 105},
  {label: "2019", bar: 60, line: 110},
  {label: "2020", bar: 42, line: 95},
  {label: "2021", bar: 72, line: 118},
  {label: "2022", bar: 86, line: 121},
  {label: "2023", bar: 112, line: 135},
  {label: "2024", bar: 130, line: 158},
  {label: "2025", bar: 146, line: 205},
];

const niceMax = (value: number) => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
};

const smoothPath = (points: Array<{x: number; y: number}>) => {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
};

export const DualAxisChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: DualMetricPoint[];
  barLabel?: string;
  lineLabel?: string;
  leftUnit?: string;
  rightUnit?: string;
  highlightFromIndex?: number;
  source?: string;
}> = ({
  eyebrow = "TWO METRICS",
  title = "Volume and price can tell different stories.",
  data = DEFAULT_DATA,
  barLabel = "VOLUME",
  lineLabel = "PRICE INDEX",
  leftUnit = "",
  rightUnit = "",
  highlightFromIndex = 5,
  source,
}) => {
  const frame = useCurrentFrame();
  const width = 1680;
  const height = 600;
  const left = 95;
  const right = 110;
  const top = 42;
  const bottom = 85;
  const chartW = width - left - right;
  const chartH = height - top - bottom;

  const maxBar = niceMax(Math.max(...data.map((d) => d.bar)) * 1.05);
  const minLine = Math.min(...data.map((d) => d.line));
  const maxLineRaw = Math.max(...data.map((d) => d.line));
  const linePad = Math.max(1, (maxLineRaw - minLine) * 0.15);
  const lineMin = minLine - linePad;
  const lineMax = maxLineRaw + linePad;

  const xFor = (i: number) => left + (i / Math.max(1, data.length - 1)) * chartW;
  const yLine = (v: number) => top + (1 - (v - lineMin) / Math.max(0.0001, lineMax - lineMin)) * chartH;
  const linePoints = data.map((d, i) => ({x: xFor(i), y: yLine(d.line)}));
  const path = smoothPath(linePoints);
  const lineP = tween(frame, 24, 58);

  const highlightX =
    highlightFromIndex >= 0 && highlightFromIndex < data.length
      ? xFor(highlightFromIndex) - chartW / Math.max(1, data.length - 1) / 2
      : width;

  return (
    <Frame>
      <div className="flex items-start justify-between gap-12">
        <SceneHeader eyebrow={eyebrow} title={title} />
        <div className="mt-4">
          <InlineLegend
            items={[
              {label: barLabel, kind: "bar"},
              {label: lineLabel, kind: "line"},
            ]}
          />
        </div>
      </div>

      <svg width={width} height={height} className="mt-8">
        {highlightX < width ? (
          <rect
            x={highlightX}
            y={top}
            width={width - right - highlightX}
            height={chartH}
            fill={colors.yellow}
            opacity={0.16}
          />
        ) : null}

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = top + ratio * chartH;
          const leftValue = maxBar * (1 - ratio);
          const rightValue = lineMax - (lineMax - lineMin) * ratio;
          return (
            <g key={ratio}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke={colors.ink}
                strokeOpacity={0.12}
                strokeWidth={2}
              />
              <text x={left - 14} y={y + 6} textAnchor="end" fontSize={17} fill="#737373" fontFamily="IBM Plex Mono">
                {leftValue.toFixed(0)}{leftUnit}
              </text>
              <text x={width - right + 14} y={y + 6} textAnchor="start" fontSize={17} fill="#737373" fontFamily="IBM Plex Mono">
                {rightValue.toFixed(0)}{rightUnit}
              </text>
            </g>
          );
        })}

        {data.map((d, index) => {
          const p = tween(frame, 8 + index * 2.2, 18);
          const x = xFor(index);
          const barHeight = (d.bar / maxBar) * chartH * p;
          return (
            <g key={d.label}>
              <rect
                x={x - 18}
                y={top + chartH - barHeight}
                width={36}
                height={barHeight}
                fill={colors.yellow}
                stroke={colors.ink}
                strokeWidth={2}
              />
              <text
                x={x}
                y={top + chartH + 37}
                textAnchor="middle"
                fontSize={17}
                fill="#737373"
                fontFamily="IBM Plex Mono"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        <path
          d={path}
          fill="none"
          stroke={colors.ink}
          strokeWidth={7}
          strokeLinecap="square"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - lineP}
        />

        {linePoints.map((point, index) => {
          const p = tween(frame, 48 + index * 3, 10);
          return (
            <rect
              key={index}
              x={point.x - 7}
              y={point.y - 7}
              width={14}
              height={14}
              fill={index === linePoints.length - 1 ? colors.yellow : colors.ink}
              stroke={colors.ink}
              strokeWidth={2}
              opacity={p}
            />
          );
        })}
      </svg>

      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
