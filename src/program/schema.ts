import { z } from "zod";
import { brandSchema, assetSchema } from "../brand/schema";

const text = z.string().trim().min(1);
const short = text.max(64);
const finite = z.number().finite();
const localAsset = assetSchema;
export const sourceSchema = z
  .object({
    id: short,
    label: text.max(100),
    url: z.string().url().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    detail: text.max(220).optional(),
  })
  .strict();
const metric = z
  .object({
    label: short,
    value: finite,
    prefix: z.string().max(8).default(""),
    suffix: z.string().max(12).default(""),
    decimals: z.number().int().min(0).max(3).default(1),
    change: finite.optional(),
    changeLabel: z.string().max(24).default("同比"),
    note: z.string().max(70).optional(),
  })
  .strict();
const datum = z
  .object({ label: short, value: finite, highlight: z.boolean().optional() })
  .strict();
const base = {
  id: short,
  duration: z.number().min(2).max(120).default(7),
  title: text.max(84),
  kicker: z.string().max(50).optional(),
  subtitle: z.string().max(150).optional(),
  sourceIds: z.array(short).max(8).default([]),
  note: z.string().max(180).optional(),
  narration: z.string().max(1800).optional(),
  // This is a declarative scene field; it is not a CSS transition animation.
  // eslint-disable-next-line @remotion/non-pure-animation
  transition: z.enum(["cut", "fade", "slide"]).default("fade"),
  lowerThird: z
    .object({ name: text.max(32), role: text.max(55) })
    .strict()
    .optional(),
};
export const sceneSchema = z.discriminatedUnion("type", [
  z
    .object({
      ...base,
      type: z.literal("opener"),
      episode: z.string().max(30).optional(),
      tagline: z.string().max(80).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("chapter"),
      number: short,
      summary: z.string().max(150).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("headline"),
      label: short.default("焦点"),
      body: text.max(280),
      metric: metric.optional(),
    })
    .strict(),
  z.object({ ...base, type: z.literal("hero"), metric }).strict(),
  z
    .object({
      ...base,
      type: z.literal("kpis"),
      items: z.array(metric).min(1).max(6),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("bars"),
      data: z.array(datum).min(1).max(8),
      unit: z.string().max(20).default(""),
      orientation: z.enum(["horizontal", "vertical"]).default("horizontal"),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("ranking"),
      data: z.array(datum).min(1).max(8),
      unit: z.string().max(20).default(""),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("trend"),
      labels: z.array(short).min(2).max(120),
      series: z
        .array(
          z
            .object({
              name: short,
              values: z.array(finite.nullable()).min(2).max(120),
            })
            .strict(),
        )
        .min(1)
        .max(4),
      unit: z.string().max(20).default(""),
      zeroBaseline: z.boolean().default(false),
      forecastFrom: z.number().int().min(1).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("waterfall"),
      data: z
        .array(
          z
            .object({
              label: short,
              value: finite,
              kind: z.enum(["total", "delta"]),
            })
            .strict(),
        )
        .min(2)
        .max(8),
      unit: z.string().max(20).default(""),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("donut"),
      data: z
        .array(datum.extend({ value: finite.nonnegative() }))
        .min(2)
        .max(6),
      unit: z.string().max(20).default(""),
      centerLabel: short.default("构成"),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("table"),
      columns: z.array(short).min(2).max(5),
      rows: z
        .array(
          z
            .array(z.union([z.string().max(70), finite]))
            .min(2)
            .max(5),
        )
        .min(1)
        .max(7),
      highlightRow: z.number().int().nonnegative().optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("quote"),
      quote: text.max(220),
      author: short,
      role: z.string().max(90).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("comparison"),
      left: z
        .object({
          label: short,
          headline: text.max(90),
          points: z.array(text.max(90)).min(1).max(4),
        })
        .strict(),
      right: z
        .object({
          label: short,
          headline: text.max(90),
          points: z.array(text.max(90)).min(1).max(4),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("timeline"),
      events: z
        .array(
          z
            .object({
              date: short,
              title: text.max(50),
              body: z.string().max(100).optional(),
            })
            .strict(),
        )
        .min(2)
        .max(5),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("equation"),
      terms: z
        .array(z.object({ label: short, value: short }).strict())
        .min(2)
        .max(4),
      operators: z
        .array(z.enum(["+", "−", "×", "÷", "="]))
        .min(1)
        .max(3),
      explanation: z.string().max(200).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("takeaway"),
      body: text.max(220),
      action: z.string().max(120).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("bullets"),
      items: z
        .array(
          z
            .object({
              title: text.max(70),
              body: z.string().max(150).optional(),
            })
            .strict(),
        )
        .min(1)
        .max(5),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("news-grid"),
      items: z
        .array(
          z
            .object({
              category: short,
              headline: text.max(100),
              summary: text.max(160),
            })
            .strict(),
        )
        .min(2)
        .max(4),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("earnings"),
      company: short,
      period: short,
      items: z.array(metric).min(2).max(4),
      guidance: text.max(150),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("scenario"),
      scenarios: z
        .array(
          z
            .object({ name: short, value: finite, assumption: text.max(150) })
            .strict(),
        )
        .length(3),
      unit: z.string().max(20).default(""),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("media"),
      asset: localAsset,
      caption: text.max(180),
      fit: z.enum(["contain", "cover"]).default("contain"),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("presenter"),
      asset: localAsset,
      mediaType: z.enum(["image", "video"]).default("image"),
      points: z.array(text.max(100)).min(1).max(4),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("sources"),
      heading: z.string().max(100).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("endcard"),
      message: text.max(140),
      nextTitle: z.string().max(100).optional(),
      handle: z.string().max(50).optional(),
    })
    .strict(),
  z
    .object({
      ...base,
      type: z.literal("legacy"),
      component: text.max(100),
      props: z.record(z.string(), z.unknown()).default({}),
    })
    .strict(),
]);

export const episodeSchema = z
  .object({
    version: z.literal("2.0"),
    title: text.max(100),
    description: z.string().max(500).optional(),
    format: z.enum(["landscape", "portrait", "square"]).default("landscape"),
    fps: z
      .union([z.literal(24), z.literal(25), z.literal(30), z.literal(60)])
      .default(30),
    locale: z.enum(["zh-CN", "en-US", "ja-JP"]).default("zh-CN"),
    isDemo: z.boolean().default(false),
    brand: brandSchema.default(() => brandSchema.parse({})),
    sources: z.array(sourceSchema).max(100).default([]),
    scenes: z.array(sceneSchema).min(1).max(150),
    ticker: z
      .array(
        z
          .object({ label: short, value: short, change: finite.optional() })
          .strict(),
      )
      .max(8)
      .optional(),
    captions: z
      .array(
        z
          .object({
            start: z.number().nonnegative(),
            end: z.number().positive(),
            text: text.max(100),
          })
          .strict(),
      )
      .max(2000)
      .default([]),
    audio: z
      .object({
        voiceover: localAsset.optional(),
        music: localAsset.optional(),
        voiceVolume: z.number().min(0).max(2).default(1),
        musicVolume: z.number().min(0).max(0.5).default(0.12),
      })
      .strict()
      .optional(),
  })
  .strict();

export type Episode = z.infer<typeof episodeSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type Metric = z.infer<typeof metric>;
export type SceneOf<T extends Scene["type"]> = Extract<Scene, { type: T }>;
export const dimensions = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
} as const;
