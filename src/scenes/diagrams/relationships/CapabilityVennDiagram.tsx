import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { tween } from "../../../lib/chartMotion";

export const CapabilityVennDiagram: React.FC<{
  eyebrow?: string;
  title?: string;
  left?: string;
  right?: string;
  overlap?: string;
  leftIcon?: string;
  rightIcon?: string;
}> = ({
  eyebrow = "COOPERATION",
  title = "Partnerships make sense when capabilities overlap imperfectly.",
  left = "DISTRIBUTION",
  right = "TECHNOLOGY",
  overlap = "JOINT PRODUCT",
  leftIcon = "🌍",
  rightIcon = "💻",
}) => {
  const frame = useCurrentFrame();
  const p1 = tween(frame, 8, 20),
    p2 = tween(frame, 18, 20),
    p3 = tween(frame, 36, 16);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="relative mt-16 h-[600px]">
        <div
          className="absolute left-[300px] top-[70px] flex h-[430px] w-[540px] items-center justify-start rounded-full border-[4px] border-ink bg-yellow/70 px-16"
          style={{ opacity: p1, transform: `translateX(${(1 - p1) * -60}px)` }}
        >
          <div className="text-center">
            <div className="text-[80px]">{leftIcon}</div>
            <div className="mt-4 text-[28px] font-semibold">{left}</div>
          </div>
        </div>
        <div
          className="absolute right-[300px] top-[70px] flex h-[430px] w-[540px] items-center justify-end rounded-full border-[4px] border-ink bg-white/80 px-16"
          style={{ opacity: p2, transform: `translateX(${(1 - p2) * 60}px)` }}
        >
          <div className="text-center">
            <div className="text-[80px]">{rightIcon}</div>
            <div className="mt-4 text-[28px] font-semibold">{right}</div>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-[260px] -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-ink px-7 py-5 text-[23px] font-semibold text-white"
          style={{
            opacity: p3,
            boxShadow: "5px 5px 0 var(--fm-accent, #FFD43B)",
          }}
        >
          {overlap}
        </div>
      </div>
    </Frame>
  );
};
