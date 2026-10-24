import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { reveal } from "../../../lib/motion";

const risks = [
  { name: "REGULATION", x: 72, y: 80, icon: "⚖️", high: true },
  { name: "FX", x: 36, y: 55, icon: "💱" },
  { name: "SUPPLY", x: 63, y: 43, icon: "📦" },
  { name: "TALENT", x: 28, y: 28, icon: "👤" },
  { name: "CYBER", x: 82, y: 68, icon: "🔒", high: true },
];

const LEGACY_DEFAULT_risks = risks;

export const RiskMatrix: React.FC<{
  risks?: typeof LEGACY_DEFAULT_risks;
  title?: string;
  eyebrow?: string;
}> = ({
  risks = LEGACY_DEFAULT_risks,
  title = "Which risks deserve attention first?",
  eyebrow = "RISK MATRIX",
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div
        className="relative mt-12 h-[650px] border-2 border-ink"
        style={{
          background:
            "linear-gradient(135deg,var(--fm-paper, #FAFAF7) 0%,var(--fm-paper, #FAFAF7) 45%,#FFF7B8 72%,var(--fm-accent, #FFD43B) 100%)",
        }}
      >
        {[25, 50, 75].map((v) => (
          <React.Fragment key={v}>
            <div
              className="absolute top-0 h-full w-[1px] bg-ink/10"
              style={{ left: `${v}%` }}
            />
            <div
              className="absolute left-0 h-[1px] w-full bg-ink/10"
              style={{ bottom: `${v}%` }}
            />
          </React.Fragment>
        ))}
        {risks.map((r, i) => {
          const p = reveal(frame, 10 + i * 7);
          return (
            <div
              key={r.name}
              className={`absolute border-2 border-ink px-4 py-3 text-[19px] font-semibold ${r.high ? "bg-yellow" : "bg-white"}`}
              style={{
                left: `${r.x}%`,
                bottom: `${r.y}%`,
                transform: "translate(-50%,50%)",
                opacity: p,
                boxShadow: r.high ? "4px 4px 0 var(--fm-ink, #111)" : undefined,
              }}
            >
              {r.icon} {r.name}
            </div>
          );
        })}
        <div className="absolute bottom-[-44px] left-1/2 -translate-x-1/2 text-[20px] text-muted">
          PROBABILITY →
        </div>
        <div className="absolute left-[-65px] top-1/2 -rotate-90 text-[20px] text-muted">
          IMPACT →
        </div>
      </div>
    </Frame>
  );
};
