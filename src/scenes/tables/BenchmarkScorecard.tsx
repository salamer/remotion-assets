import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../components/Frame";
import { SceneHeader } from "../../components/SceneHeader";
import { reveal } from "../../lib/motion";

const rows = [
  { metric: "GROWTH", ours: 18, peer: 12, best: 24, unit: "%" },
  { metric: "MARGIN", ours: 21, peer: 26, best: 34, unit: "%" },
  { metric: "NPS", ours: 61, peer: 55, best: 72, unit: "" },
  { metric: "R&D / SALES", ours: 9, peer: 7, best: 12, unit: "%" },
];

const LEGACY_DEFAULT_rows = rows;

export const BenchmarkScorecard: React.FC<{
  rows?: typeof LEGACY_DEFAULT_rows;
  title?: string;
  eyebrow?: string;
}> = ({
  rows = LEGACY_DEFAULT_rows,
  title = "Where we outperform — and where we do not.",
  eyebrow = "BENCHMARK",
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-14 border-2 border-ink bg-white">
        <div className="grid grid-cols-[280px_1fr_180px_180px_180px] bg-yellow px-6 py-5 text-[20px] font-semibold">
          <div>METRIC</div>
          <div>POSITION</div>
          <div>OURS</div>
          <div>PEER</div>
          <div>BEST</div>
        </div>
        {rows.map((r, i) => {
          const max = Math.max(r.ours, r.peer, r.best) * 1.08,
            p = reveal(frame, 10 + i * 8);
          return (
            <div
              key={r.metric}
              className="grid grid-cols-[280px_1fr_180px_180px_180px] items-center border-t-2 border-ink px-6 py-6"
              style={{ opacity: p }}
            >
              <div className="text-[22px] font-semibold">{r.metric}</div>
              <div className="relative h-[42px]">
                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-soft" />
                <div
                  className="absolute top-1/2 h-[24px] w-[8px] -translate-y-1/2 bg-ink"
                  style={{ left: `${(r.peer / max) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 h-[24px] w-[8px] -translate-y-1/2 bg-muted"
                  style={{ left: `${(r.best / max) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-yellow"
                  style={{ left: `${(r.ours / max) * 100}%` }}
                />
              </div>
              <div className="text-[24px] font-semibold">
                {r.ours}
                {r.unit}
              </div>
              <div className="text-[22px] text-muted">
                {r.peer}
                {r.unit}
              </div>
              <div className="text-[22px] text-muted">
                {r.best}
                {r.unit}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
