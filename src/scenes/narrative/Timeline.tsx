import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { SceneHeader } from "../../components/SceneHeader";

type Event = {
  year: string;
  title: string;
  icon?: string;
};

const events: Event[] = [
  {
    year: "2007",
    title: "Idea",
    icon: "💡",
  },
  {
    year: "2008",
    title: "Launch",
    icon: "🚀",
  },
  {
    year: "2011",
    title: "Global",
    icon: "🌍",
  },
  {
    year: "2020",
    title: "Pandemic",
    icon: "📉",
  },
  {
    year: "2024",
    title: "IPO scale",
    icon: "📈",
  },
];

export const Timeline: React.FC = () => {
  const frame = useCurrentFrame();

  const line = interpolate(frame, [15, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Frame>
      <SceneHeader
        eyebrow="AIRBNB / HISTORY"
        title="From three air mattresses to a global platform."
      />

      <div className="relative mt-44">
        <div className="absolute left-0 right-0 top-[77px] h-[4px] bg-soft">
          <div
            className="h-full bg-ink"
            style={{
              width: `${line * 100}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-5 gap-8">
          {events.map((event, index) => {
            const p = interpolate(
              frame,
              [18 + index * 8, 30 + index * 8],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return (
              <div
                key={`${event.year}-${index}`}
                className="text-center"
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px)`,
                }}
              >
                <div className="text-[52px]">{event.icon}</div>

                <div
                  className="
                    mx-auto mt-2
                    h-[28px] w-[28px]
                    border-[4px] border-ink
                    bg-yellow
                  "
                />

                <div className="mt-10 text-[28px] font-semibold">
                  {event.year}
                </div>

                <div className="mt-2 text-[22px] text-muted">{event.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
};
