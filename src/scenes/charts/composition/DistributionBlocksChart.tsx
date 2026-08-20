import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { springIn, tween } from "../../../lib/motion";

type DistributionGroup = {
  label: string;
  value: number;
  people: number;
  blocks: number;
  accent?: boolean;
};

const DEFAULT_GROUPS: DistributionGroup[] = [
  { label: "BOTTOM 50%", value: 8, people: 5, blocks: 4 },
  { label: "MIDDLE 40%", value: 30, people: 4, blocks: 13 },
  { label: "TOP 10%", value: 62, people: 1, blocks: 28, accent: true },
];

const MoneyBlock: React.FC<{
  index: number;
  total: number;
  p: number;
  accent?: boolean;
}> = ({ index, total, p, accent }) => {
  const cols = Math.max(2, Math.ceil(Math.sqrt(total * 1.4)));
  const row = Math.floor(index / cols);
  const col = index % cols;

  return (
    <div
      className={`absolute h-[24px] w-[44px] border-2 border-ink ${accent ? "bg-yellow" : "bg-white"}`}
      style={{
        left: col * 47,
        bottom: row * 27,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) scale(${0.88 + p * 0.12})`,
      }}
    >
      <div className="flex h-full items-center justify-center text-[12px] font-semibold">
        $
      </div>
    </div>
  );
};

export const DistributionBlocksChart: React.FC<{
  eyebrow?: string;
  title?: string;
  groups?: DistributionGroup[];
  unit?: string;
  source?: string;
}> = ({
  eyebrow = "DISTRIBUTION",
  title = "The same population can own very different shares.",
  groups = DEFAULT_GROUPS,
  unit = "%",
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spectrumP = tween(frame, 4, 30);

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-10 grid grid-cols-3 gap-8">
        {groups.map((group, index) => {
          const p = springIn({
            frame,
            fps,
            delay: 10 + index * 7,
            damping: 18,
            stiffness: 145,
          });
          return (
            <div
              key={group.label}
              className="text-center"
              style={{ opacity: p }}
            >
              <div className="h-[54px] whitespace-nowrap text-[39px] tracking-[8px]">
                {Array.from({ length: group.people }).map((_, i) => (
                  <span key={i}>👤</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-5 flex h-[72px] overflow-hidden border-2 border-ink bg-white">
        <div
          className="absolute inset-y-0 left-0 bg-ink"
          style={{ width: `${33.33 * spectrumP}%` }}
        />
        <div
          className="absolute inset-y-0 left-1/3 bg-soft"
          style={{ width: `${33.33 * spectrumP}%` }}
        />
        <div
          className="absolute inset-y-0 left-2/3 bg-yellow"
          style={{ width: `${33.34 * spectrumP}%` }}
        />
        <div className="absolute inset-0 grid grid-cols-3 items-center text-center text-[22px] font-semibold mix-blend-difference text-white">
          {groups.map((group) => (
            <div key={group.label}>{group.label}</div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-8">
        {groups.map((group, index) => {
          const p = springIn({
            frame,
            fps,
            delay: 22 + index * 8,
            damping: 18,
            stiffness: 145,
          });
          const value = interpolate(p, [0, 1], [0, group.value]);

          return (
            <div
              key={group.label}
              className={`relative h-[500px] border-r-2 border-dashed border-ink/20 ${
                index === groups.length - 1 ? "border-r-0" : ""
              }`}
            >
              <div className="text-center text-[82px] font-semibold tracking-[-0.07em]">
                {value.toFixed(group.value % 1 === 0 ? 0 : 1)}
                <span className="text-[42px]">{unit}</span>
              </div>

              <div className="relative mx-auto mt-9 h-[320px] w-[300px]">
                {Array.from({ length: group.blocks }).map((_, i) => {
                  const bp = tween(frame, 34 + index * 8 + i * 0.8, 8);
                  return (
                    <MoneyBlock
                      key={i}
                      index={i}
                      total={group.blocks}
                      p={bp}
                      accent={group.accent}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
