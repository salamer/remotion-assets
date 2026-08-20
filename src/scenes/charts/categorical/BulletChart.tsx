import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

type Row = { label: string; actual: number; target: number; max: number };
const DEFAULT: Row[] = [
  { label: "REVENUE", actual: 84, target: 90, max: 120 },
  { label: "MARGIN", actual: 63, target: 60, max: 100 },
  { label: "USERS", actual: 72, target: 80, max: 100 },
  { label: "FCF", actual: 91, target: 75, max: 110 },
];
export const BulletChart: React.FC<{
  eyebrow?: string;
  title?: string;
  rows?: Row[];
}> = ({
  eyebrow = "TARGET VS ACTUAL",
  title = "Compact performance dashboard without gauge clutter.",
  rows = DEFAULT,
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-16 space-y-10">
        {rows.map((r, i) => {
          const p = stagger(frame, i, 8, 6, 18);
          return (
            <div
              key={r.label}
              className="grid grid-cols-[220px_1fr_120px] items-center gap-7"
            >
              <div className="text-[22px] font-semibold">{r.label}</div>
              <div className="relative h-[66px] border-2 border-ink bg-soft">
                <div
                  className="absolute left-0 top-0 h-full bg-white"
                  style={{ width: "70%" }}
                />
                <div
                  className="absolute left-0 top-0 h-full bg-yellow"
                  style={{ width: `${(r.actual / r.max) * 100 * p}%` }}
                />
                <div
                  className="absolute -top-[9px] h-[82px] w-[5px] bg-ink"
                  style={{ left: `${(r.target / r.max) * 100}%` }}
                />
                <span
                  className="absolute -top-[32px] text-[15px] text-muted"
                  style={{
                    left: `${(r.target / r.max) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  TARGET {r.target}
                </span>
              </div>
              <div className="text-right text-[28px] font-semibold">
                {Math.round(r.actual * p)}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
