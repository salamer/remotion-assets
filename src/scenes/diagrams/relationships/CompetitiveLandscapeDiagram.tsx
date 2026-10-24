import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

type Item = {
  label: string;
  x: number;
  y: number;
  icon?: string;
  highlight?: boolean;
};
const DEFAULT: Item[] = [
  { label: "A", x: 78, y: 78, icon: "⚡", highlight: true },
  { label: "B", x: 62, y: 56, icon: "☁️" },
  { label: "C", x: 40, y: 72, icon: "🧠" },
  { label: "D", x: 28, y: 34, icon: "📦" },
  { label: "E", x: 70, y: 27, icon: "💻" },
];

export const CompetitiveLandscapeDiagram: React.FC<{
  eyebrow?: string;
  title?: string;
  items?: Item[];
  xLabel?: string;
  yLabel?: string;
}> = ({
  eyebrow = "COMPETITIVE LANDSCAPE",
  title = "Position competitors on two strategic dimensions.",
  items = DEFAULT,
  xLabel = "SCALE →",
  yLabel = "DIFFERENTIATION →",
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="relative mt-12 h-[620px] border-b-2 border-l-2 border-ink bg-white">
        <div className="absolute -left-[55px] top-[250px] -rotate-90 text-[19px] text-muted">
          {yLabel}
        </div>
        <div className="absolute bottom-[-42px] left-[720px] text-[19px] text-muted">
          {xLabel}
        </div>
        <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-ink opacity-20" />
        <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-ink opacity-20" />
        <div className="absolute left-5 top-4 text-[16px] text-muted">
          NICHE / PREMIUM
        </div>
        <div className="absolute right-5 top-4 text-[16px] text-muted">
          SCALE + PREMIUM
        </div>
        <div className="absolute left-5 bottom-4 text-[16px] text-muted">
          NICHE / COMMODITY
        </div>
        <div className="absolute right-5 bottom-4 text-[16px] text-muted">
          SCALE / COMMODITY
        </div>
        {items.map((it, i) => {
          const p = stagger(frame, i, 8, 6, 16);
          return (
            <div
              key={it.label}
              className={`absolute flex h-[94px] w-[150px] items-center justify-center gap-3 border-2 border-ink text-[23px] font-semibold ${it.highlight ? "bg-yellow" : "bg-white"}`}
              style={{
                left: `${it.x}%`,
                bottom: `${it.y}%`,
                transform: `translate(-50%,50%) scale(${0.85 + 0.15 * p})`,
                opacity: p,
                boxShadow: "5px 5px 0 var(--fm-ink, #111)",
              }}
            >
              <span className="text-[31px]">{it.icon}</span>
              <span>{it.label}</span>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
