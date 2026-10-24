import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { Tag } from "../../components/Tag";

export const KeyTakeaway: React.FC<{ text?: string; label?: string }> = ({
  text = "Airbnb does not need to build a hotel to add another room.",
  label = "THE KEY POINT",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Frame>
      <div className="flex h-full flex-col justify-center">
        <div
          style={{
            opacity: p,
          }}
        >
          <Tag yellow>{label}</Tag>
        </div>

        <div
          className="
            mt-12
            max-w-[1500px]
            text-[92px]
            font-semibold
            leading-[1.08]
            tracking-[-0.06em]
          "
          style={{
            opacity: p,
            transform: `translateY(${(1 - p) * 25}px)`,
          }}
        >
          {text}
        </div>
      </div>
    </Frame>
  );
};
