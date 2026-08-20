import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { BrutalCard } from "../../components/BrutalCard";
import { SceneHeader } from "../../components/SceneHeader";

const items = [
  ["🌐", "BOOKING"],
  ["🏠", "AIRBNB"],
  ["✈️", "EXPEDIA"],
  ["🏨", "MARRIOTT"],
  ["🏖️", "VRBO"],
  ["🛎️", "HILTON"],
];

export const LogoCloud: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader
        eyebrow="COMPETITION"
        title="Everyone competes for the same traveler."
      />

      <div className="mt-20 grid grid-cols-3 gap-8">
        {items.map(([icon, name], index) => {
          const p = interpolate(
            frame,
            [8 + index * 5, 20 + index * 5],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={name}
              style={{
                opacity: p,
              }}
            >
              <BrutalCard
                yellow={index === 0}
                className="
                  flex h-[160px]
                  items-center gap-7
                  px-8
                "
              >
                <span className="text-[58px]">{icon}</span>

                <span className="text-[28px] font-semibold">{name}</span>
              </BrutalCard>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
