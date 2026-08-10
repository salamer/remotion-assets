import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

const data = [
  {
    label: "REVENUE",
    value: 100,
    type: "start",
  },
  {
    label: "COGS",
    value: -25,
    type: "negative",
  },
  {
    label: "SALES",
    value: -15,
    type: "negative",
  },
  {
    label: "R&D",
    value: -12,
    type: "negative",
  },
  {
    label: "PROFIT",
    value: 48,
    type: "end",
  },
];

export const Waterfall: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader
        eyebrow="UNIT ECONOMICS"
        title="From $100 of revenue to $48 of profit."
      />

      <div className="mt-24 flex h-[550px] items-end gap-12 border-b-2 border-ink">

        {data.map((item, index) => {
          const p = interpolate(
            frame,
            [
              10 + index * 8,
              32 + index * 8,
            ],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          const h =
            Math.abs(item.value) * 4.5 * p;

          return (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center justify-end"
            >
              <div className="mb-3 text-[25px] font-semibold">
                {item.value > 0 ? "" : "−"}
                ${Math.abs(item.value)}
              </div>

              <div
                className={`
                  w-full
                  border-2 border-ink
                  ${
                    item.type === "negative"
                      ? "bg-white"
                      : "bg-yellow"
                  }
                `}
                style={{
                  height: h,
                }}
              />

              <div className="mt-4 min-h-[50px] text-center text-[19px] text-muted">
                {item.label}
              </div>
            </div>
          );
        })}

      </div>
    </Frame>
  );
};