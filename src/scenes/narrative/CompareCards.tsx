import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BrutalCard } from "../../components/BrutalCard";
import { floatY, springIn } from "../../lib/motion";
import { OverlayShell } from "../../components/viz/overlayShared";

type DuelSide = {
  label: string;
  sublabel?: string;
  icon: string;
  note?: string;
  accent?: boolean;
};

export const CompareCards: React.FC<{
  left?: DuelSide;
  right?: DuelSide;
  transparent?: boolean;
  showVs?: boolean;
}> = ({
  left = {
    label: "MARKET A",
    sublabel: "Domestic",
    icon: "🏠",
    note: "Large installed base",
    accent: true,
  },
  right = {
    label: "MARKET B",
    sublabel: "Overseas",
    icon: "🌍",
    note: "Faster growth",
  },
  transparent = true,
  showVs = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftP = springIn({ frame, fps, delay: 4, damping: 14, stiffness: 125 });
  const rightP = springIn({
    frame,
    fps,
    delay: 10,
    damping: 14,
    stiffness: 125,
  });

  const renderCard = (side: DuelSide, isLeft: boolean, p: number) => {
    const x = (1 - p) * (isLeft ? -340 : 340);
    const y = floatY(frame, 6, 105, isLeft ? 0 : 27);
    const rotate =
      (1 - p) * (isLeft ? -4 : 4) +
      Math.sin((frame + (isLeft ? 0 : 25)) / 55) * 0.4;

    return (
      <div
        style={{
          position: "absolute",
          top: 190,
          [isLeft ? "left" : "right"]: 86,
          width: 500,
          opacity: p,
          transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${0.92 + p * 0.08})`,
        }}
      >
        <BrutalCard yellow={side.accent} className="h-[600px] p-10">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[36px] font-semibold tracking-[-0.04em]">
                  {side.label}
                </div>
                {side.sublabel ? (
                  <div className="mt-2 text-[21px] text-muted">
                    {side.sublabel}
                  </div>
                ) : null}
              </div>
              <div className="border-2 border-ink bg-white px-4 py-2 text-[18px]">
                CARD
              </div>
            </div>

            <div className="text-center text-[160px] leading-none">
              {side.icon}
            </div>

            <div className="border-t-2 border-ink pt-6 text-[24px] leading-[1.35]">
              {side.note}
            </div>
          </div>
        </BrutalCard>
      </div>
    );
  };

  return (
    <OverlayShell transparent={transparent}>
      {renderCard(left, true, leftP)}
      {renderCard(right, false, rightP)}

      {showVs ? (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-yellow px-5 py-3 text-[26px] font-semibold"
          style={{ boxShadow: "5px 5px 0 #111" }}
        >
          VS
        </div>
      ) : null}
    </OverlayShell>
  );
};
