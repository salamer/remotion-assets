/**
 * Chart UI primitives — palette, grid, legend.
 * Scale / path math lives in lib/geometry.ts (re-exported here for convenience).
 */
import React from "react";

import {colors, typography} from "../../style/theme";

export {
  niceMax,
  extent,
  scale,
  smoothPath,
  formatCompact,
} from "../../lib/geometry";

export const VIZ = {
  paper: colors.paper,
  ink: colors.ink,
  yellow: colors.yellow,
  muted: colors.muted,
  soft: colors.soft,
  white: colors.white,
} as const;

export const FONT = `"${typography.fontFamily}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

export const GridLines: React.FC<{
  width: number;
  height: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  rows?: number;
}> = ({width, height, left = 70, right = 40, top = 30, bottom = 60, rows = 4}) => (
  <g>
    {Array.from({length: rows + 1}).map((_, i) => {
      const y = top + (i / rows) * (height - top - bottom);
      return (
        <line
          key={i}
          x1={left}
          x2={width - right}
          y1={y}
          y2={y}
          stroke={VIZ.ink}
          strokeOpacity={0.1}
          strokeWidth={2}
        />
      );
    })}
  </g>
);

export const MiniLegend: React.FC<{
  items: Array<{label: string; kind?: "line" | "bar" | "dot"; yellow?: boolean}>;
}> = ({items}) => (
  <div className="flex flex-wrap items-center gap-6 text-[18px] text-muted">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-3">
        {item.kind === "line" ? (
          <span className={`h-[4px] w-[34px] ${item.yellow ? "bg-yellow" : "bg-ink"}`} />
        ) : item.kind === "dot" ? (
          <span
            className={`h-[14px] w-[14px] border-2 border-ink ${item.yellow ? "bg-yellow" : "bg-white"}`}
          />
        ) : (
          <span
            className={`h-[18px] w-[18px] border-2 border-ink ${item.yellow ? "bg-yellow" : "bg-white"}`}
          />
        )}
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);
