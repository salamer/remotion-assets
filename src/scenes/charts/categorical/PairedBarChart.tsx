import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { stagger } from "../../../lib/chartMotion";
import { niceMax } from "../../../components/viz/chartPrimitives";

type Row = { label: string; a: number; b: number };
const DEFAULT: Row[] = [
  { label: "US", a: 42, b: 57 },
  { label: "EU", a: 34, b: 39 },
  { label: "JAPAN", a: 18, b: 26 },
  { label: "KOREA", a: 15, b: 22 },
];

export const PairedBarChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Row[];
  aLabel?: string;
  bLabel?: string;
  suffix?: string;
  source?: string;
}> = ({
  eyebrow = "SIDE-BY-SIDE",
  title = "Two series, one category at a time.",
  data = DEFAULT,
  aLabel = "2020",
  bLabel = "2025",
  suffix = "%",
  source,
}) => {
  const frame = useCurrentFrame();
  const max = niceMax(Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.05);
  return (
    <Frame>
      <div className="flex items-start justify-between gap-12">
        <SceneHeader eyebrow={eyebrow} title={title} />
        <div className="mt-4 flex gap-6 text-[18px] text-muted">
          <span className="flex items-center gap-2">
            <i className="h-[16px] w-[16px] border-2 border-ink bg-white" />
            {aLabel}
          </span>
          <span className="flex items-center gap-2">
            <i className="h-[16px] w-[16px] border-2 border-ink bg-yellow" />
            {bLabel}
          </span>
        </div>
      </div>

      <div className="mt-14 space-y-7">
        {data.map((row, i) => {
          const p = stagger(frame, i, 8, 6, 18);
          return (
            <div
              key={row.label}
              className="grid grid-cols-[210px_1fr_110px] items-center gap-6"
            >
              <div className="text-[24px] font-semibold">{row.label}</div>
              <div className="space-y-3">
                <div
                  className="h-[34px] border-2 border-ink bg-white"
                  style={{ width: `${(row.a / max) * 100 * p}%` }}
                />
                <div
                  className="h-[34px] border-2 border-ink bg-yellow"
                  style={{ width: `${(row.b / max) * 100 * p}%` }}
                />
              </div>
              <div className="text-right text-[22px] font-semibold">
                <div>
                  {row.a}
                  {suffix}
                </div>
                <div>
                  {row.b}
                  {suffix}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
