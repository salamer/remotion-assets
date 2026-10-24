import { episodeSchema, type Episode } from "./schema";
import { durationInFrames } from "./timeline";
import { validateLegacy } from "./legacy-validation";

export type Issue = {
  path: string;
  message: string;
  level: "error" | "warning";
};
export function validateEpisode(
  input: unknown,
  legacyIds?: ReadonlySet<string>,
): { episode?: Episode; issues: Issue[] } {
  const parsed = episodeSchema.safeParse(input);
  if (!parsed.success)
    return {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
        level: "error",
      })),
    };
  const e = parsed.data;
  const issues: Issue[] = [];
  const issue = (
    path: string,
    message: string,
    level: Issue["level"] = "error",
  ) => issues.push({ path, message, level });
  const sources = new Set<string>();
  e.sources.forEach((s, i) => {
    if (sources.has(s.id)) issue(`sources.${i}.id`, "Duplicate source ID");
    sources.add(s.id);
    if (
      s.date &&
      (!Number.isFinite(Date.parse(s.date)) ||
        new Date(s.date).toISOString().slice(0, 10) !== s.date)
    )
      issue(`sources.${i}.date`, "Invalid calendar date");
  });
  const ids = new Set<string>();
  const dataTypes = new Set([
    "hero",
    "kpis",
    "bars",
    "ranking",
    "trend",
    "waterfall",
    "donut",
    "table",
    "earnings",
    "scenario",
    "quote",
    "headline",
    "news-grid",
    "legacy",
  ]);
  e.scenes.forEach((s, i) => {
    const p = `scenes.${i}`;
    if (ids.has(s.id)) issue(`${p}.id`, "Duplicate scene ID");
    ids.add(s.id);
    for (const id of s.sourceIds)
      if (!sources.has(id)) issue(`${p}.sourceIds`, `Unknown source: ${id}`);
    if (!e.isDemo && dataTypes.has(s.type) && s.sourceIds.length === 0)
      issue(`${p}.sourceIds`, "A published data/quote scene requires a source");
    if (s.type === "trend") {
      s.series.forEach((r, j) => {
        if (r.values.length !== s.labels.length)
          issue(
            `${p}.series.${j}.values`,
            "Series and labels must have the same length",
          );
        if (r.values.every((v) => v === null))
          issue(
            `${p}.series.${j}.values`,
            "A series needs at least one observed value",
          );
      });
      if (s.forecastFrom !== undefined && s.forecastFrom >= s.labels.length)
        issue(`${p}.forecastFrom`, "Forecast must begin inside labels");
    }
    if (s.type === "donut" && s.data.reduce((n, r) => n + r.value, 0) <= 0)
      issue(`${p}.data`, "Composition total must be positive");
    if (s.type === "waterfall") {
      if (s.data[0].kind !== "total")
        issue(`${p}.data.0.kind`, "Waterfall must start with a total");
      let running = s.data[0].value;
      s.data.slice(1).forEach((d, j) => {
        if (d.kind === "delta") running += d.value;
        else if (
          Math.abs(d.value - running) >
          Math.max(1, Math.abs(running)) * 1e-6
        )
          issue(
            `${p}.data.${j + 1}.value`,
            `Total ${d.value} does not reconcile to ${running}`,
          );
      });
    }
    if (s.type === "table") {
      s.rows.forEach((r, j) => {
        if (r.length !== s.columns.length)
          issue(`${p}.rows.${j}`, "Row length must match columns");
      });
      if (s.highlightRow !== undefined && s.highlightRow >= s.rows.length)
        issue(`${p}.highlightRow`, "Row index out of range");
      if (e.format === "portrait" && s.columns.length > 3)
        issue(p, "Portrait tables should use at most three columns", "warning");
    }
    if (s.type === "equation" && s.operators.length !== s.terms.length - 1)
      issue(
        `${p}.operators`,
        "There must be one operator between adjacent terms",
      );
    if (s.type === "sources" && (s.sourceIds.length || e.sources.length) > 8)
      issue(
        p,
        "Split references across multiple source scenes; max 8 per page",
      );
    if (s.type === "legacy") {
      for (const error of validateLegacy(s.component, s.props))
        issue(`${p}.props`, error);
      if (legacyIds && !legacyIds.has(s.component))
        issue(`${p}.component`, `Unknown legacy component: ${s.component}`);
      if (e.format !== "landscape")
        issue(
          p,
          "Legacy scenes use a 16:9 canvas; choose a native template for portrait or square",
        );
      issue(
        p,
        "Legacy layouts retain their original prop contracts. Review the component catalog and preview before publishing.",
        "warning",
      );
    }
    if (s.title.length > 48)
      issue(
        `${p}.title`,
        "Long title: check wrapping in the chosen aspect ratio",
        "warning",
      );
    if (s.narration) {
      const count =
        e.locale === "en-US"
          ? s.narration.split(/\s+/).length
          : s.narration.length;
      const rate = e.locale === "en-US" ? 2.8 : 4.5;
      if (count / s.duration > rate)
        issue(
          `${p}.narration`,
          "Narration may exceed scene duration; align to the final voice track",
          "warning",
        );
    }
  });
  let end = 0;
  e.captions.forEach((c, i) => {
    if (c.end <= c.start)
      issue(`captions.${i}`, "Caption end must be after start");
    if (c.start < end)
      issue(`captions.${i}`, "Captions must be ordered and non-overlapping");
    if (Math.round(c.end * e.fps) > durationInFrames(e))
      issue(`captions.${i}.end`, "Caption exceeds episode duration");
    end = c.end;
  });
  return { episode: e, issues };
}
export function parseEpisode(input: unknown): Episode {
  const result = validateEpisode(input);
  const errors = result.issues.filter((i) => i.level === "error");
  if (errors.length || !result.episode)
    throw new Error(errors.map((i) => `${i.path}: ${i.message}`).join("\n"));
  return result.episode;
}
