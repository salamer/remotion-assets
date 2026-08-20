import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { springIn } from "../../../lib/motion";
import { colors, shadows } from "../../../style/theme";

type HierarchyTier = {
  label: string;
  sublabel?: string;
  description?: string;
  icon?: string;
  accent?: boolean;
};

const DEFAULT_TIERS: HierarchyTier[] = [
  {
    label: "OWNERS",
    sublabel: "Capital",
    description: "Control scarce assets",
    icon: "💰",
    accent: true,
  },
  {
    label: "OPERATORS",
    sublabel: "Management",
    description: "Allocate people and capital",
    icon: "🧠",
  },
  {
    label: "SPECIALISTS",
    sublabel: "Knowledge work",
    description: "Create differentiated output",
    icon: "💻",
  },
  {
    label: "LABOR",
    sublabel: "Execution",
    description: "Deliver standardized output",
    icon: "👷",
  },
];

export const HierarchyPyramid: React.FC<{
  eyebrow?: string;
  title?: string;
  tiers?: HierarchyTier[];
  footer?: { label: string; description?: string; icon?: string };
  source?: string;
}> = ({
  eyebrow = "STRUCTURE",
  title = "A hierarchy makes the distribution visible.",
  tiers = DEFAULT_TIERS,
  footer,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-12 flex flex-col items-center">
        {tiers.map((tier, index) => {
          const reverseIndex = tiers.length - 1 - index;
          const p = springIn({
            frame,
            fps,
            delay: 8 + reverseIndex * 7,
            damping: 18,
            stiffness: 150,
          });

          const widthPct =
            tiers.length === 1 ? 72 : 48 + (index / (tiers.length - 1)) * 52;
          const y = interpolate(p, [0, 1], [34, 0]);
          const scale = interpolate(p, [0, 1], [0.96, 1]);

          return (
            <div
              key={`${tier.label}-${index}`}
              className={`relative flex h-[142px] items-center border-2 border-ink px-14 ${
                tier.accent
                  ? "bg-yellow"
                  : index % 2 === 0
                    ? "bg-white"
                    : "bg-soft"
              }`}
              style={{
                width: `${widthPct}%`,
                clipPath: "polygon(7% 0, 93% 0, 100% 100%, 0 100%)",
                opacity: p,
                transform: `translateY(${y}px) scale(${scale})`,
                boxShadow:
                  index === tiers.length - 1 ? shadows.brutal : undefined,
                marginTop: index === 0 ? 0 : -2,
              }}
            >
              <div className="grid w-full grid-cols-[1fr_1.2fr_100px] items-center gap-8">
                <div>
                  <div className="text-[31px] font-semibold tracking-[-0.03em]">
                    {tier.label}
                  </div>
                  {tier.sublabel ? (
                    <div className="mt-1 text-[18px] text-muted">
                      {tier.sublabel}
                    </div>
                  ) : null}
                </div>

                <div className="text-[23px] leading-[1.35]">
                  {tier.description}
                </div>

                <div className="text-right text-[54px]">{tier.icon}</div>
              </div>
            </div>
          );
        })}

        {footer ? (
          <div
            className="mt-5 flex w-full items-center justify-between border-2 border-ink bg-ink px-12 py-6 text-white"
            style={{ boxShadow: `6px 6px 0 ${colors.yellow}` }}
          >
            <div>
              <div className="text-[28px] font-semibold">{footer.label}</div>
              {footer.description ? (
                <div className="mt-1 text-[19px] opacity-70">
                  {footer.description}
                </div>
              ) : null}
            </div>
            <div className="text-[46px]">{footer.icon}</div>
          </div>
        ) : null}
      </div>

      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
