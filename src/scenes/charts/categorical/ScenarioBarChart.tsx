import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";
import { niceMax } from "../../../components/viz/chartPrimitives";

type Scenario = {
  label: string;
  value: number;
  probability?: number;
  icon?: string;
  highlight?: boolean;
};
const DEFAULT: Scenario[] = [
  { label: "BEAR", value: 78, probability: 20, icon: "🐻" },
  { label: "BASE", value: 112, probability: 55, icon: "●", highlight: true },
  { label: "BULL", value: 154, probability: 25, icon: "🐂" },
];
export const ScenarioBarChart: React.FC<{
  eyebrow?: string;
  title?: string;
  scenarios?: Scenario[];
  prefix?: string;
}> = ({
  eyebrow = "SCENARIOS",
  title = "Put bear, base and bull cases on the same scale.",
  scenarios = DEFAULT,
  prefix = "$",
}) => {
  const frame = useCurrentFrame(),
    max = niceMax(Math.max(...scenarios.map((s) => s.value)) * 1.1);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-20 flex h-[570px] items-end justify-center gap-24 border-b-2 border-ink">
        {scenarios.map((s, i) => {
          const p = stagger(frame, i, 8, 8, 20),
            h = (s.value / max) * 480 * p;
          return (
            <div
              key={s.label}
              className="flex w-[300px] flex-col items-center justify-end"
            >
              <div className="mb-4 text-[54px]">{s.icon}</div>
              <div className="mb-3 text-[32px] font-semibold">
                {prefix}
                {s.value}
              </div>
              <div
                className={`w-full border-2 border-b-0 border-ink ${s.highlight ? "bg-yellow" : "bg-white"}`}
                style={{ height: h }}
              />
              <div className="mt-4 text-[22px] font-semibold">{s.label}</div>
              {s.probability !== undefined ? (
                <div className="mt-1 text-[18px] text-muted">
                  {s.probability}% probability
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
