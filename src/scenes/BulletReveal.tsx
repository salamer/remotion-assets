import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

const bullets = [
  {
    icon: "🏠",
    text: "Does not own most inventory.",
  },
  {
    icon: "💻",
    text: "Runs a software marketplace.",
  },
  {
    icon: "💰",
    text: "Takes a fee from transactions.",
  },
  {
    icon: "🌍",
    text: "Scales internationally.",
  },
];

export const BulletReveal: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader
        eyebrow="WHY IT MATTERS"
        title="Four ideas explain the entire business."
      />

      <div className="mt-16 space-y-5">

        {bullets.map((bullet, index) => {
          const p = interpolate(
            frame,
            [
              10 + index * 12,
              22 + index * 12,
            ],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={bullet.text}
              className="
                flex items-center gap-8
                border-b-2 border-ink
                py-6
              "
              style={{
                opacity: p,
                transform:
                  `translateX(${(1 - p) * 25}px)`,
              }}
            >
              <div className="text-[52px]">
                {bullet.icon}
              </div>

              <div className="text-[35px] font-semibold">
                {bullet.text}
              </div>
            </div>
          );
        })}

      </div>
    </Frame>
  );
};