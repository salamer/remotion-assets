import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

const split = [
  {
    label: "HOST",
    value: 82,
    className: "bg-white",
  },
  {
    label: "AIRBNB",
    value: 18,
    className: "bg-yellow",
  },
];

export const UnitEconomics: React.FC = () => {
  const frame = useCurrentFrame();

  const p = interpolate(
    frame,
    [15, 50],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Frame>
      <SceneHeader
        eyebrow="UNIT ECONOMICS"
        title="What happens to every $100 booking?"
      />

      <div className="mt-20">

        <div className="text-[120px] font-semibold tracking-[-0.07em]">
          $100
        </div>

        <div className="mt-12 flex h-[160px] border-2 border-ink">

          {split.map((item) => (
            <div
              key={item.label}
              className={`
                flex
                items-center
                justify-center
                border-r-2 border-ink
                text-[26px]
                font-semibold
                last:border-r-0
                ${item.className}
              `}
              style={{
                width:
                  `${item.value * p}%`,
              }}
            >
              {p > 0.6 && (
                <>
                  {item.label}
                  &nbsp;/&nbsp;
                  ${item.value}
                </>
              )}
            </div>
          ))}

        </div>

        <div className="mt-10 text-[27px] text-muted">
          Booking value ≠ Airbnb revenue.
        </div>

      </div>
    </Frame>
  );
};