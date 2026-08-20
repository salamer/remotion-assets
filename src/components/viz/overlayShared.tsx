/**
 * Overlay shared shell — transparent video overlays (CompareCards, PresenterOrbitOverlay).
 */
import React from "react";
import { AbsoluteFill } from "remotion";

import { colors, typography } from "../../style/theme";

export const OVERLAY_COLORS = {
  paper: colors.paper,
  ink: colors.ink,
  yellow: colors.yellow,
  muted: colors.muted,
  soft: colors.soft,
} as const;

/** @deprecated Use OVERLAY_COLORS */
export const EXPRESSIVE_COLORS = OVERLAY_COLORS;

export const OverlayShell: React.FC<{
  children: React.ReactNode;
  transparent?: boolean;
}> = ({ children, transparent = true }) => (
  <AbsoluteFill
    style={{
      background: transparent ? "transparent" : OVERLAY_COLORS.paper,
      color: OVERLAY_COLORS.ink,
      fontFamily: `"${typography.fontFamily}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`,
      overflow: "hidden",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const InlineLegend: React.FC<{
  items: Array<{ label: string; kind: "bar" | "line" }>;
}> = ({ items }) => (
  <div className="flex items-center gap-7 text-[19px] text-muted">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-3">
        {item.kind === "bar" ? (
          <span className="inline-block h-[18px] w-[18px] border-2 border-ink bg-yellow" />
        ) : (
          <span className="inline-block h-[3px] w-[34px] bg-ink" />
        )}
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);
