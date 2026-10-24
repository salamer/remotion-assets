import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../components/Frame";
import { SceneHeader } from "../../components/SceneHeader";
import { palette, reveal } from "../../lib/motion";

const cols = ["US", "EU", "JP", "CN"];
const rows = [
  { name: "SOFTWARE", values: [5, 3, 2, 4] },
  { name: "CAPITAL", values: [5, 4, 3, 4] },
  { name: "MANUFACTURING", values: [3, 4, 5, 5] },
  { name: "BRAND", values: [5, 4, 4, 3] },
  { name: "DISTRIBUTION", values: [4, 4, 4, 5] },
];

const LEGACY_DEFAULT_cols = cols;
const LEGACY_DEFAULT_rows = rows;

export const CapabilityHeatmap: React.FC<{
  cols?: typeof LEGACY_DEFAULT_cols;
  rows?: typeof LEGACY_DEFAULT_rows;
  title?: string;
  eyebrow?: string;
}> = ({
  cols = LEGACY_DEFAULT_cols,
  rows = LEGACY_DEFAULT_rows,
  title = "Strength is uneven across the system.",
  eyebrow = "CAPABILITY HEATMAP",
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-14 border-2 border-ink">
        <div className="grid grid-cols-[360px_repeat(4,1fr)] bg-yellow text-[22px] font-semibold">
          <div className="p-5">CAPABILITY</div>
          {cols.map((c) => (
            <div key={c} className="border-l-2 border-ink p-5 text-center">
              {c}
            </div>
          ))}
        </div>
        {rows.map((r, i) => {
          const p = reveal(frame, 8 + i * 6);
          return (
            <div
              key={r.name}
              className="grid grid-cols-[360px_repeat(4,1fr)] border-t-2 border-ink bg-white"
              style={{ opacity: p }}
            >
              <div className="p-5 text-[22px] font-semibold">{r.name}</div>
              {r.values.map((v, j) => (
                <div
                  key={j}
                  className="flex items-center justify-center border-l-2 border-ink p-4"
                >
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <span
                        key={k}
                        className="h-[24px] w-[24px] border-2 border-ink"
                        style={{
                          background: k < v ? palette.yellow : palette.soft,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
