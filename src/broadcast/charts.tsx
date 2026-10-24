import React, { useId } from "react";
import { useBrand } from "../brand/BrandProvider";
import type { SceneOf } from "../program/schema";
import { useNarrow, useSceneMotion, formatValue } from "./primitives";

export const domain = (values: number[], zero = false): [number, number] => {
  let min = Math.min(...values),
    max = Math.max(...values);
  if (zero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1;
    min -= pad;
    max += pad;
  }
  return [min, max];
};
export const map = (
  v: number,
  min: number,
  max: number,
  a: number,
  b: number,
) => a + ((v - min) / (max - min)) * (b - a);
export function waterfallSteps(data: SceneOf<"waterfall">["data"]) {
  let running = 0;
  return data.map((d) => {
    const start = d.kind === "total" ? 0 : running;
    const end = d.kind === "total" ? d.value : running + d.value;
    running = end;
    return { ...d, start, end };
  });
}

export const Bars: React.FC<{
  scene: SceneOf<"bars"> | SceneOf<"ranking">;
}> = ({ scene: s }) => {
  const { tokens: t } = useBrand();
  const narrow = useNarrow();
  const progress = useSceneMotion();
  const data =
    s.type === "ranking"
      ? [...s.data].sort((a, b) => b.value - a.value)
      : s.data;
  const horizontal =
    s.type === "ranking" || s.orientation === "horizontal" || narrow;
  const W = narrow ? 880 : 1700,
    H = narrow ? 660 : 480;
  const [min, max] = domain(
    data.map((d) => d.value),
    true,
  );
  const c = t.colors;
  if (horizontal) {
    const left = narrow ? 190 : 300,
      right = 140,
      top = 35,
      bottom = 45,
      step = (H - top - bottom) / data.length;
    const x = (v: number) => map(v, min, max, left, W - right);
    const zero = x(0);
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxHeight: "100%", overflow: "visible" }}
        role="img"
        aria-label={s.title}
      >
        <text
          x={W - right}
          y={12}
          textAnchor="end"
          fill={c.muted}
          fontSize={18}
        >
          {s.unit}
        </text>
        <line
          x1={zero}
          x2={zero}
          y1={top - 5}
          y2={H - bottom + 5}
          stroke={c.line}
        />
        {data.map((d, i) => {
          const p = progress(i * 0.07);
          const end = x(d.value * p);
          const y = top + i * step;
          const fill =
            d.value < 0
              ? c.negative
              : d.highlight
                ? c.accent
                : c.series[i % c.series.length];
          return (
            <g key={i}>
              <text
                x={left - 20}
                y={y + step / 2 + 7}
                textAnchor="end"
                fontSize={Math.min(26, step * 0.38)}
                fill={c.foreground}
              >
                {d.label}
              </text>
              <rect
                x={Math.min(zero, end)}
                y={y + step * 0.19}
                width={Math.abs(end - zero)}
                height={step * 0.62}
                rx={Math.min(t.shape.radius, 8)}
                fill={fill}
              />
              <text
                x={end + (d.value < 0 ? -12 : 12)}
                y={y + step / 2 + 7}
                textAnchor={d.value < 0 ? "end" : "start"}
                fill={c.foreground}
                fontSize={24}
                fontWeight={600}
              >
                {formatValue(d.value, Number.isInteger(d.value) ? 0 : 1)}
              </text>
            </g>
          );
        })}
        {[min, max].map((v, i) => (
          <text
            key={i}
            x={x(v)}
            y={H - 5}
            fill={c.muted}
            textAnchor="middle"
            fontSize={18}
          >
            {formatValue(v, 0)}
          </text>
        ))}
      </svg>
    );
  }
  const left = 100,
    right = 45,
    top = 48,
    bottom = 65;
  const y = (v: number) => map(v, min, max, H - bottom, top);
  const zero = y(0),
    step = (W - left - right) / data.length;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxHeight: "100%" }}
      role="img"
      aria-label={s.title}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const v = min + ((max - min) * i) / 4;
        return (
          <g key={i}>
            <line
              x1={left}
              x2={W - right}
              y1={y(v)}
              y2={y(v)}
              stroke={c.line}
            />
            <text
              x={left - 14}
              y={y(v) + 7}
              textAnchor="end"
              fill={c.muted}
              fontSize={18}
            >
              {formatValue(v, 0)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const end = y(d.value * progress(i * 0.07));
        return (
          <g key={i}>
            <rect
              x={left + i * step + step * 0.18}
              y={Math.min(end, zero)}
              width={step * 0.64}
              height={Math.abs(end - zero)}
              rx={Math.min(t.shape.radius, 8)}
              fill={
                d.value < 0
                  ? c.negative
                  : d.highlight
                    ? c.accent
                    : c.series[i % c.series.length]
              }
            />
            <text
              x={left + (i + 0.5) * step}
              y={end + (d.value < 0 ? 28 : -14)}
              textAnchor="middle"
              fill={c.foreground}
              fontSize={24}
              fontWeight={600}
            >
              {formatValue(d.value, 1)}
            </text>
            <text
              x={left + (i + 0.5) * step}
              y={H - 22}
              textAnchor="middle"
              fill={c.muted}
              fontSize={22}
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <text x={left} y={18} fontSize={18} fill={c.muted}>
        {s.unit}
      </text>
    </svg>
  );
};

export const Trend: React.FC<{ scene: SceneOf<"trend"> }> = ({ scene: s }) => {
  const { tokens: t } = useBrand();
  const narrow = useNarrow();
  const p = useSceneMotion()(0.1, 1.3);
  const clip = useId().replace(/:/g, "");
  const W = narrow ? 880 : 1700,
    H = narrow ? 700 : 470,
    L = 100,
    R = 65,
    T = 40,
    B = 70;
  const values = s.series.flatMap((x) =>
    x.values.filter((v): v is number => v !== null),
  );
  const [lo, hi] = domain(values, s.zeroBaseline);
  const pad = (hi - lo) * 0.12;
  const min = s.zeroBaseline && lo === 0 ? 0 : lo - pad,
    max = hi + pad;
  const x = (i: number) => L + (i / (s.labels.length - 1)) * (W - L - R),
    y = (v: number) => map(v, min, max, H - B, T);
  const c = t.colors;
  const stride = Math.max(1, Math.ceil(s.labels.length / (narrow ? 5 : 9)));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        gap: 22,
      }}
    >
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 22 }}>
        {s.series.map((a, i) => (
          <span key={i}>
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 5,
                background: c.series[i],
                verticalAlign: "middle",
                marginRight: 10,
              }}
            />
            {a.name}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxHeight: "85%" }}
        role="img"
        aria-label={s.title}
      >
        <defs>
          <clipPath id={clip}>
            <rect x={L - 10} y={0} width={(W - L - R + 20) * p} height={H} />
          </clipPath>
        </defs>
        {s.forecastFrom !== undefined && (
          <g>
            <rect
              x={x(s.forecastFrom)}
              y={T}
              width={W - R - x(s.forecastFrom)}
              height={H - T - B}
              fill={c.accent}
              opacity={0.09}
            />
            <text
              x={x(s.forecastFrom) + 8}
              y={T + 24}
              fontSize={18}
              fill={c.muted}
            >
              预测 / FORECAST
            </text>
          </g>
        )}
        {[0, 1, 2, 3, 4].map((i) => {
          const v = min + ((max - min) * i) / 4;
          return (
            <g key={i}>
              <line
                x1={L}
                x2={W - R}
                y1={y(v)}
                y2={y(v)}
                stroke={c.line}
                strokeDasharray="4 6"
              />
              <text
                x={L - 16}
                y={y(v) + 6}
                textAnchor="end"
                fill={c.muted}
                fontSize={19}
              >
                {formatValue(v, Math.abs(max) < 10 ? 1 : 0)}
              </text>
            </g>
          );
        })}
        <g clipPath={`url(#${clip})`}>
          {s.series.map((a, si) => (
            <g key={si}>
              {a.values.map((v, i) => {
                const prev = a.values[i - 1];
                return v !== null && prev !== null && prev !== undefined ? (
                  <line
                    key={i}
                    x1={x(i - 1)}
                    y1={y(prev)}
                    x2={x(i)}
                    y2={y(v)}
                    stroke={c.series[si]}
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray={
                      s.forecastFrom !== undefined && i >= s.forecastFrom
                        ? "12 8"
                        : undefined
                    }
                  />
                ) : null;
              })}
              {a.values.map(
                (v, i) =>
                  v !== null && (
                    <circle
                      key={i}
                      cx={x(i)}
                      cy={y(v)}
                      r={s.labels.length > 30 ? 2 : 5}
                      fill={c.surface}
                      stroke={c.series[si]}
                      strokeWidth={3}
                    />
                  ),
              )}
            </g>
          ))}
        </g>
        {s.labels.map(
          (v, i) =>
            (i % stride === 0 || i === s.labels.length - 1) && (
              <text
                key={i}
                x={x(i)}
                y={H - 18}
                textAnchor="middle"
                fill={c.muted}
                fontSize={20}
              >
                {v}
              </text>
            ),
        )}
        <text x={L} y={20} fill={c.muted} fontSize={18}>
          {s.unit}
          {!s.zeroBaseline ? " · 非零起点" : ""}
        </text>
      </svg>
    </div>
  );
};

export const Waterfall: React.FC<{ scene: SceneOf<"waterfall"> }> = ({
  scene: s,
}) => {
  const { tokens: t } = useBrand();
  const narrow = useNarrow();
  const progress = useSceneMotion();
  const data = waterfallSteps(s.data);
  const W = narrow ? 900 : 1700,
    H = narrow ? 720 : 490,
    L = 85,
    R = 30,
    T = 45,
    B = 90;
  const [min, max] = domain(
    data.flatMap((d) => [d.start, d.end]),
    true,
  );
  const y = (v: number) => map(v, min, max, H - B, T),
    step = (W - L - R) / data.length;
  const c = t.colors;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxHeight: "100%" }}
      role="img"
      aria-label={s.title}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const v = min + ((max - min) * i) / 4;
        return (
          <g key={i}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={c.line} />
            <text
              x={L - 12}
              y={y(v) + 6}
              fill={c.muted}
              textAnchor="end"
              fontSize={18}
            >
              {formatValue(v, 0)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const start = y(d.start),
          end = y(d.start + (d.end - d.start) * progress(i * 0.08));
        return (
          <g key={i}>
            {i < data.length - 1 && (
              <line
                x1={L + (i + 0.8) * step}
                x2={L + (i + 1.2) * step}
                y1={y(d.end)}
                y2={y(d.end)}
                stroke={c.muted}
                strokeDasharray="6 5"
              />
            )}
            <rect
              x={L + (i + 0.2) * step}
              y={Math.min(start, end)}
              width={step * 0.6}
              height={Math.max(1, Math.abs(start - end))}
              fill={
                d.kind === "total"
                  ? c.accent
                  : d.value < 0
                    ? c.negative
                    : c.positive
              }
            />
            <text
              x={L + (i + 0.5) * step}
              y={Math.min(start, end) - 14}
              fill={c.foreground}
              textAnchor="middle"
              fontSize={narrow ? 23 : 27}
            >
              {d.kind === "delta" && d.value > 0 ? "+" : ""}
              {formatValue(d.value, Number.isInteger(d.value) ? 0 : 1)}
            </text>
            <text
              x={L + (i + 0.5) * step}
              y={H - 40}
              fill={c.muted}
              textAnchor="middle"
              fontSize={narrow ? 20 : 23}
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <text x={L} y={20} fill={c.muted} fontSize={18}>
        {s.unit}
      </text>
    </svg>
  );
};

export const Donut: React.FC<{ scene: SceneOf<"donut"> }> = ({ scene: s }) => {
  const { tokens: t } = useBrand();
  const narrow = useNarrow();
  const p = useSceneMotion()(0.1, 1.2);
  const total = s.data.reduce((n, d) => n + d.value, 0);
  const C = 2 * Math.PI * 174;
  let offset = 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: narrow ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-around",
        gap: 28,
        height: "100%",
      }}
    >
      <svg
        viewBox="0 0 460 460"
        style={{
          width: narrow ? "70%" : "43%",
          maxHeight: narrow ? "55%" : "100%",
        }}
        role="img"
        aria-label={s.title}
      >
        <circle
          cx={230}
          cy={230}
          r={174}
          fill="none"
          stroke={t.colors.line}
          strokeWidth={48}
        />
        {s.data.map((d, i) => {
          const start = offset;
          const length = (d.value / total) * C;
          offset += length;
          return (
            <circle
              key={i}
              cx={230}
              cy={230}
              r={174}
              fill="none"
              stroke={t.colors.series[i % t.colors.series.length]}
              strokeWidth={48}
              strokeDasharray={`${length * p} ${C - length * p}`}
              strokeDashoffset={-start}
              transform="rotate(-90 230 230)"
            />
          );
        })}
        <text
          x={230}
          y={222}
          textAnchor="middle"
          fill={t.colors.foreground}
          fontSize={49}
          fontWeight={700}
        >
          {formatValue(total, Number.isInteger(total) ? 0 : 1)}
        </text>
        <text
          x={230}
          y={263}
          textAnchor="middle"
          fill={t.colors.muted}
          fontSize={21}
        >
          {s.centerLabel} {s.unit}
        </text>
      </svg>
      <div
        style={{
          width: narrow ? "100%" : "45%",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {s.data.map((d, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "22px 1fr auto",
              alignItems: "center",
              gap: 16,
              fontSize: 26,
              paddingBottom: 15,
              borderBottom: `1px solid ${t.colors.line}`,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                background: t.colors.series[i % t.colors.series.length],
              }}
            />
            <span>{d.label}</span>
            <span style={{ fontWeight: 600 }}>
              {formatValue((d.value / total) * 100, 1)}%{" "}
              <span
                style={{ fontSize: 20, color: t.colors.muted, marginLeft: 14 }}
              >
                {formatValue(d.value, 1)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
