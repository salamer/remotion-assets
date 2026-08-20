import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

type Segment = { label: string; share: number };
type Market = { label: string; size: number; segments: Segment[] };
const DEFAULT: Market[] = [
  {
    label: "US",
    size: 48,
    segments: [
      { label: "A", share: 55 },
      { label: "B", share: 30 },
      { label: "OTHER", share: 15 },
    ],
  },
  {
    label: "EU",
    size: 28,
    segments: [
      { label: "A", share: 34 },
      { label: "B", share: 41 },
      { label: "OTHER", share: 25 },
    ],
  },
  {
    label: "ASIA",
    size: 24,
    segments: [
      { label: "A", share: 22 },
      { label: "B", share: 48 },
      { label: "OTHER", share: 30 },
    ],
  },
];

export const MarimekkoChart: React.FC<{
  eyebrow?: string;
  title?: string;
  markets?: Market[];
}> = ({
  eyebrow = "MARKET × SHARE",
  title = "Market size is width. Composition is height.",
  markets = DEFAULT,
}) => {
  const frame = useCurrentFrame();
  const total = markets.reduce((a, b) => a + b.size, 0);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-14 flex h-[600px] w-full border-2 border-ink bg-white">
        {markets.map((m, mi) => {
          const p = stagger(frame, mi, 8, 7, 20);
          return (
            <div
              key={m.label}
              className="flex h-full flex-col border-r-2 border-ink last:border-r-0"
              style={{ width: `${(m.size / total) * 100 * p}%` }}
            >
              {[...m.segments].reverse().map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-center border-b-2 border-ink last:border-b-0 ${s.label === "A" ? "bg-yellow" : s.label === "B" ? "bg-ink text-white" : "bg-soft"}`}
                  style={{ height: `${s.share}%` }}
                >
                  <span className="text-[20px] font-semibold">
                    {s.label} {s.share}%
                  </span>
                </div>
              ))}
              <div className="absolute" />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex">
        {markets.map((m) => (
          <div
            key={m.label}
            className="text-center text-[21px] font-semibold"
            style={{ width: `${(m.size / total) * 100}%` }}
          >
            {m.label} · {m.size}% OF MARKET
          </div>
        ))}
      </div>
    </Frame>
  );
};
