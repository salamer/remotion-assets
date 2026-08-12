/**
 * Geometry helpers — path smoothing, scales, extents.
 * Shared by quantitative chart scenes.
 */

export const niceMax = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / mag) * mag;
};

export const extent = (values: number[]): [number, number] => {
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return [0, 1];
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  return min === max ? [min - 1, max + 1] : [min, max];
};

export const scale = (
  value: number,
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
) => {
  const t = (value - domainMin) / Math.max(1e-9, domainMax - domainMin);
  return rangeMin + t * (rangeMax - rangeMin);
};

export const smoothPath = (points: Array<{x: number; y: number}>) => {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const mid = (a.x + b.x) / 2;
    d += ` C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
};

export const formatCompact = (value: number, suffix = "") => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1_000_000_000)
    return `${sign}${(abs / 1_000_000_000).toFixed(abs >= 10_000_000_000 ? 0 : 1)}B${suffix}`;
  if (abs >= 1_000_000)
    return `${sign}${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M${suffix}`;
  if (abs >= 1_000)
    return `${sign}${(abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K${suffix}`;
  return `${sign}${abs.toFixed(Number.isInteger(abs) ? 0 : 1)}${suffix}`;
};
