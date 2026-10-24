import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "../../components/Frame";
import { BrutalCard } from "../../components/BrutalCard";
import { springIn, tween } from "../../lib/motion";

type Choice = {
  label: string;
  sublabel?: string;
  icon?: string;
  accent?: boolean;
};

export const PageFlipChoice: React.FC<{
  question?: string;
  eyebrow?: string;
  left?: Choice;
  right?: Choice;
}> = ({
  eyebrow = "TWO HORIZONS",
  question = "WHAT DRIVES THE MOVE?",
  left = {
    label: "SHORT TERM",
    sublabel: "Liquidity + positioning",
    icon: "⚡",
    accent: true,
  },
  right = { label: "LONG TERM", sublabel: "Earnings + structure", icon: "🏗️" },
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flipP = tween(frame, 5, 34);
  const angle = interpolate(flipP, [0, 1], [-93, 0]);
  const leftP = springIn({
    frame,
    fps,
    delay: 28,
    damping: 15,
    stiffness: 132,
  });
  const rightP = springIn({
    frame,
    fps,
    delay: 38,
    damping: 15,
    stiffness: 132,
  });

  const card = (choice: Choice, p: number, rotate: number) => (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px) rotate(${(1 - p) * rotate}deg)`,
      }}
    >
      <BrutalCard yellow={choice.accent} className="h-[285px] p-10">
        <div className="flex h-full flex-col justify-between">
          <div className="text-[68px]">{choice.icon}</div>
          <div>
            <div className="text-[42px] font-semibold tracking-[-0.04em]">
              {choice.label}
            </div>
            {choice.sublabel ? (
              <div className="mt-3 text-[22px] leading-[1.35] text-muted">
                {choice.sublabel}
              </div>
            ) : null}
          </div>
        </div>
      </BrutalCard>
    </div>
  );

  return (
    <Frame>
      <div
        className="absolute left-[180px] right-[180px] top-[70px] h-[390px]"
        style={{ perspective: 1200 }}
      >
        <div
          className="absolute left-[70px] right-[70px] top-0 flex h-[300px] items-center justify-center border-2 border-ink bg-ink text-white"
          style={{
            transformOrigin: "top center",
            transform: `rotateX(${angle}deg)`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            boxShadow: "8px 12px 0 var(--fm-accent, #FFD43B)",
          }}
        >
          <div className="text-center">
            <div className="text-[20px] tracking-[0.18em] text-yellow">
              {eyebrow}
            </div>
            <div className="mt-5 text-[72px] font-semibold tracking-[-0.05em]">
              {question}
            </div>
          </div>
        </div>

        <div
          className="absolute left-[120px] right-[120px] top-[300px] h-[34px] bg-soft"
          style={{ clipPath: "polygon(0 0,100% 0,97% 100%,3% 100%)" }}
        />
      </div>

      <div className="absolute bottom-[115px] left-[250px] right-[250px] grid grid-cols-2 gap-20">
        {card(left, leftP, -4)}
        {card(right, rightP, 4)}
      </div>
    </Frame>
  );
};
