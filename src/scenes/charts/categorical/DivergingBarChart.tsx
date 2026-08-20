import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

type Item = { label: string; value: number };
const DEFAULT: Item[] = [
  { label: "PRICE", value: 18 },
  { label: "VOLUME", value: 9 },
  { label: "FX", value: -6 },
  { label: "WAGES", value: -12 },
  { label: "MIX", value: 7 },
  { label: "TAX", value: -4 },
];
export const DivergingBarChart: React.FC<{
  eyebrow?: string;
  title?: string;
  items?: Item[];
  suffix?: string;
}> = ({
  eyebrow = "POSITIVE / NEGATIVE",
  title = "Separate tailwinds from headwinds.",
  items = DEFAULT,
  suffix = "%",
}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="relative mt-14">
        <div className="absolute left-1/2 top-0 h-full w-[3px] bg-ink" />
        <div className="space-y-6">
          {items.map((it, i) => {
            const p = stagger(frame, i, 8, 5, 18),
              w = (Math.abs(it.value) / max) * 100 * p,
              pos = it.value >= 0;
            return (
              <div
                key={it.label}
                className="grid grid-cols-[1fr_210px_1fr] items-center gap-5"
              >
                <div className="flex justify-end">
                  {!pos ? (
                    <div
                      className="h-[56px] border-2 border-ink bg-white"
                      style={{ width: `${w}%` }}
                    />
                  ) : null}
                </div>
                <div className="text-center text-[21px] font-semibold">
                  {it.label}
                  <div className="text-[17px] text-muted">
                    {it.value > 0 ? "+" : ""}
                    {it.value}
                    {suffix}
                  </div>
                </div>
                <div>
                  {pos ? (
                    <div
                      className="h-[56px] border-2 border-ink bg-yellow"
                      style={{ width: `${w}%` }}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
};
