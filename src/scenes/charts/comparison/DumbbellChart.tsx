import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { stagger } from "../../../lib/chartMotion";
import { extent, scale } from "../../../components/viz/chartPrimitives";

type Row = { label: string; from: number; to: number };
const DEFAULT: Row[] = [
  { label: "Software", from: 22, to: 41 },
  { label: "Finance", from: 31, to: 36 },
  { label: "Retail", from: 14, to: 27 },
  { label: "Industry", from: 28, to: 24 },
  { label: "Media", from: 18, to: 33 },
];

export const DumbbellChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Row[];
  fromLabel?: string;
  toLabel?: string;
  suffix?: string;
  source?: string;
}> = ({
  eyebrow = "CHANGE",
  title = "Show both the level and the direction of change.",
  data = DEFAULT,
  fromLabel = "BEFORE",
  toLabel = "AFTER",
  suffix = "%",
  source,
}) => {
  const frame = useCurrentFrame();
  const [rawMin, rawMax] = extent(data.flatMap((d) => [d.from, d.to]));
  const pad = Math.max(1, (rawMax - rawMin) * 0.15);
  const min = rawMin - pad;
  const max = rawMax + pad;
  const width = 1300;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-12 ml-[240px] flex w-[1300px] justify-between text-[18px] text-muted">
        <span>
          {min.toFixed(0)}
          {suffix}
        </span>
        <span>
          {max.toFixed(0)}
          {suffix}
        </span>
      </div>
      <div className="mt-4 space-y-7">
        {data.map((row, i) => {
          const p = stagger(frame, i, 8, 6, 18);
          const x1 = scale(row.from, min, max, 0, width);
          const x2 = scale(row.to, min, max, 0, width);
          const left = Math.min(x1, x2);
          const lineW = Math.abs(x2 - x1) * p;
          return (
            <div
              key={row.label}
              className="grid grid-cols-[210px_1300px_140px] items-center gap-8"
            >
              <div className="text-[23px] font-semibold">{row.label}</div>
              <div className="relative h-[46px]">
                <div
                  className="absolute top-1/2 h-[4px] -translate-y-1/2 bg-soft"
                  style={{ left: 0, width }}
                />
                <div
                  className="absolute top-1/2 h-[5px] -translate-y-1/2 bg-ink"
                  style={{ left, width: lineW }}
                />
                <div
                  className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-white"
                  style={{ left: x1, opacity: p }}
                />
                <div
                  className="absolute top-1/2 h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-yellow"
                  style={{ left: x2, opacity: p }}
                />
              </div>
              <div className="text-[21px]">
                <span className="text-muted">{fromLabel}</span> {row.from}
                {suffix}
                <br />
                <span className="font-semibold">
                  {toLabel} {row.to}
                  {suffix}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
