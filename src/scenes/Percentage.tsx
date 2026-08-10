import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";
import {BrutalCard} from "../components/BrutalCard";

type Props = {
  value?: number;
  label?: string;
};

export const Percentage: React.FC<Props> = ({
  value = 46,
  label = "GOOGLE SEARCH MARKET SHARE",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(
    frame,
    [15, 55],
    [0, value],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Frame>
      <SceneHeader
        eyebrow="MARKET SHARE"
        title="One company still dominates."
      />

      <div className="mt-24">

        <div className="flex items-end gap-10">

          <div className="text-[180px] font-semibold leading-none tracking-[-0.08em]">
            {Math.round(p)}%
          </div>

          <BrutalCard
            yellow
            className="mb-3 px-6 py-4 text-[25px] font-semibold"
          >
            {label}
          </BrutalCard>

        </div>

        <div className="mt-14 h-[100px] border-2 border-ink bg-white">
          <div
            className="h-full border-r-2 border-ink bg-yellow"
            style={{
              width: `${p}%`,
            }}
          />
        </div>

        <div className="mt-5 flex justify-between text-[20px] text-muted">
          <span>0%</span>
          <span>100%</span>
        </div>

      </div>
    </Frame>
  );
};