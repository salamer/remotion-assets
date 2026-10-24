import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { chart, typography } from "../../../style/theme";

type Point = {
  label: string;
  value: number;
};

type Props = {
  title?: string;
  eyebrow?: string;
  data?: Point[];
  prefix?: string;
  suffix?: string;
  source?: string;
};

const DEFAULT_DATA: Point[] = [
  { label: "2020", value: 3.4 },
  { label: "2021", value: 6.0 },
  { label: "2022", value: 8.4 },
  { label: "2023", value: 9.9 },
  { label: "2024", value: 11.1 },
];

export const LineChart: React.FC<Props> = ({
  eyebrow = "AIRBNB / REVENUE",
  title = "Growth resumed after the pandemic.",
  data = DEFAULT_DATA,
  prefix = "$",
  suffix = "B",
  source = "COMPANY FILINGS",
}) => {
  const frame = useCurrentFrame();

  const lineProgress = interpolate(frame, [15, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const width = 1500;
  const height = 520;

  const max = Math.max(...data.map((x) => x.value));
  const min = Math.min(...data.map((x) => x.value));

  const points = data.map((item, index) => {
    const x = 65 + (index / Math.max(1, data.length - 1)) * (width - 130);
    const normalized = (item.value - min) / Math.max(0.0001, max - min);
    const y = height - 50 - normalized * (height - 100);

    return { ...item, x, y };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-16">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              x2={width}
              y1={height * ratio}
              y2={height * ratio}
              stroke={chart.colors.primary}
              strokeOpacity={chart.guideOpacity}
              strokeWidth={2}
            />
          ))}

          <path
            d={path}
            fill="none"
            stroke={chart.colors.primary}
            strokeWidth={chart.strokeWidth}
            strokeLinecap={chart.strokeLinecap}
            strokeLinejoin="miter"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - lineProgress}
          />

          {points.map((point, index) => {
            const dotProgress = interpolate(
              frame,
              [25 + index * 6, 35 + index * 6],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            const isLatest = index === points.length - 1;

            return (
              <g key={point.label} opacity={dotProgress}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={chart.dotRadius}
                  fill={isLatest ? chart.colors.emphasis : chart.colors.primary}
                  stroke={chart.colors.primary}
                  strokeWidth={chart.dotStrokeWidth}
                />

                <text
                  x={point.x}
                  y={point.y - 25}
                  textAnchor="middle"
                  fontSize={24}
                  fontFamily={typography.fontFamily}
                  fontWeight={typography.weight.semibold}
                >
                  {prefix}
                  {point.value}
                  {suffix}
                </text>

                <text
                  x={point.x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize={21}
                  fontFamily={typography.fontFamily}
                  fill={chart.colors.label}
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <Source>{source}</Source>
    </Frame>
  );
};
