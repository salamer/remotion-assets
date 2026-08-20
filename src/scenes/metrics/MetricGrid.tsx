import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { BrutalCard } from "../../components/BrutalCard";
import { SceneHeader } from "../../components/SceneHeader";

type KPI = {
  icon: string;
  label: string;
  value: string;
  change?: string;
};

const data: KPI[] = [
  {
    icon: "💰",
    label: "REVENUE",
    value: "$11.1B",
    change: "+12%",
  },
  {
    icon: "📈",
    label: "NET INCOME",
    value: "$2.6B",
    change: "+18%",
  },
  {
    icon: "👤",
    label: "ACTIVE USERS",
    value: "220M",
    change: "+9%",
  },
  {
    icon: "⚙️",
    label: "MARGIN",
    value: "23%",
    change: "+3pt",
  },
];

export const MetricGrid: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <SceneHeader eyebrow="FY2025" title="The company in four numbers." />

      <div className="mt-16 grid grid-cols-2 gap-8">
        {data.map((item, index) => {
          const p = interpolate(
            frame,
            [10 + index * 6, 24 + index * 6],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          return (
            <div
              key={item.label}
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px)`,
              }}
            >
              <BrutalCard yellow={index === 0} className="p-8">
                <div className="flex justify-between">
                  <div className="text-[44px]">{item.icon}</div>

                  <div className="text-[24px] font-semibold">{item.change}</div>
                </div>

                <div className="mt-8 text-[22px] text-muted">{item.label}</div>

                <div className="mt-2 text-[72px] font-semibold tracking-[-0.06em]">
                  {item.value}
                </div>
              </BrutalCard>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
