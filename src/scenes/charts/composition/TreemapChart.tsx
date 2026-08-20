import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

type Item = {
  label: string;
  value: number;
  icon?: string;
  highlight?: boolean;
};
const DEFAULT: Item[] = [
  { label: "Cloud", value: 36, icon: "☁️", highlight: true },
  { label: "Ads", value: 25, icon: "📣" },
  { label: "Commerce", value: 18, icon: "🛒" },
  { label: "Devices", value: 12, icon: "💻" },
  { label: "Other", value: 9, icon: "•••" },
];

// Deliberately simple slice-and-dice treemap: predictable, editable, animation-friendly.
export const TreemapChart: React.FC<{
  eyebrow?: string;
  title?: string;
  items?: Item[];
}> = ({
  eyebrow = "PARTS OF A WHOLE",
  title = "Show size as area.",
  items = DEFAULT,
}) => {
  const frame = useCurrentFrame();
  const total = items.reduce((a, b) => a + b.value, 0);
  let x = 0;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="relative mt-16 h-[610px] w-full border-2 border-ink bg-white">
        {items.map((item, i) => {
          const p = stagger(frame, i, 8, 5, 16);
          const w = (item.value / total) * 100;
          const left = x;
          x += w;
          return (
            <div
              key={item.label}
              className={`absolute top-0 h-full border-r-2 border-ink last:border-r-0 ${item.highlight ? "bg-yellow" : i % 2 ? "bg-soft" : "bg-white"}`}
              style={{
                left: `${left}%`,
                width: `${w * p}%`,
                overflow: "hidden",
              }}
            >
              <div className="flex h-full flex-col justify-between p-7">
                <div className="text-[54px]">{item.icon}</div>
                <div>
                  <div className="text-[28px] font-semibold">{item.label}</div>
                  <div className="mt-2 text-[48px] font-semibold">
                    {item.value}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
