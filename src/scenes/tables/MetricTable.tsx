import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { SceneHeader } from "../../components/SceneHeader";

const rows = [
  ["Airbnb", "$11.1B", "23%", "$92B"],
  ["Booking", "$23.7B", "31%", "$175B"],
  ["Marriott", "$25.1B", "12%", "$75B"],
  ["Hilton", "$11.7B", "18%", "$52B"],
];

const LEGACY_DEFAULT_rows = rows;

export const MetricTable: React.FC<{
  rows?: typeof LEGACY_DEFAULT_rows;
  title?: string;
  eyebrow?: string;
}> = ({
  rows = LEGACY_DEFAULT_rows,
  title = "Same market. Different economics.",
  eyebrow = "COMPETITORS",
}) => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-16 border-2 border-ink">
        <div
          className="
          grid
          grid-cols-[1.6fr_1fr_1fr_1fr]
          bg-yellow
          text-[22px]
          font-semibold
        "
        >
          {["COMPANY", "REVENUE", "MARGIN", "VALUE"].map((x) => (
            <div
              key={x}
              className="border-r-2 border-ink px-7 py-5 last:border-r-0"
            >
              {x}
            </div>
          ))}
        </div>

        {rows.map((row, index) => {
          const p = interpolate(
            frame,
            [12 + index * 8, 24 + index * 8],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={row[0]}
              className="
                grid
                grid-cols-[1.6fr_1fr_1fr_1fr]
                border-t-2 border-ink
                bg-white
                text-[25px]
              "
              style={{
                opacity: p,
              }}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`
                    border-r-2 border-ink
                    px-7 py-6
                    last:border-r-0
                    ${cellIndex === 0 ? "font-semibold" : ""}
                  `}
                >
                  {cell}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
