/**
 * Finance Motion — 设计系统 / Design System
 *
 * 风格方向：Soft Brutalism + Financial Editorial（柔和粗野主义 + 财经编辑风）
 *
 * 使用原则：
 * - 颜色、边框、阴影优先用本文件的常量（SVG / inline style）
 * - 布局和排版优先用 Tailwind class（见 style/index.css 中的 @theme）
 * - 动画时长见 animation；场景统一用 lib/motion.ts + lib/chartMotion.ts
 *
 * 避免：渐变、发光、玻璃拟态、强模糊、随意配色
 * 说明：标准图表偏硬切淡入；表达/结构层可用 springIn（受控 overshoot），不要随意加 CSS transition
 */

// ---------------------------------------------------------------------------
// 色板 / Colors
// ---------------------------------------------------------------------------

/** 所有品牌色。yellow = 强调，ink = 主信息，muted = 次要信息 */
export const colors = {
  /** 画布背景 — 暖白纸张色 */
  paper: "#FAFAF7",
  /** 主文字、边框、阴影 — 近黑 */
  ink: "#111111",
  /** 强调色 — 用于高亮数字、标签、图表重点 */
  yellow: "#FFD43B",
  /** 次要文字、注释、轴标签 */
  muted: "#737373",
  /** 分隔线、图表底色、浅背景块 */
  soft: "#ECECE7",
  /** 卡片默认背景（非 yellow 强调时） */
  white: "#FFFFFF",
} as const;

// ---------------------------------------------------------------------------
// 边框 / Borders
// ---------------------------------------------------------------------------

export const borders = {
  /** 标准边框宽度（px）— 全局统一 2px */
  width: 2,
  /** 边框颜色 */
  color: colors.ink,
  /** Tailwind 边框 class 组合 */
  className: "border-2 border-ink",
} as const;

// ---------------------------------------------------------------------------
// 阴影 / Shadows
// ---------------------------------------------------------------------------

/** 粗野主义硬阴影：无模糊，纯黑偏移（大→小用于层级） */
export const shadows = {
  brutal: `6px 6px 0 ${colors.ink}`,
  brutalMd: `4px 4px 0 ${colors.ink}`,
  brutalSm: `3px 3px 0 ${colors.ink}`,
} as const;

// ---------------------------------------------------------------------------
// 间距 / Spacing
// ---------------------------------------------------------------------------

export const spacing = {
  /** Frame 内边距（px）— 与 Source 左侧对齐 */
  framePadding: 64,
  /** Source 组件距底部 */
  sourceBottom: 50,
  /** Ticker overlay 定位 */
  tickerBottom: 60,
  tickerLeft: 60,
} as const;

// ---------------------------------------------------------------------------
// 布局 / Layout
// ---------------------------------------------------------------------------

export const layout = {
  /** Frame 背景网格单元大小（px） */
  gridSize: 48,
  /** 网格线透明度（0–1） */
  gridOpacity: 0.025,
  /** 默认视频尺寸 — 与 config.ts 保持一致 */
  width: 1920,
  height: 1080,
} as const;

// ---------------------------------------------------------------------------
// 字体 / Typography
// ---------------------------------------------------------------------------

export const typography = {
  /** 字体族名称 — 须与 fonts.ts 中 loadFont 的 family 一致 */
  fontFamily: "IBM Plex Mono",
  /** 字重 */
  weight: {
    regular: 400,
    semibold: 600,
  },
} as const;

/**
 * 常用排版 Tailwind class（复制到 className 即可）
 * 大标题、大数字场景可在此基础上加大字号
 */
export const textClasses = {
  eyebrow: "text-[26px] tracking-[0.12em] text-muted",
  title: "text-[62px] font-semibold leading-[1.05] tracking-[-0.05em]",
  titleLg: "text-[64px] font-semibold tracking-[-0.05em]",
  subtitle: "text-[26px] leading-[1.4] text-muted",
  body: "text-[22px] text-muted",
  source: "text-[19px] tracking-[0.08em] text-muted",
  tag: "text-[22px] font-semibold",
} as const;

// ---------------------------------------------------------------------------
// 图表 / Charts（SVG 内联样式用）
// ---------------------------------------------------------------------------

export const chart = {
  strokeWidth: 8,
  strokeLinecap: "square" as const,
  dotRadius: 10,
  dotStrokeWidth: 3,
  guideOpacity: 0.12,
  donutStrokeWidth: 55,
  colors: {
    primary: colors.ink,
    emphasis: colors.yellow,
    track: colors.soft,
    label: colors.muted,
  },
} as const;

// ---------------------------------------------------------------------------
// 动画节奏 / Animation timing（帧数，30fps）
// ---------------------------------------------------------------------------

export const animation = {
  /** 元素入场默认时长 */
  entranceFrames: 12,
  entranceMin: 10,
  entranceMax: 18,
  /** 图表增长动画 */
  chartGrowFrames: 30,
  chartGrowMin: 20,
  chartGrowMax: 40,
  /** 折线绘制 */
  lineDrawFrames: 50,
  /** 列表/条形图逐项延迟 */
  staggerFrames: 8,
  staggerMin: 5,
  staggerMax: 10,
};

// ---------------------------------------------------------------------------
// 工具函数 / Helpers
// ---------------------------------------------------------------------------

/** Frame 背景网格 CSS backgroundImage */
export function gridBackgroundImage(): string {
  const line = `rgba(0,0,0,${layout.gridOpacity})`;
  return `
    linear-gradient(${line} 1px, transparent 1px),
    linear-gradient(90deg, ${line} 1px, transparent 1px)
  `;
}
