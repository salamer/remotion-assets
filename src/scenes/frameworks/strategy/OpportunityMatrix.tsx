import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const items = [
  { name: "A", x: 82, y: 76, score: "$8B" },
  { name: "B", x: 68, y: 58, score: "$5B" },
  { name: "C", x: 48, y: 72, score: "$3B" },
  { name: "D", x: 28, y: 38, score: "$1B" },
];

export const OpportunityMatrix: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow="OPPORTUNITY MATRIX" title="Size × right to win." />
      <div className="relative mt-12 h-[650px] border-b-2 border-l-2 border-ink">
        <div className="absolute right-[5%] top-[24px] border-2 border-ink bg-yellow px-5 py-3 text-[20px] font-semibold">
          PRIORITY ZONE
        </div>
        {items.map((it, i) => {
          const p = reveal(frame, 10 + i * 7);
          const hi = it.x > 60 && it.y > 55;
          return (
            <div
              key={it.name}
              className="absolute flex h-[90px] w-[90px] items-center justify-center rounded-full border-2 border-ink text-center text-[18px] font-semibold"
              style={{
                left: `${it.x}%`,
                bottom: `${it.y}%`,
                transform: `translate(-50%,50%) scale(${p})`,
                opacity: p,
                boxShadow: hi ? "5px 5px 0 #111" : undefined,
                background: hi ? palette.yellow : palette.white,
              }}
            >
              {it.name}
              <br />
              {it.score}
            </div>
          );
        })}
        <div className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 text-[20px] text-muted">
          MARKET SIZE →
        </div>
        <div className="absolute left-[-70px] top-1/2 -rotate-90 text-[20px] text-muted">
          RIGHT TO WIN →
        </div>
      </div>
    </Frame>
  );
};
