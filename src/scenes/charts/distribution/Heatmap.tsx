import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

const ROWS = ["US", "EU", "JP", "KR", "CN"];
const COLS = ["AI", "CLOUD", "ADS", "ECOM", "FINTECH", "MEDIA"];
const VALUES = [
  [92, 88, 79, 61, 45, 70],
  [67, 72, 55, 58, 62, 64],
  [54, 49, 42, 51, 38, 73],
  [61, 44, 48, 69, 41, 80],
  [86, 73, 66, 94, 71, 57],
];
export const Heatmap: React.FC<{
  eyebrow?: string;
  title?: string;
  rows?: string[];
  cols?: string[];
  values?: number[][];
}> = ({
  eyebrow = "HEATMAP",
  title = "Find clusters and weak spots at a glance.",
  rows = ROWS,
  cols = COLS,
  values = VALUES,
}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...values.flat()),
    min = Math.min(...values.flat());
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div
        className="mt-14 grid"
        style={{ gridTemplateColumns: `220px repeat(${cols.length},1fr)` }}
      >
        <div />
        {cols.map((c) => (
          <div key={c} className="pb-4 text-center text-[19px] font-semibold">
            {c}
          </div>
        ))}
        {rows.map((r, ri) => (
          <React.Fragment key={r}>
            <div className="flex items-center text-[22px] font-semibold">
              {r}
            </div>
            {cols.map((c, ci) => {
              const p = stagger(frame, ri * cols.length + ci, 8, 1.3, 12);
              const v = values[ri]?.[ci] ?? 0;
              const t = (v - min) / Math.max(1e-9, max - min);
              return (
                <div
                  key={`${r}-${c}`}
                  className="m-[4px] flex h-[90px] items-center justify-center border-2 border-ink text-[22px] font-semibold"
                  style={{
                    opacity: p,
                    background: `rgba(255,212,59,${0.12 + 0.88 * t})`,
                  }}
                >
                  {v}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </Frame>
  );
};
