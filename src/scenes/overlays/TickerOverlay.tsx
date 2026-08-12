import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {shadows, spacing, typography} from "../../style/theme";

type Props = {
  company?: string;
  ticker?: string;
  change?: string;
  value?: string;
};

export const TickerOverlay: React.FC<Props> = ({
  company = "AIRBNB",
  ticker = "ABNB",
  change = "+4.6%",
  value = "$92B",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="
        absolute
        flex
        border-2 border-ink
        text-[24px]
        font-semibold
      "
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 25}px)`,
        boxShadow: shadows.brutal,
        fontFamily: typography.fontFamily,
        bottom: spacing.tickerBottom,
        left: spacing.tickerLeft,
      }}
    >
      <div className="bg-yellow px-7 py-5">{company}</div>

      <div className="bg-white px-7 py-5">{ticker}</div>

      <div className="bg-white px-7 py-5">▲ {change}</div>

      <div className="bg-white px-7 py-5">{value}</div>
    </div>
  );
};
