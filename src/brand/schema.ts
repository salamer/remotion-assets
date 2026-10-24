import { z } from "zod";

export const colorSchema = z
  .string()
  .regex(/^#[\da-fA-F]{6}$/, "Use a six-digit hex color");
export const assetSchema = z
  .string()
  .min(1)
  .max(300)
  .refine(
    (v) =>
      !v.startsWith("/") &&
      !v.includes("..") &&
      !v.includes(":") &&
      !v.includes("\\"),
    "Use a relative file under public/, without traversal or URL",
  );
export const paletteSchema = z
  .object({
    background: colorSchema,
    surface: colorSchema,
    foreground: colorSchema,
    muted: colorSchema,
    line: colorSchema,
    accent: colorSchema,
    onAccent: colorSchema,
    positive: colorSchema,
    negative: colorSchema,
    series: z.array(colorSchema).min(3).max(8),
  })
  .strict();
export const tokenSchema = z
  .object({
    colors: paletteSchema,
    typography: z
      .object({
        font: z.enum(["sans", "serif", "mono"]),
        titleScale: z.number().min(0.8).max(1.15),
      })
      .strict(),
    shape: z
      .object({
        radius: z.number().min(0).max(40),
        border: z.number().min(0).max(4),
        shadow: z.boolean(),
      })
      .strict(),
    layout: z
      .object({ padding: z.number().min(48).max(96), grid: z.boolean() })
      .strict(),
    motion: z.enum(["calm", "editorial", "energetic", "none"]),
  })
  .strict();
export const brandSchema = z
  .object({
    preset: z
      .enum([
        "editorial",
        "newsroom",
        "terminal",
        "journal",
        "cobalt",
        "documentary",
        "minimal",
        "signal",
      ])
      .default("editorial"),
    name: z.string().min(1).max(30).default("FINANCE / MOTION"),
    logo: assetSchema.optional(),
    marketColors: z.enum(["international", "china"]).default("international"),
    overrides: z
      .object({
        colors: paletteSchema.partial().optional(),
        typography: tokenSchema.shape.typography.partial().optional(),
        shape: tokenSchema.shape.shape.partial().optional(),
        layout: tokenSchema.shape.layout.partial().optional(),
        motion: tokenSchema.shape.motion.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
export type Brand = z.infer<typeof brandSchema>;
export type Tokens = z.infer<typeof tokenSchema>;
export type BrandInput = z.input<typeof brandSchema>;
