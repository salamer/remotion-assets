import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { stagger } from "../../../lib/chartMotion";
import { extent, scale, VIZ } from "../../../components/viz/chartPrimitives";

type Row = { label: string; start: number; end: number; highlight?: boolean };
const DEFAULT: Row[] = [
  { label: "Company A", start: 18, end: 39, highlight: true },
  { label: "Company B", start: 31, end: 35 },
  { label: "Company C", start: 27, end: 22 },
  { label: "Company D", start: 12, end: 25 },
];

export const SlopeChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Row[];
  startLabel?: string;
  endLabel?: string;
  suffix?: string;
  source?: string;
}> = ({
  eyebrow = "RANK & DIRECTION",
  title = "Who moved, and by how much?",
  data = DEFAULT,
  startLabel = "2020",
  endLabel = "2025",
  suffix = "%",
  source,
}) => {
  const frame = useCurrentFrame();
  const [min0, max0] = extent(data.flatMap((d) => [d.start, d.end]));
  const pad = Math.max(1, (max0 - min0) * 0.12);
  const min = min0 - pad,
    max = max0 + pad;
  const top = 45,
    bottom = 510;
  const y = (v: number) => scale(v, min, max, bottom, top);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-14 flex justify-center gap-[420px] text-[22px] font-semibold">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
      <svg width={1650} height={580} className="mt-2">
        <line
          x1={410}
          x2={410}
          y1={20}
          y2={540}
          stroke={VIZ.ink}
          strokeOpacity={0.18}
          strokeWidth={2}
        />
        <line
          x1={1240}
          x2={1240}
          y1={20}
          y2={540}
          stroke={VIZ.ink}
          strokeOpacity={0.18}
          strokeWidth={2}
        />
        {data.map((d, i) => {
          const p = stagger(frame, i, 8, 6, 20);
          const y1 = y(d.start),
            y2 = y(d.end);
          const stroke = d.highlight ? VIZ.yellow : VIZ.ink;
          return (
            <g key={d.label} opacity={p}>
              <line
                x1={410}
                x2={410 + (1240 - 410) * p}
                y1={y1}
                y2={y1 + (y2 - y1) * p}
                stroke={stroke}
                strokeWidth={d.highlight ? 9 : 4}
              />
              <rect
                x={399}
                y={y1 - 11}
                width={22}
                height={22}
                fill={d.highlight ? VIZ.yellow : VIZ.white}
                stroke={VIZ.ink}
                strokeWidth={2}
              />
              <rect
                x={1229}
                y={y2 - 11}
                width={22}
                height={22}
                fill={d.highlight ? VIZ.yellow : VIZ.white}
                stroke={VIZ.ink}
                strokeWidth={2}
              />
              <text
                x={382}
                y={y1 + 7}
                textAnchor="end"
                fontFamily="IBM Plex Mono"
                fontSize={20}
                fill={VIZ.ink}
              >
                {d.label} {d.start}
                {suffix}
              </text>
              <text
                x={1268}
                y={y2 + 7}
                textAnchor="start"
                fontFamily="IBM Plex Mono"
                fontSize={20}
                fill={VIZ.ink}
              >
                {d.end}
                {suffix} {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {source ? <Source>{source}</Source> : null}
    </Frame>
  );
};
