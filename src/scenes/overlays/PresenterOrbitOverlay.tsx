import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BrutalCard } from "../../components/BrutalCard";
import { floatY, springIn } from "../../lib/motion";
import { OverlayShell } from "../../components/viz/overlayShared";

export type PresenterOrbitItem = {
  label: string;
  sublabel?: string;
  icon?: string;
  state?: "default" | "accent" | "muted";
};

const DEFAULT_ITEMS: PresenterOrbitItem[] = [
  { label: "RATES", sublabel: "Central banks", icon: "🏦", state: "default" },
  { label: "DEMAND", sublabel: "Consumers", icon: "🛒", state: "accent" },
  { label: "TECH", sublabel: "Productivity", icon: "💻", state: "accent" },
  { label: "CAPITAL", sublabel: "Investment", icon: "📈", state: "default" },
];

const POSITIONS: Array<React.CSSProperties> = [
  { left: 86, top: 140 },
  { right: 86, top: 140 },
  { left: 86, bottom: 140 },
  { right: 86, bottom: 140 },
  { left: 86, top: 425 },
  { right: 86, top: 425 },
];

export const PresenterOrbitOverlay: React.FC<{
  items?: PresenterOrbitItem[];
  transparent?: boolean;
}> = ({ items = DEFAULT_ITEMS, transparent = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <OverlayShell transparent={transparent}>
      {items.slice(0, 6).map((item, index) => {
        const p = springIn({
          frame,
          fps,
          delay: 5 + index * 6,
          damping: 15,
          stiffness: 135,
        });
        const y = floatY(frame, 4, 105, index * 18);
        const isAccent = item.state === "accent";
        const isMuted = item.state === "muted";

        return (
          <div
            key={`${item.label}-${index}`}
            style={{
              position: "absolute",
              width: 340,
              opacity: isMuted ? p * 0.42 : p,
              transform: `translateY(${(1 - p) * 30 + y}px) scale(${0.9 + p * 0.1}) rotate(${(1 - p) * (index % 2 ? -3 : 3)}deg)`,
              ...POSITIONS[index],
            }}
          >
            <BrutalCard yellow={isAccent} className="h-[220px] p-8">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="text-[44px]">{item.icon}</div>
                  <div className="border-2 border-ink bg-white px-3 py-1 text-[15px]">
                    {index + 1 < 10 ? `0${index + 1}` : String(index + 1)}
                  </div>
                </div>
                <div>
                  <div className="text-[34px] font-semibold tracking-[-0.04em]">
                    {item.label}
                  </div>
                  {item.sublabel ? (
                    <div className="mt-2 text-[19px] text-muted">
                      {item.sublabel}
                    </div>
                  ) : null}
                </div>
              </div>
            </BrutalCard>
          </div>
        );
      })}
    </OverlayShell>
  );
};
