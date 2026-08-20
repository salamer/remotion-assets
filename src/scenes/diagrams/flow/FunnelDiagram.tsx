import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";

const stages = [
  {
    label: "VISITORS",
    value: "100M",
    width: 100,
  },
  {
    label: "SIGNED UP",
    value: "38M",
    width: 75,
  },
  {
    label: "ACTIVE",
    value: "18M",
    width: 55,
  },
  {
    label: "PAYING",
    value: "7M",
    width: 35,
  },
];

export const FunnelDiagram: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader
        eyebrow="CONVERSION"
        title="A huge audience becomes a much smaller customer base."
      />

      <div className="mt-12 space-y-4">
        {stages.map((stage, index) => {
          const p = interpolate(
            frame,
            [10 + index * 8, 28 + index * 8],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={stage.label}
              className="mx-auto"
              style={{
                width: `${stage.width * p}%`,
              }}
            >
              <div
                className={`
                  flex h-[100px]
                  items-center
                  justify-between
                  border-2 border-ink
                  px-8
                  ${index === stages.length - 1 ? "bg-yellow" : "bg-white"}
                `}
              >
                <span className="text-[24px] font-semibold">{stage.label}</span>

                <span className="text-[32px] font-semibold">{stage.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
