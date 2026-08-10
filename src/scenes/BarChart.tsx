import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {fadeUp} from "../lib/motion";

const data = [
  {year: "2020", value: 3.4},
  {year: "2021", value: 6.0},
  {year: "2022", value: 8.4},
  {year: "2023", value: 9.9},
  {year: "2024", value: 11.1},
];

const MAX = 12;

export const BarChart: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>

      <div style={fadeUp(frame, 0)}>

        <div className="
          text-[28px]
          tracking-[0.12em]
          text-muted
        ">
          AIRBNB REVENUE
        </div>

        <div className="
          mt-3
          text-[60px]
          font-semibold
        ">
          Revenue almost tripled.
        </div>

      </div>

      <div
        className="
          mt-24
          flex
          h-[560px]
          items-end
          gap-9
          border-b-2
          border-ink
          px-6
        "
      >

        {data.map((item, index) => {

          const p = interpolate(
            frame,
            [
              12 + index * 5,
              34 + index * 5,
            ],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          const height =
            (item.value / MAX) * 480 * p;

          const latest =
            index === data.length - 1;

          return (
            <div
              key={item.year}
              className="
                flex
                flex-1
                flex-col
                items-center
                justify-end
              "
            >

              <div
                className="
                  mb-4
                  text-[26px]
                  font-semibold
                "
                style={{
                  opacity: p,
                }}
              >
                ${item.value}B
              </div>

              <div
                className={`
                  w-full
                  border-2
                  border-b-0
                  border-ink

                  ${
                    latest
                      ? "bg-yellow"
                      : "bg-white"
                  }
                `}
                style={{
                  height,
                }}
              />

              <div
                className="
                  mt-4
                  text-[22px]
                "
              >
                {item.year}
              </div>

            </div>
          );
        })}

      </div>

    </Frame>
  );
};