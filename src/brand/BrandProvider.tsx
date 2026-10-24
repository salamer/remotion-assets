import React, { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { brandSchema, type Brand, type Tokens } from "./schema";
import { resolveBrand } from "./presets";

export const fontStacks = {
  sans: '"Noto Sans SC", "Helvetica Neue", Arial, sans-serif',
  serif: 'Georgia, "Noto Sans SC", serif',
  mono: '"IBM Plex Mono", "Noto Sans SC", monospace',
};
const defaultBrand = brandSchema.parse({});
const BrandContext = createContext<{ brand: Brand; tokens: Tokens }>({
  brand: defaultBrand,
  tokens: resolveBrand(defaultBrand),
});
export const useBrand = () => useContext(BrandContext);

export const BrandProvider: React.FC<{
  brand: Brand;
  children: React.ReactNode;
}> = ({ brand, children }) => {
  const tokens = resolveBrand(brand);
  const c = tokens.colors;
  const vars = {
    "--fm-paper": c.background,
    "--fm-surface": c.surface,
    "--fm-ink": c.foreground,
    "--fm-muted": c.muted,
    "--fm-accent": c.accent,
    "--fm-on-accent": c.onAccent,
    "--fm-line": c.line,
    "--fm-soft": c.line,
    "--fm-positive": c.positive,
    "--fm-negative": c.negative,
    "--fm-radius": `${tokens.shape.radius}px`,
    "--fm-font": fontStacks[tokens.typography.font],
    "--fm-shadow": tokens.shape.shadow ? `6px 6px 0 ${c.foreground}` : "none",
  } as React.CSSProperties;
  return (
    <BrandContext.Provider value={{ brand, tokens }}>
      <AbsoluteFill
        data-finance-brand={brand.preset}
        style={{
          ...vars,
          background: c.background,
          color: c.foreground,
          fontFamily: fontStacks[tokens.typography.font],
          fontVariantNumeric: "tabular-nums",
          overflow: "hidden",
        }}
      >
        {children}
      </AbsoluteFill>
    </BrandContext.Provider>
  );
};
