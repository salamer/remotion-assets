import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

const data = [
  {
    name: "A",
    x: 20,
    y: 35,
  },
  {
    name: "B",
    x: 45,
    y: 65,
  },
  {
    name: "C",
    x: 72,
    y: 55,
  },
  {
    name: "D",
    x: 82,
    y: 85,
  },
];

export const ScatterPlot: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader
        eyebrow="VALUATION"
        title="Growth is expensive."
      />

      <div className="relative mt-16 h-[600px] border-b-2 border-l-2 border-ink">

        <div className="absolute -left-[50px] top-[240px] -rotate-90 text-[20px] text-muted">
          VALUATION
        </div>

        <div className="absolute bottom-[-40px] left-[700px] text-[20px] text-muted">
          GROWTH →
        </div>

        {data.map((item, index) => {
          const p = interpolate(
            frame,
            [
              10 + index * 8,
              25 + index * 8,
            ],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={item.name}
              className="
                absolute
                flex h-[70px] w-[70px]
                items-center justify-center
                border-2 border-ink
                bg-yellow
                text-[22px]
                font-semibold
              "
              style={{
                left: `${item.x}%`,
                bottom: `${item.y}%`,
                opacity: p,
                transform:
                  `translate(-50%, 50%) scale(${p})`,
              }}
            >
              {item.name}
            </div>
          );
        })}

      </div>
    </Frame>
  );
};