import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { BrutalCard } from "../../components/BrutalCard";
import { SceneHeader } from "../../components/SceneHeader";

export const BeforeAfterCompare: React.FC = () => {
  const frame = useCurrentFrame();

  const left = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const right = interpolate(frame, [28, 43], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Frame>
      <SceneHeader eyebrow="BUSINESS MODEL" title="The economics changed." />

      <div className="mt-20 grid grid-cols-2 gap-16">
        <div
          style={{
            opacity: left,
          }}
        >
          <BrutalCard className="p-10">
            <div className="text-[22px] text-muted">BEFORE</div>

            <div className="mt-8 text-[90px]">🏨</div>

            <div className="mt-8 text-[42px] font-semibold">Own the assets</div>

            <div className="mt-5 text-[25px] leading-[1.5] text-muted">
              Buildings.
              <br />
              Employees.
              <br />
              Maintenance.
            </div>
          </BrutalCard>
        </div>

        <div
          style={{
            opacity: right,
          }}
        >
          <BrutalCard yellow className="p-10">
            <div className="text-[22px]">AFTER</div>

            <div className="mt-8 text-[90px]">💻</div>

            <div className="mt-8 text-[42px] font-semibold">
              Own the platform
            </div>

            <div className="mt-5 text-[25px] leading-[1.5]">
              Software.
              <br />
              Brand.
              <br />
              Network.
            </div>
          </BrutalCard>
        </div>
      </div>
    </Frame>
  );
};
