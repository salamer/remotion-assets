import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { reveal } from "../../../lib/motion";

const items = [
  { name: "CORE", x: 72, y: 78, highlight: true },
  { name: "ADJACENCY", x: 58, y: 63 },
  { name: "LEGACY", x: 24, y: 30 },
  { name: "OPTION", x: 82, y: 35 },
];

export const StrategyMatrix: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow="STRATEGY MATRIX" title="Where should we play?" />
      <div className="relative mt-12 h-[650px] border-b-2 border-l-2 border-ink">
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-soft" />
        <div className="absolute left-0 top-1/2 h-[2px] w-full bg-soft" />
        <div className="absolute left-[16%] top-[20px] text-[22px] text-muted">
          DEFEND
        </div>
        <div className="absolute right-[10%] top-[20px] text-[22px] font-semibold">
          INVEST
        </div>
        <div className="absolute bottom-[20px] left-[16%] text-[22px] text-muted">
          EXIT
        </div>
        <div className="absolute bottom-[20px] right-[10%] text-[22px] text-muted">
          OPTION
        </div>
        {items.map((it, i) => {
          const p = reveal(frame, 12 + i * 7);
          return (
            <div
              key={it.name}
              className={`absolute border-2 border-ink px-5 py-3 text-[20px] font-semibold ${it.highlight ? "bg-yellow" : "bg-white"}`}
              style={{
                left: `${it.x}%`,
                bottom: `${it.y}%`,
                transform: `translate(-50%,50%) scale(${0.85 + 0.15 * p})`,
                opacity: p,
                boxShadow: it.highlight ? "5px 5px 0 #111" : undefined,
              }}
            >
              {it.name}
            </div>
          );
        })}
        <div className="absolute bottom-[-48px] left-1/2 -translate-x-1/2 text-[20px] text-muted">
          MARKET ATTRACTIVENESS →
        </div>
        <div className="absolute left-[-95px] top-1/2 -rotate-90 text-[20px] text-muted">
          OUR ADVANTAGE →
        </div>
      </div>
    </Frame>
  );
};
