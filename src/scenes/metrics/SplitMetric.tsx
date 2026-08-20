import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "../../components/Frame";
import { BrutalCard } from "../../components/BrutalCard";
import { Tag } from "../../components/Tag";
import { springIn } from "../../lib/motion";

export const SplitMetric: React.FC<{
  eyebrow?: string;
  leftValue?: number;
  rightValue?: number;
  leftSuffix?: string;
  rightSuffix?: string;
  leftLabel?: string;
  rightLabel?: string;
  rightTag?: string;
}> = ({
  eyebrow = "THE GAP",
  leftValue = 89,
  rightValue = 39,
  leftSuffix = "%",
  rightSuffix = "%",
  leftLabel = "Share under the old model",
  rightLabel = "Share under the new model",
  rightTag = "HIGHLIGHT",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftP = springIn({ frame, fps, delay: 4, damping: 18, stiffness: 145 });
  const rightP = springIn({
    frame,
    fps,
    delay: 13,
    damping: 17,
    stiffness: 145,
  });
  const leftNumber = interpolate(leftP, [0, 1], [0, leftValue]);
  const rightNumber = interpolate(rightP, [0, 1], [0, rightValue]);

  return (
    <Frame>
      <div className="mt-5">
        <Tag>{eyebrow}</Tag>
      </div>

      <div className="mt-32 grid grid-cols-[1.25fr_0.75fr] items-center gap-20">
        <div
          style={{
            opacity: leftP,
            transform: `translateX(${(1 - leftP) * -35}px)`,
          }}
        >
          <div className="text-[205px] font-semibold leading-none tracking-[-0.09em]">
            {Math.round(leftNumber)}
            <span className="text-[84px]">{leftSuffix}</span>
          </div>
          <div className="mt-7 max-w-[770px] text-[29px] leading-[1.45] text-muted">
            {leftLabel}
          </div>
        </div>

        <div
          style={{
            opacity: rightP,
            transform: `translateY(${(1 - rightP) * 42}px) scale(${0.92 + rightP * 0.08})`,
          }}
        >
          <BrutalCard yellow className="p-12">
            <div className="text-[21px] font-semibold tracking-[0.12em]">
              {rightTag}
            </div>
            <div className="mt-10 text-[118px] font-semibold leading-none tracking-[-0.08em]">
              {Math.round(rightNumber)}
              <span className="text-[54px]">{rightSuffix}</span>
            </div>
            <div className="mt-8 text-[24px] leading-[1.45]">{rightLabel}</div>
          </BrutalCard>
        </div>
      </div>
    </Frame>
  );
};
