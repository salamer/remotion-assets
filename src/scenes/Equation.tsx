import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {BrutalCard} from "../components/BrutalCard";
import {SceneHeader} from "../components/SceneHeader";

const pieces = [
  {
    text: "PROFIT",
    yellow: true,
  },
  {
    text: "=",
  },
  {
    text: "REVENUE",
  },
  {
    text: "−",
  },
  {
    text: "COST",
  },
];

export const Equation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader
        eyebrow="THE MODEL"
        title="Strip the business down to one equation."
      />

      <div className="mt-40 flex items-center justify-center gap-7">

        {pieces.map((piece, index) => {
          const p = interpolate(
            frame,
            [
              12 + index * 8,
              22 + index * 8,
            ],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          if (
            piece.text === "=" ||
            piece.text === "−"
          ) {
            return (
              <div
                key={index}
                className="text-[72px] font-semibold"
                style={{
                  opacity: p,
                }}
              >
                {piece.text}
              </div>
            );
          }

          return (
            <div
              key={index}
              style={{
                opacity: p,
                transform:
                  `translateY(${(1 - p) * 15}px)`,
              }}
            >
              <BrutalCard
                yellow={piece.yellow}
                className="px-10 py-8"
              >
                <div className="text-[36px] font-semibold">
                  {piece.text}
                </div>
              </BrutalCard>
            </div>
          );
        })}

      </div>
    </Frame>
  );
};