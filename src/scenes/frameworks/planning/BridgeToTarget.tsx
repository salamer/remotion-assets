import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const steps = [
  { label: "TODAY", delta: 100, total: true },
  { label: "PRICE", delta: 18, total: false },
  { label: "VOLUME", delta: 12, total: false },
  { label: "MIX", delta: 7, total: false },
  { label: "COST", delta: -9, total: false },
  { label: "TARGET", delta: 128, total: true },
];

const LEGACY_DEFAULT_steps = steps;

export const BridgeToTarget: React.FC<{
  steps?: typeof LEGACY_DEFAULT_steps;
  title?: string;
  eyebrow?: string;
}> = ({
  steps = LEGACY_DEFAULT_steps,
  title = "What must happen to get from here to there?",
  eyebrow = "BRIDGE TO TARGET",
}) => {
  const frame = useCurrentFrame();
  let running = 0;
  const calc = steps.map((s) => {
    if (s.total) {
      running = s.delta;
      return { ...s, start: 0, end: s.delta };
    }
    const start = running;
    running += s.delta;
    return { ...s, start, end: running };
  });
  const max = Math.max(1, ...calc.flatMap((s) => [s.start, s.end])) * 1.1;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-16 flex h-[600px] items-end gap-9 border-b-2 border-ink px-5">
        {calc.map((s, i) => {
          const p = reveal(frame, 8 + i * 7, 18),
            top = Math.max(s.start, s.end),
            bottom = Math.min(s.start, s.end),
            h = ((top - bottom) / max) * 520 * p,
            y = (bottom / max) * 520,
            positive = s.end >= s.start;
          return (
            <div key={s.label} className="relative h-[560px] flex-1">
              <div
                className="absolute left-0 right-0 text-center text-[22px] font-semibold"
                style={{ bottom: y + h + 10, opacity: p }}
              >
                {s.total ? s.end : (s.delta > 0 ? "+" : "") + s.delta}
              </div>
              <div
                className="absolute left-0 right-0 border-2 border-ink"
                style={{
                  bottom: y,
                  height: Math.max(8, h),
                  background:
                    s.total || positive ? palette.yellow : palette.white,
                  opacity: p,
                }}
              />
              <div className="absolute bottom-[-50px] left-0 right-0 text-center text-[18px] text-muted">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
