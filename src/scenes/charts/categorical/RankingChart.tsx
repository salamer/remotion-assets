import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../../../components/Frame";
import {fadeUp} from "../../../lib/motion";

const data = [
  {
    name: "BOOKING",
    icon: "🌐",
    value: 38,
  },
  {
    name: "AIRBNB",
    icon: "🏠",
    value: 28,
  },
  {
    name: "EXPEDIA",
    icon: "✈️",
    value: 18,
  },
  {
    name: "MARRIOTT",
    icon: "🏨",
    value: 12,
  },
];

export const RankingChart: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>

      <div style={fadeUp(frame, 0)}>
        <div className="
          text-[28px]
          text-muted
        ">
          DIGITAL TRAVEL BOOKINGS
        </div>

        <div className="
          mt-3
          text-[64px]
          font-semibold
        ">
          The online travel market is concentrated.
        </div>
      </div>

      <div className="mt-20 space-y-7">

        {data.map((item, index) => {

          const p = interpolate(
            frame,
            [
              10 + index * 8,
              30 + index * 8,
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
                grid
                grid-cols-[70px_260px_1fr_110px]
                items-center
                gap-5
              "
            >

              <div className="text-[40px]">
                {item.icon}
              </div>

              <div className="
                text-[28px]
                font-semibold
              ">
                {item.name}
              </div>

              <div className="
                h-[58px]
                border-2
                border-ink
                bg-white
              ">
                <div
                  className="h-full bg-yellow"
                  style={{
                    width:
                      `${item.value * p}%`,
                  }}
                />
              </div>

              <div className="
                text-right
                text-[30px]
                font-semibold
              ">
                {Math.round(
                  item.value * p
                )}%
              </div>

            </div>
          );
        })}

      </div>

    </Frame>
  );
};