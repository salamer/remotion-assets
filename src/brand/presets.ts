import type { Brand, Tokens } from "./schema";

const make = (
  colors: Tokens["colors"],
  font: Tokens["typography"]["font"],
  radius: number,
  grid = false,
  shadow = false,
): Tokens => ({
  colors,
  typography: { font, titleScale: 1 },
  shape: { radius, border: shadow ? 2 : 1, shadow },
  layout: { padding: 72, grid },
  motion: "editorial",
});

export const presets: Record<Brand["preset"], Tokens> = {
  editorial: make(
    {
      background: "#F4F2E9",
      surface: "#FFFEF9",
      foreground: "#192420",
      muted: "#5B665F",
      line: "#C5CBC0",
      accent: "#DFFF6B",
      onAccent: "#192420",
      positive: "#137B52",
      negative: "#C34136",
      series: ["#526B46", "#D0A43D", "#5483A1", "#AF6456", "#82789C"],
    },
    "sans",
    0,
    true,
    true,
  ),
  newsroom: make(
    {
      background: "#0B1727",
      surface: "#12243A",
      foreground: "#F1F5FA",
      muted: "#9AAFC8",
      line: "#2B425E",
      accent: "#FFBA52",
      onAccent: "#151B22",
      positive: "#63D9AB",
      negative: "#FF897D",
      series: ["#FFBA52", "#63BCD8", "#9D9AF1", "#73CAA3", "#D992B6"],
    },
    "sans",
    4,
  ),
  terminal: make(
    {
      background: "#071412",
      surface: "#0E211D",
      foreground: "#D5F6DD",
      muted: "#8AAE98",
      line: "#254436",
      accent: "#99EF6C",
      onAccent: "#11200E",
      positive: "#99EF6C",
      negative: "#FA9687",
      series: ["#99EF6C", "#67C5C4", "#D9C76B", "#E79587", "#BDA4E4"],
    },
    "mono",
    0,
    true,
  ),
  journal: make(
    {
      background: "#F7EFE2",
      surface: "#FFFAF0",
      foreground: "#322F2A",
      muted: "#716557",
      line: "#D4C8B6",
      accent: "#B74B37",
      onAccent: "#FFFFFF",
      positive: "#32765B",
      negative: "#B74B37",
      series: ["#B74B37", "#467E85", "#B7964F", "#7C739D", "#799359"],
    },
    "serif",
    0,
  ),
  cobalt: make(
    {
      background: "#101C63",
      surface: "#1A2B78",
      foreground: "#F5F5FF",
      muted: "#AFB9EA",
      line: "#394997",
      accent: "#DBF566",
      onAccent: "#152049",
      positive: "#93E6C6",
      negative: "#FF9A96",
      series: ["#DBF566", "#6ACBEE", "#E3A6EC", "#B2A4FB", "#F9C28F"],
    },
    "sans",
    20,
    true,
  ),
  documentary: make(
    {
      background: "#191A18",
      surface: "#252724",
      foreground: "#EDEBE4",
      muted: "#A5A79C",
      line: "#45473F",
      accent: "#D5B982",
      onAccent: "#22241C",
      positive: "#9DBF91",
      negative: "#DA9B87",
      series: ["#D5B982", "#9DBF91", "#8DAFBC", "#C39BB5", "#A8A5D0"],
    },
    "serif",
    2,
  ),
  minimal: make(
    {
      background: "#F7F9FC",
      surface: "#FFFFFF",
      foreground: "#162A43",
      muted: "#5F7188",
      line: "#D2DCE7",
      accent: "#2658DD",
      onAccent: "#FFFFFF",
      positive: "#17744F",
      negative: "#C04050",
      series: ["#2658DD", "#128789", "#B27B24", "#AF4C81", "#7764C3"],
    },
    "sans",
    24,
  ),
  signal: make(
    {
      background: "#F8F4F1",
      surface: "#FFFFFF",
      foreground: "#242222",
      muted: "#6B6664",
      line: "#D4CAC6",
      accent: "#C62F38",
      onAccent: "#FFFFFF",
      positive: "#127554",
      negative: "#C62F38",
      series: ["#C62F38", "#336E98", "#92754A", "#758349", "#8A68A9"],
    },
    "sans",
    0,
  ),
};

export const presetLabels: Record<Brand["preset"], string> = {
  editorial: "财经编辑",
  newsroom: "午夜新闻",
  terminal: "市场终端",
  journal: "经济周刊",
  cobalt: "科技商业",
  documentary: "深度纪录",
  minimal: "极简研究",
  signal: "焦点快讯",
};

export function resolveBrand(brand: Brand): Tokens {
  const p = presets[brand.preset];
  const o = brand.overrides;
  const c = { ...p.colors, ...o?.colors };
  // market convention changes the semantics everywhere, including charts and tickers.
  if (brand.marketColors === "china")
    [c.positive, c.negative] = [c.negative, c.positive];
  return {
    ...p,
    ...o,
    colors: c,
    typography: { ...p.typography, ...o?.typography },
    shape: { ...p.shape, ...o?.shape },
    layout: { ...p.layout, ...o?.layout },
  };
}
