import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateEpisode, parseEpisode } from "../src/program/validate";
import {
  compileTimeline,
  captionAt,
  durationInFrames,
} from "../src/program/timeline";
import { waterfallSteps, domain } from "../src/broadcast/charts";
import { brandSchema } from "../src/brand/schema";
import { resolveBrand, presets } from "../src/brand/presets";
import catalog from "../schemas/legacy-catalog.json";

const raw = () =>
  JSON.parse(fs.readFileSync("examples/template-gallery.json", "utf8"));
const errors = (x: unknown) =>
  validateEpisode(x).issues.filter((i) => i.level === "error");
test("all 24 native templates validate with default values", () => {
  const e = parseEpisode(raw());
  assert.equal(e.scenes.length, 24);
  assert.equal(errors(e).length, 0);
});
test("rejects unknown fields and non-finite numbers", () => {
  const e = raw();
  e.scenes[2].metric.value = Infinity;
  assert.ok(errors(e).length);
  e.scenes[2].metric.value = 100;
  e.scenes[2].madeUpProperty = true;
  assert.ok(errors(e).length);
});
test("production data and quotations require known sources", () => {
  const e = raw();
  e.isDemo = false;
  e.scenes[2].sourceIds = [];
  assert.ok(errors(e).some((x) => x.message.includes("source")));
  e.scenes[2].sourceIds = ["unknown"];
  assert.ok(errors(e).some((x) => x.message.includes("Unknown source")));
});
test("duplicate IDs and invalid calendar dates fail without crashing", () => {
  const e = raw();
  e.scenes[1].id = e.scenes[0].id;
  e.sources[0].date = "2026-99-32";
  assert.ok(errors(e).length >= 2);
});
test("trend rejects length mismatch and all missing series; accepts gaps", () => {
  const e = raw();
  const s = e.scenes.find((s: { type: string }) => s.type === "trend");
  s.series[0].values.pop();
  assert.ok(errors(e).length);
  s.series[0].values = [100, null, 129, 143, 161, 180];
  assert.equal(errors(e).length, 0);
  s.series[0].values.fill(null);
  assert.ok(errors(e).length);
});
test("composition requires nonnegative values and a nonzero total", () => {
  const e = raw();
  const s = e.scenes.find((s: { type: string }) => s.type === "donut");
  s.data.forEach((d: { value: number }) => (d.value = 0));
  assert.ok(errors(e).length);
  s.data[0].value = -1;
  assert.ok(errors(e).length);
});
test("waterfall has cumulative floating bars and reconciles totals", () => {
  const data = [
    { label: "start", kind: "total" as const, value: 100 },
    { label: "cost", kind: "delta" as const, value: -130 },
    { label: "end", kind: "total" as const, value: -30 },
  ];
  assert.deepEqual(
    waterfallSteps(data).map((d) => [d.start, d.end]),
    [
      [0, 100],
      [100, -30],
      [0, -30],
    ],
  );
  const e = raw();
  const s = e.scenes.find((s: { type: string }) => s.type === "waterfall");
  s.data.at(-1).value = 999;
  assert.ok(errors(e).some((x) => x.message.includes("reconcile")));
});
test("zero baseline accommodates negative and zero-only values", () => {
  assert.deepEqual(domain([-20, 40], true), [-20, 40]);
  const d = domain([0, 0], true);
  assert.ok(Number.isFinite(d[0]) && d[1] > d[0]);
});
test("table row lengths and equation operators are validated", () => {
  const e = raw();
  e.scenes.find((s: { type: string }) => s.type === "table").rows[0].pop();
  assert.ok(errors(e).length);
  const second = raw();
  second.scenes.find((s: { type: string }) => s.type === "equation").operators =
    ["+"];
  assert.ok(errors(second).length);
});
test("timeline rounds boundaries without drift at 24 and 60 fps", () => {
  for (const fps of [24, 60] as const) {
    const e = parseEpisode(raw());
    e.fps = fps;
    e.scenes.forEach((s) => (s.duration = 2.13));
    const timeline = compileTimeline(e);
    for (let i = 1; i < timeline.length; i++)
      assert.equal(
        timeline[i - 1].from + timeline[i - 1].durationInFrames,
        timeline[i].from,
      );
    assert.equal(
      timeline.at(-1)!.from + timeline.at(-1)!.durationInFrames,
      durationInFrames(e),
    );
  }
});
test("captions use exclusive ends and reject overlapping or out-of-range cues", () => {
  const e = parseEpisode(raw());
  e.captions = [
    { start: 0, end: 2, text: "一" },
    { start: 2, end: 3, text: "二" },
  ];
  assert.equal(captionAt(e, 60)?.text, "二");
  assert.equal(captionAt(e, 90), undefined);
  e.captions[1].start = 1;
  assert.ok(errors(e).length);
  e.captions[1] = { start: 999, end: 1000, text: "越界" };
  assert.ok(errors(e).length);
});
test("brand deep merges without mutating the preset; changes market convention", () => {
  const first = presets.newsroom.colors.positive;
  const b = brandSchema.parse({
    preset: "newsroom",
    marketColors: "china",
    overrides: { colors: { accent: "#123456" }, shape: { radius: 12 } },
  });
  const t = resolveBrand(b);
  assert.equal(t.colors.negative, first);
  assert.equal(t.colors.accent, "#123456");
  assert.equal(t.shape.radius, 12);
  assert.equal(presets.newsroom.colors.positive, first);
  assert.notEqual(presets.newsroom.colors.accent, "#123456");
});
test("legacy catalog IDs are unique and props are checked", () => {
  assert.equal(new Set(catalog.map((c) => c.id)).size, catalog.length);
  const e = raw();
  e.scenes = [
    {
      id: "legacy-test",
      title: "A real input",
      type: "legacy",
      component: "Chart-Bar",
      props: { data: [{ year: "2026", value: 123 }] },
    },
  ];
  assert.equal(errors(e).length, 0);
  e.scenes[0].props.data[0].value = "invalid";
  assert.ok(errors(e).length);
  e.scenes[0].component = "Missing";
  assert.ok(errors(e).length);
});
test("asset references reject URL, absolute paths and traversal", () => {
  for (const asset of [
    "../secret",
    "/root/file",
    "https://example.com/a.png",
    "images/../../a.png",
  ]) {
    const e = raw();
    e.scenes.find((s: { type: string }) => s.type === "media").asset = asset;
    assert.ok(errors(e).length);
  }
});
test("all bundled episodes pass", () => {
  for (const file of ["episode.json", "shorts.json", "template-gallery.json"])
    assert.equal(
      errors(JSON.parse(fs.readFileSync(`examples/${file}`, "utf8"))).length,
      0,
      file,
    );
});

import { parseSrt } from "../src/program/captions";
test("SRT accepts BOM and CRLF, preserves text, and rejects malformed timings", () => {
  assert.deepEqual(
    parseSrt(
      "\uFEFF1\r\n00:00:01,250 --> 00:00:03,000\r\n第一行\r\n第二行\r\n",
    ),
    [{ start: 1.25, end: 3, text: "第一行\n第二行" }],
  );
  assert.throws(() => parseSrt("1\n00:90:00,000 --> 00:00:03,000\nX"));
});

import { makeBrandPreview } from "../src/showcase/brandPreviews";
import { retimeScenes } from "../src/program/timeline";
test("brand previews have self-contained valid timelines", () => {
  for (const preset of Object.keys(presets) as (keyof typeof presets)[]) {
    const e = makeBrandPreview(preset);
    assert.equal(errors(e).length, 0);
    assert.equal(e.captions.length, 0);
  }
});
test("reordering, duplicating and trimming scenes retain valid caption timing", () => {
  const e = parseEpisode(
    JSON.parse(fs.readFileSync("examples/episode.json", "utf8")),
  );
  const reverse = retimeScenes(e, [...e.scenes].reverse());
  assert.equal(errors(reverse).length, 0);
  assert.equal(reverse.captions.length, e.captions.length);
  const first = e.scenes[0];
  const copy = { ...first, id: "copied-first" };
  const next = retimeScenes(e, [first, copy, ...e.scenes.slice(1)], {
    [copy.id]: first.id,
  });
  assert.equal(errors(next).length, 0);
  assert.ok(next.captions.length > e.captions.length);
  const trim = retimeScenes(e, [{ ...first, duration: 2 }]);
  assert.equal(errors(trim).length, 0);
  assert.ok(trim.captions.every((c) => c.end <= 2));
});

test("demo financial amounts reconcile across metric, table, trend and waterfall scenes", () => {
  const e = parseEpisode(
    JSON.parse(fs.readFileSync("examples/episode.json", "utf8")),
  );
  const kpis = e.scenes.find((s) => s.type === "kpis");
  const bridge = e.scenes.find((s) => s.type === "waterfall");
  const table = e.scenes.find((s) => s.type === "table");
  const trend = e.scenes.find((s) => s.type === "trend");
  assert.ok(
    kpis?.type === "kpis" &&
      bridge?.type === "waterfall" &&
      table?.type === "table" &&
      trend?.type === "trend",
  );
  const profit = kpis.items.find((m) => m.label === "营业利润")!;
  assert.equal(bridge.data.at(-1)!.value, profit.value);
  const prevProfit = Number(table.rows[1][2]);
  assert.equal(
    profit.change,
    Math.round((profit.value / prevProfit - 1) * 1000) / 10,
  );
  const growth =
    (trend.series[1].values[4]! / trend.series[1].values[3]! - 1) * 100;
  assert.ok(Math.abs(growth - profit.change!) < 0.1);
});
