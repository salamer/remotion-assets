import React from "react";
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {Frame} from "../../components/Frame";
import {SceneHeader} from "../../components/SceneHeader";
import {Source} from "../../components/Source";
import {springIn, tween} from "../../lib/motion";

type ComparisonRow = {
  name: string;
  left: number;
  right: number;
  icon?: string;
};

const DEFAULT_ROWS: ComparisonRow[] = [
  {name: "MARKET A", left: 6.2, right: 61.8, icon: "🏠"},
  {name: "MARKET B", left: 2.1, right: 69.4, icon: "🏦"},
  {name: "MARKET C", left: 0.8, right: 77.2, icon: "🏭"},
  {name: "MARKET D", left: -0.4, right: 81.5, icon: "💻"},
  {name: "MARKET E", left: -1.8, right: 86.1, icon: "🌍"},
];

export const DistributionComparisonTable: React.FC<{
  eyebrow?: string;
  title?: string;
  rows?: ComparisonRow[];
  leftLabel?: string;
  middleLabel?: string;
  rightLabel?: string;
  leftUnit?: string;
  rightUnit?: string;
  source?: string;
}> = ({
  eyebrow = "COMPARISON",
  title = "Put both ends of the distribution in the same table.",
  rows = DEFAULT_ROWS,
  leftLabel = "LOW END",
  middleLabel = "ENTITY",
  rightLabel = "HIGH END",
  leftUnit = "%",
  rightUnit = "%",
  source,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const headerP = tween(frame, 3, 24);

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-10">
        <div className="grid grid-cols-3 text-center text-[35px] tracking-[7px]">
          <div>👤👤👤👤👤</div>
          <div>👤👤👤👤</div>
          <div>👤</div>
        </div>

        <div
          className="mt-5 grid h-[76px] grid-cols-3 items-center border-2 border-ink text-center text-[22px] font-semibold"
          style={{opacity: headerP}}
        >
          <div className="flex h-full items-center justify-center bg-ink text-white">{leftLabel}</div>
          <div className="flex h-full items-center justify-center bg-soft">{middleLabel}</div>
          <div className="flex h-full items-center justify-center bg-yellow">{rightLabel}</div>
        </div>

        <div className="border-x-2 border-b-2 border-ink bg-white">
          {rows.map((row, index) => {
            const p = springIn({frame, fps, delay: 14 + index * 7, damping: 19, stiffness: 150});
            const leftValue = interpolate(p, [0, 1], [0, row.left]);
            const rightValue = interpolate(p, [0, 1], [0, row.right]);

            return (
              <div
                key={row.name}
                className={`grid h-[103px] grid-cols-3 items-center text-[30px] ${
                  index < rows.length - 1 ? "border-b-2 border-dashed border-ink/20" : ""
                }`}
                style={{opacity: p, transform: `translateX(${(1 - p) * 24}px)`}}
              >
                <div className="pl-14 font-semibold">
                  {leftValue.toFixed(1)}{leftUnit}
                </div>
                <div className="flex items-center justify-center gap-5 font-semibold">
                  <span className="text-[34px]">{row.icon}</span>
                  <span>{row.name}</span>
                </div>
                <div className="pr-14 text-right font-semibold">
                  {rightValue.toFixed(1)}{rightUnit}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
