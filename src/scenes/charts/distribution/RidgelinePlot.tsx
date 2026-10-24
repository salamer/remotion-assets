import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const series = [
  { label: "2020", pts: [8, 18, 42, 72, 88, 62, 31, 12] },
  { label: "2022", pts: [5, 13, 28, 54, 82, 80, 48, 20] },
  { label: "2024", pts: [3, 9, 20, 43, 68, 92, 71, 36] },
];

const LEGACY_DEFAULT_series = series;

export const RidgelinePlot: React.FC<{
  series?: typeof LEGACY_DEFAULT_series;
  title?: string;
  eyebrow?: string;
}> = ({
  series = LEGACY_DEFAULT_series,
  title = "The whole distribution moved — not just the average.",
  eyebrow = "DISTRIBUTION SHIFT",
}) => {
  const frame = useCurrentFrame(),
    W = 1350,
    H = 150;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-12 space-y-7">
        {series.map((s, i) => {
          const p = reveal(frame, 10 + i * 10, 24),
            d = s.pts
              .map(
                (v, j) =>
                  `${j === 0 ? "M" : "L"} ${(j / (s.pts.length - 1)) * W} ${H - v}`,
              )
              .join(" ");
          return (
            <div
              key={s.label}
              className="grid grid-cols-[140px_1fr] items-center"
            >
              <div className="text-[24px] font-semibold">{s.label}</div>
              <svg width={W} height={H}>
                <path
                  d={`${d} L ${W} ${H} L 0 ${H} Z`}
                  fill={i === 2 ? palette.yellow : palette.soft}
                />
                <path
                  d={d}
                  fill="none"
                  stroke={palette.ink}
                  strokeWidth={4}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
