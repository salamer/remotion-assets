import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";
import { smoothPath, VIZ } from "../../../components/viz/chartPrimitives";

type Panel = {
  title: string;
  icon?: string;
  values: number[];
  highlight?: boolean;
};
const DEFAULT: Panel[] = [
  { title: "US", icon: "🇺🇸", values: [22, 24, 29, 35, 41], highlight: true },
  { title: "EU", icon: "🇪🇺", values: [19, 20, 22, 23, 24] },
  { title: "JAPAN", icon: "🇯🇵", values: [18, 17, 18, 20, 23] },
  { title: "KOREA", icon: "🇰🇷", values: [16, 18, 21, 23, 28] },
];

export const SmallMultiples: React.FC<{
  eyebrow?: string;
  title?: string;
  panels?: Panel[];
}> = ({
  eyebrow = "SMALL MULTIPLES",
  title = "Same scale. Different trajectories.",
  panels = DEFAULT,
}) => {
  const frame = useCurrentFrame();
  const all = panels.flatMap((p) => p.values);
  const min = Math.min(...all),
    max = Math.max(...all);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-14 grid grid-cols-2 gap-8">
        {panels.map((panel, i) => {
          const p = stagger(frame, i, 6, 5, 16);
          const w = 760,
            h = 250,
            pad = 28;
          const pts = panel.values.map((v, j) => ({
            x: pad + (j / Math.max(1, panel.values.length - 1)) * (w - pad * 2),
            y:
              h - pad - ((v - min) / Math.max(1e-9, max - min)) * (h - pad * 2),
          }));
          return (
            <div
              key={panel.title}
              className={`border-2 border-ink p-6 ${panel.highlight ? "bg-yellow" : "bg-white"}`}
              style={{ opacity: p, boxShadow: "5px 5px 0 var(--fm-ink, #111)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[26px] font-semibold">
                  {panel.icon} {panel.title}
                </span>
                <span className="text-[22px]">{panel.values.at(-1)}</span>
              </div>
              <svg width={w} height={h} className="mt-2">
                {[0.33, 0.66].map((r) => (
                  <line
                    key={r}
                    x1={pad}
                    x2={w - pad}
                    y1={h * r}
                    y2={h * r}
                    stroke={VIZ.ink}
                    strokeOpacity={0.12}
                    strokeWidth={2}
                  />
                ))}
                <path
                  d={smoothPath(pts)}
                  fill="none"
                  stroke={VIZ.ink}
                  strokeWidth={7}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
                {pts.map((pt, j) => (
                  <rect
                    key={j}
                    x={pt.x - 6}
                    y={pt.y - 6}
                    width={12}
                    height={12}
                    fill={j === pts.length - 1 ? VIZ.ink : VIZ.white}
                    stroke={VIZ.ink}
                    strokeWidth={2}
                    opacity={p}
                  />
                ))}
              </svg>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
