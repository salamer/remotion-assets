import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { contrastRatio } from "../brand/contrast";
import { useBrand } from "../brand/BrandProvider";
import type { Episode, Scene, Metric } from "../program/schema";

export function useSceneMotion() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { tokens } = useBrand();
  return (delay = 0, duration = 0.65) => {
    if (tokens.motion === "none") return 1;
    const factor =
      tokens.motion === "calm" ? 1.3 : tokens.motion === "energetic" ? 0.7 : 1;
    const t = Math.max(
      0,
      Math.min(1, (frame / fps - delay) / (duration * factor)),
    );
    return 1 - Math.pow(1 - t, 3);
  };
}
export const useNarrow = () => {
  const { width, height } = useVideoConfig();
  return width / height < 1.45;
};
export function formatValue(value: number, decimals = 1, locale = "zh-CN") {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Object.is(value, -0) ? 0 : value);
}
export const signed = (value: number) =>
  `${value > 0 ? "+" : value < 0 ? "−" : ""}${formatValue(Math.abs(value), 1)}%`;

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: boolean;
}> = ({ children, style, accent }) => {
  const { tokens: t } = useBrand();
  return (
    <div
      style={{
        background: accent ? t.colors.accent : t.colors.surface,
        color: accent ? t.colors.onAccent : t.colors.foreground,
        border: `${t.shape.border}px solid ${accent ? t.colors.accent : t.colors.line}`,
        borderRadius: t.shape.radius,
        padding: 30,
        boxShadow: t.shape.shadow
          ? `5px 5px 0 ${t.colors.foreground}`
          : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const p = useSceneMotion()(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Delta: React.FC<{
  value: number;
  label?: string;
  background?: string;
}> = ({ value, label, background }) => {
  const { tokens: t } = useBrand();
  const semantic =
    value > 0
      ? t.colors.positive
      : value < 0
        ? t.colors.negative
        : t.colors.muted;
  const color =
    contrastRatio(semantic, background || t.colors.background) >= 3
      ? semantic
      : background === t.colors.accent
        ? t.colors.onAccent
        : t.colors.foreground;
  return (
    <span style={{ color, fontSize: 24, fontWeight: 600 }}>
      {value > 0 ? "↗" : value < 0 ? "↘" : "→"} {signed(value)}
      {label && (
        <span style={{ color: background ? color : t.colors.muted, fontSize: 18, marginLeft: 12 }}>
          {label}
        </span>
      )}
    </span>
  );
};
export const MetricValue: React.FC<{
  metric: Metric;
  size?: number;
  locale?: string;
  animate?: boolean;
}> = ({ metric: m, size = 100, locale, animate = true }) => {
  const p = useSceneMotion()(0.15, 1);
  const str = `${m.prefix}${formatValue(m.value * (animate ? p : 1), m.decimals, locale)}`;
  return (
    <div
      style={{
        fontSize: Math.min(size, (size * 8) / Math.max(8, str.length)),
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.055em",
        whiteSpace: "nowrap",
      }}
    >
      {str}
      <span style={{ fontSize: "0.42em", marginLeft: 10, letterSpacing: 0 }}>
        {m.suffix}
      </span>
    </div>
  );
};

export const SceneFrame: React.FC<{
  scene: Scene;
  episode: Episode;
  index: number;
  children: React.ReactNode;
  hero?: boolean;
}> = ({ scene, episode, index, children, hero = false }) => {
  const { tokens: t, brand } = useBrand();
  const narrow = useNarrow();
  const pad = t.layout.padding;
  const hasTicker = Boolean(episode.ticker?.length);
  const hasCaptions = episode.captions.length > 0;
  const refs = episode.sources.filter((s) => scene.sourceIds.includes(s.id));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        paddingBottom: pad + (hasTicker ? 64 : 0) + (hasCaptions ? 88 : 0),
        backgroundImage: t.layout.grid
          ? `linear-gradient(${t.colors.line}25 1px,transparent 1px),linear-gradient(90deg,${t.colors.line}25 1px,transparent 1px)`
          : undefined,
        backgroundSize: "60px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          borderBottom: `1px solid ${t.colors.line}`,
          paddingBottom: 22,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.08em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 16,
              height: 22,
              background: t.colors.accent,
              display: "inline-block",
            }}
          />
          {brand.name}
        </div>
        <span
          style={{
            color: t.colors.muted,
            fontSize: 16,
            letterSpacing: "0.03em",
          }}
        >
          {episode.isDemo
            ? "DEMO / 演示数据"
            : episode.locale === "zh-CN"
              ? "数据与来源见片尾"
              : "DATA & SOURCES"}{" "}
          · {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {!hero && (
        <Reveal>
          <div
            style={{
              fontSize: 19,
              color: t.colors.muted,
              letterSpacing: "0.1em",
              marginBottom: 14,
            }}
          >
            {scene.kicker || "THE BIG PICTURE"}
          </div>
          <div
            style={{
              fontSize: (narrow ? 47 : 62) * t.typography.titleScale,
              fontWeight: 700,
              lineHeight: 1.22,
              letterSpacing: "-0.035em",
              maxWidth: narrow ? "100%" : "95%",
              overflowWrap: "anywhere",
              whiteSpace: "pre-line",
            }}
          >
            {scene.title}
          </div>
          {scene.subtitle && (
            <div
              style={{
                marginTop: 18,
                fontSize: narrow ? 23 : 26,
                lineHeight: 1.45,
                color: t.colors.muted,
              }}
            >
              {scene.subtitle}
            </div>
          )}
        </Reveal>
      )}
      <div
        data-scene-body
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          color: t.colors.muted,
          fontSize: 17,
          lineHeight: 1.5,
          borderTop: `1px solid ${t.colors.line}`,
          paddingTop: 16,
        }}
      >
        {scene.lowerThird && scene.type !== "presenter" && (
          <div
            style={{
              borderLeft: `6px solid ${t.colors.accent}`,
              padding: "8px 18px",
              color: t.colors.foreground,
              display: "flex",
              alignItems: "baseline",
              gap: 20,
            }}
          >
            <strong style={{ fontSize: 25 }}>{scene.lowerThird.name}</strong>
            <span style={{ fontSize: 20 }}>{scene.lowerThird.role}</span>
          </div>
        )}
        {scene.note && (
          <div style={{ color: t.colors.foreground, fontSize: 20 }}>
            {scene.note}
          </div>
        )}
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 24 }}
        >
          <span>
            {refs.length
              ? `来源 / ${refs
                  .slice(0, 2)
                  .map((s) => s.label)
                  .join(" · ")}${refs.length > 2 ? ` +${refs.length - 2}` : ""}`
              : episode.isDemo
                ? "示例仅用于演示版式，非真实公司或市场数据"
                : "FINANCE / MOTION"}
          </span>
          <span style={{ whiteSpace: "nowrap" }}>
            {" "}
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(episode.scenes.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};
