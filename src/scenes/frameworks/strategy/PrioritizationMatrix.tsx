import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { reveal } from "../../../lib/motion";

const initiatives = [
  { name: "AI PRICING", x: 84, y: 78, size: 92, icon: "🤖" },
  { name: "NEW MARKET", x: 70, y: 55, size: 72, icon: "🌍" },
  { name: "COST CUT", x: 58, y: 78, size: 58, icon: "✂️" },
  { name: "REBRAND", x: 24, y: 32, size: 50, icon: "🎨" },
];

const LEGACY_DEFAULT_initiatives = initiatives;

export const PrioritizationMatrix: React.FC<{
  initiatives?: typeof LEGACY_DEFAULT_initiatives;
  title?: string;
  eyebrow?: string;
}> = ({
  initiatives = LEGACY_DEFAULT_initiatives,
  title = "Value versus effort.",
  eyebrow = "PRIORITIZATION",
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="relative mt-12 h-[650px] border-b-2 border-l-2 border-ink">
        <div className="absolute bottom-1/2 left-0 h-[2px] w-full bg-soft" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-soft" />
        <div className="absolute right-[8%] top-[20px] text-[22px] font-semibold">
          DO FIRST
        </div>
        {initiatives.map((it, i) => {
          const p = reveal(frame, 12 + i * 7);
          return (
            <div
              key={it.name}
              className="absolute flex items-center justify-center rounded-full border-2 border-ink bg-yellow text-center font-semibold"
              style={{
                left: `${it.x}%`,
                bottom: `${it.y}%`,
                width: it.size,
                height: it.size,
                transform: `translate(-50%,50%) scale(${p})`,
                opacity: p,
              }}
            >
              <div className="text-[14px] leading-tight">
                {it.icon}
                <br />
                {it.name}
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 text-[20px] text-muted">
          EFFORT →
        </div>
        <div className="absolute left-[-55px] top-1/2 -rotate-90 text-[20px] text-muted">
          VALUE →
        </div>
      </div>
    </Frame>
  );
};
