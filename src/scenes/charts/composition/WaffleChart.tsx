import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

export const WaffleChart: React.FC<{ value?: number; label?: string }> = ({
  value = 37,
  label = "OF REVENUE COMES FROM REPEAT CUSTOMERS",
}) => {
  const frame = useCurrentFrame(),
    visible = Math.round(value * reveal(frame, 12, 35));
  return (
    <Frame>
      <SceneHeader
        eyebrow="SHARE OF 100"
        title="Make the proportion tangible."
      />
      <div className="mt-14 flex items-center gap-24">
        <div className="grid grid-cols-10 gap-3">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="h-[46px] w-[46px] border-2 border-ink"
              style={{
                background: i < visible ? palette.yellow : palette.soft,
              }}
            />
          ))}
        </div>
        <div className="max-w-[550px]">
          <div className="text-[150px] font-semibold leading-none tracking-[-0.08em]">
            {visible}%
          </div>
          <div className="mt-8 text-[28px] font-semibold leading-[1.35]">
            {label}
          </div>
        </div>
      </div>
    </Frame>
  );
};
