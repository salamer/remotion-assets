import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

type Props = {
  company?: string;
  ticker?: string;
  change?: string;
  value?: string;
};

export const Ticker: React.FC<Props> = ({
  company = "AIRBNB",
  ticker = "ABNB",
  change = "+4.6%",
  value = "$92B",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      className="
        absolute
        bottom-[60px]
        left-[60px]
        flex
        border-2 border-ink
        text-[24px]
        font-semibold
      "
      style={{
        opacity: p,
        transform:
          `translateY(${(1 - p) * 25}px)`,
        boxShadow: "6px 6px 0 #111",
        fontFamily: "IBM Plex Mono",
      }}
    >
      <div className="bg-yellow px-7 py-5">
        {company}
      </div>

      <div className="bg-white px-7 py-5">
        {ticker}
      </div>

      <div className="bg-white px-7 py-5">
        ▲ {change}
      </div>

      <div className="bg-white px-7 py-5">
        {value}
      </div>
    </div>
  );
};