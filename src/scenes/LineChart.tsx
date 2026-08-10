import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";
import {Source} from "../components/Source";

type Point = {
  label: string;
  value: number;
};

type Props = {
  title?: string;
  eyebrow?: string;
  data?: Point[];
};

const DEFAULT_DATA: Point[] = [
  {label: "2020", value: 3.4},
  {label: "2021", value: 6.0},
  {label: "2022", value: 8.4},
  {label: "2023", value: 9.9},
  {label: "2024", value: 11.1},
];

export const LineChart: React.FC<Props> = ({
  eyebrow = "AIRBNB / REVENUE",
  title = "Growth resumed after the pandemic.",
  data = DEFAULT_DATA,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [15, 65],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const width = 1500;
  const height = 520;

  const max = Math.max(...data.map((x) => x.value));
  const min = Math.min(...data.map((x) => x.value));

  const points = data.map((item, index) => {
    const x =
      (index / Math.max(1, data.length - 1)) *
      width;

    const normalized =
      (item.value - min) /
      Math.max(0.0001, max - min);

    const y =
      height - 50 - normalized * (height - 100);

    return {
      ...item,
      x,
      y,
    };
  });

  const path = points
    .map((p, i) =>
      `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`,
    )
    .join(" ");

  return (
    <Frame>
      <SceneHeader
        eyebrow={eyebrow}
        title={title}
      />

      <div className="mt-16">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* horizontal guides */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              x2={width}
              y1={height * ratio}
              y2={height * ratio}
              stroke="#111"
              strokeOpacity={0.12}
              strokeWidth={2}
            />
          ))}

          <path
            d={path}
            fill="none"
            stroke="#111"
            strokeWidth={8}
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeDasharray={4000}
            strokeDashoffset={
              4000 * (1 - progress)
            }
          />

          {points.map((point, index) => {
            const dotProgress = interpolate(
              frame,
              [
                25 + index * 6,
                35 + index * 6,
              ],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return (
              <g
                key={point.label}
                opacity={dotProgress}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={10}
                  fill={
                    index === points.length - 1
                      ? "#FFD43B"
                      : "#111111"
                  }
                  stroke="#111"
                  strokeWidth={3}
                />

                <text
                  x={point.x}
                  y={point.y - 25}
                  textAnchor="middle"
                  fontSize={24}
                  fontFamily="IBM Plex Mono"
                  fontWeight={600}
                >
                  ${point.value}B
                </text>

                <text
                  x={point.x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize={21}
                  fontFamily="IBM Plex Mono"
                  fill="#737373"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <Source>COMPANY FILINGS</Source>
    </Frame>
  );
};