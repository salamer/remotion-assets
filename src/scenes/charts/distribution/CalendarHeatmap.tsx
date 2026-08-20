import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const values = Array.from({ length: 91 }, (_, i) => (i * 17 + 11) % 100);

export const CalendarHeatmap: React.FC = () => {
  const frame = useCurrentFrame(),
    p = reveal(frame, 8, 45);
  return (
    <Frame>
      <SceneHeader
        eyebrow="ACTIVITY MAP"
        title="When does the behavior happen?"
      />
      <div className="mt-20 grid grid-cols-[120px_repeat(13,1fr)] gap-3">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].flatMap(
          (day, row) => [
            <div
              key={`${day}-label`}
              className="flex h-[54px] items-center text-[18px] text-muted"
            >
              {day}
            </div>,
            ...Array.from({ length: 13 }).map((_, col) => {
              const v = values[row * 13 + col] * p,
                hot = v > 70;
              return (
                <div
                  key={`${row}-${col}`}
                  className="h-[54px] border-2 border-ink"
                  style={{
                    background: hot
                      ? palette.yellow
                      : v > 35
                        ? palette.soft2
                        : palette.soft,
                    opacity: 0.25 + p * 0.75,
                  }}
                />
              );
            }),
          ],
        )}
      </div>
      <div className="mt-8 flex items-center justify-end gap-3 text-[18px] text-muted">
        LESS <span className="h-[22px] w-[22px] border-2 border-ink bg-soft" />
        <span className="h-[22px] w-[22px] border-2 border-ink bg-yellow" />{" "}
        MORE
      </div>
    </Frame>
  );
};
