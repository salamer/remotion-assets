import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const groups = [
  { name: "SMALL", values: [12, 18, 22, 26, 29, 32, 36, 40] },
  { name: "MID", values: [28, 34, 39, 44, 48, 55, 59, 63] },
  { name: "LARGE", values: [45, 52, 58, 64, 72, 78, 83, 88] },
];

export const DotStripPlot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader
        eyebrow="DISTRIBUTION BY GROUP"
        title="Compare the spread, not just the mean."
      />
      <div className="mt-14 space-y-12">
        {groups.map((g, gi) => (
          <div
            key={g.name}
            className="grid grid-cols-[180px_1fr] items-center gap-10"
          >
            <div className="text-[24px] font-semibold">{g.name}</div>
            <div className="relative h-[90px] border-b-2 border-ink">
              {g.values.map((v, i) => {
                const p = reveal(frame, 10 + gi * 9 + i * 2, 10);
                return (
                  <div
                    key={i}
                    className="absolute bottom-[22px] h-[22px] w-[22px] rounded-full border-2 border-ink"
                    style={{
                      left: `${v}%`,
                      background: gi === 2 ? palette.yellow : palette.white,
                      transform: `translateX(-50%) scale(${p})`,
                      opacity: p,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 ml-[220px] flex justify-between text-[18px] text-muted">
        <span>LOW</span>
        <span>HIGH</span>
      </div>
    </Frame>
  );
};
