# Finance Motion

用 React / Remotion 组件和结构化数据，制作财经节目、商业分析视频、YouTube 解说及 Shorts。

这个项目首先是一套视频组件库。你可以继续像以前一样导入组件、修改 props、写 React、在 Remotion 中预览和渲染。项目同时提供了 Episode JSON 协议、节目模板、统一品牌样式和 Workbench，让同一套节目结构可以重复使用，也方便 AI 根据数据自动编排。

**第一次使用，先运行 `pnpm dev` 看原组件；想用数据直接编排节目，再使用 `pnpm workbench`。**

本文是纯 GitHub Markdown。逐项组件说明见 [component-readme.md](component-readme.md)；实际接口以当前源码、Schema 和示例为准。

## 目录

- [1. 项目是什么](#1-项目是什么)
- [2. 原组件、节目模板和 Workbench 的区别](#2-原组件节目模板和-workbench-的区别)
- [3. 安装与第一次运行](#3-安装与第一次运行)
- [4. 继续使用原来的组件](#4-继续使用原来的组件)
- [5. 用 Episode JSON 制作完整视频](#5-用-episode-json-制作完整视频)
- [6. Workbench 使用指南](#6-workbench-使用指南)
- [7. Episode 协议与字段](#7-episode-协议与字段)
- [8. 24 种节目模板怎么选](#8-24-种节目模板怎么选)
- [9. 数据图表的输入规则](#9-数据图表的输入规则)
- [10. 如何设计一期财经节目](#10-如何设计一期财经节目)
- [11. 如何统一设计自己的频道样式](#11-如何统一设计自己的频道样式)
- [12. 字体的使用、修改与恢复](#12-字体的使用修改与恢复)
- [13. 图片、视频、旁白、音乐与字幕](#13-图片视频旁白音乐与字幕)
- [14. 预览、检查帧与正式渲染](#14-预览检查帧与正式渲染)
- [15. 让 AI 根据数据自动生成视频](#15-让-ai-根据数据自动生成视频)
- [16. 扩展组件、模板和样式](#16-扩展组件模板和样式)
- [17. 目录结构与实现关系](#17-目录结构与实现关系)
- [18. 命令速查](#18-命令速查)
- [19. 常见问题与当前边界](#19-常见问题与当前边界)
- [20. 建议的日常工作流程](#20-建议的日常工作流程)

## 1. 项目是什么

| 层 | 内容 | 你通常修改什么 |
| --- | --- | --- |
| 原场景组件 | 109 个完整画面的 React 组件，涵盖图表、关系图、策略框架、媒体和叙事 | props、布局、专用动画 |
| 基础组件与工具 | Frame、BrutalCard、SceneHeader、Panel、Reveal、图例、节点、连接线等 | 通用外观和可复用行为 |
| 节目模板 | 24 种由结构化数据驱动的常用镜头 | 数据、标题、说明、时长 |
| Episode | 一整期节目的 JSON：镜头、品牌、来源、字幕和声音 | 每一期的内容与编排 |
| 设计系统 | 原组件设计常量、节目品牌 tokens 和 8 套预设 | 配色、字体、形状、留白和节奏 |
| Workbench | 在浏览器中编辑、校验和预览 Episode | 样式、分镜顺序、时长、JSON |
| AI skill | 指导 AI 读数据、选模板、生成 JSON、检查并调用渲染器 | 输入资料、节目与交付要求 |

实际视频由 Remotion 渲染。Workbench 和 AI 都复用现有组件和模板，最终仍然是同一套 React 实现。

当前主要能力：

- 原有 109 个 Composition 可独立预览、修改和渲染。
- 24 种原生节目模板支持横屏、竖屏、方形。
- `legacy` 场景可以把原组件插进 Episode，要求横屏。
- 8 套品牌预设支持按频道覆盖配置。
- 支持本地图片、主持人视频、旁白、音乐、字幕和行情条。
- 支持 JSON 校验、分镜计划、检查帧、MP4 和 ProRes 输出。

数据采集、CSV 清洗、模型调用、配音生成和语音识别属于上游流程。你可以用自己的程序或 AI 环境完成这些工作，再把整理后的数据与素材交给本项目。

## 2. 原组件、节目模板和 Workbench 的区别

### 2.1 三个入口

| 入口 | 启动方式 | 适合做什么 | 主要输入 | 结果 |
| --- | --- | --- | --- | --- |
| Remotion Studio | `pnpm dev` | 查看 Composition，开发和调试组件 | React、props | 实际预览、渲染 |
| Workbench | `pnpm workbench` | 调频道样式、编排分镜、编辑 Episode | Episode / brand.json | 预览、导出的 JSON |
| 渲染命令 | `pnpm render 输入.json 输出.mp4` | 批量把节目制作成文件 | Episode、本地素材 | 视频和配套文件 |

Workbench 主要编辑数据和品牌，不提供逐元素拖拽、任意关键帧编辑或通用视频剪辑。需要自由布局时，直接修改 React。

### 2.2 相似名字的不同含义

| 名字 | 含义 | 用法 |
| --- | --- | --- |
| `HeroMetric` | 原来的 React 场景组件 | `<HeroMetric value={128} ... />` |
| `Metric-HeroMetric` | Studio 中的 Composition ID | 在 Studio 选择，或传给 Remotion CLI |
| `type: "hero"` | Episode 的一种原生镜头 | `{ "type": "hero", "metric": {...} }` |
| `FinanceEpisode` | 整期编排组件及对应 Composition | `<FinanceEpisode episode={episode} />` |

`HeroMetric` 和 `hero` 表达相近的信息，但接口、布局和包装不同。原组件使用自己的 props；原生模板使用统一数据结构和节目包装。

### 2.3 选择工作方式

| 你的目标 | 建议 |
| --- | --- |
| 继续改之前那批 motion 组件 | `pnpm dev`，修改 `src/scenes/` |
| 自己写一个特别的镜头 | 写 React 场景，在 `src/Root.tsx` 注册 Composition |
| 同一套财报节目反复换数据 | 使用 Episode 和原生模板 |
| 让 AI 自动选图并生成整期节目 | 使用 skill，生成 Episode JSON |
| 调一套频道外观 | Workbench 调整后导出 brand.json |
| 使用 Sankey、人口金字塔、所有权树等 | 原组件；在 Episode 中用 legacy 引用 |
| 做 Shorts 或方形视频 | 优先用原生模板，检查目标画幅 |

使用原组件不需要先学 Workbench。

## 3. 安装与第一次运行

### 3.1 环境

- Node.js 22 或更高版本。
- pnpm；仓库 `packageManager` 指定版本为 10.30.2。
- 可以运行 Chromium 的本地环境。

依赖版本由 `package.json` 和 `pnpm-lock.yaml` 固定。首次浏览器渲染可能需要下载对应的 Chrome Headless Shell；字体和素材使用本地文件。

在项目根目录运行：

```bash
pnpm install --frozen-lockfile
```

如果没有 pnpm，先准备与 packageManager 匹配的版本。安装失败先检查 Node / pnpm 版本，不要直接删除锁文件。

### 3.2 先看原组件

```bash
pnpm dev
```

打开终端给出的 Studio 地址：

| Studio 目录 | 内容 |
| --- | --- |
| `Original-Catalog` | 独立原组件及 CoreComponentsReel、ChartsReel 等合集 |
| `Production` | FinanceEpisode、TemplateGallery、FinanceShorts |
| `Brand-Previews` | 8 套品牌预览 |

先选择 `Metric-HeroMetric`、`Chart-Bar` 或 `Chart-Line`，播放、拖动时间轴，再修改对应源码。这是与原组件库最接近的用法。

### 3.3 先做一份节目

```bash
pnpm workbench
```

默认端口为 5173，实际地址以终端显示为准。首次打开载入示例，有本地草稿时恢复草稿。

修改频道名称、选择镜头、导出 episode.json。把文件保存到项目根目录：

```bash
pnpm validate episode.json
pnpm render episode.json out/my-first-video.mp4 --draft
```

`--draft` 保留整段时长，以半尺寸和较高压缩率输出。

### 3.4 跑仓库示例

```bash
pnpm validate examples/episode.json
pnpm export:plan examples/episode.json out/sample
pnpm stills examples/episode.json out/sample-stills
pnpm render examples/episode.json out/sample.mp4 --draft
```

示例使用演示数据。未配置声音文件时输出无声视频，旁白字段只形成文稿。

## 4. 继续使用原来的组件

### 4.1 找组件

| 资料 | 用途 |
| --- | --- |
| [CATALOG.md](CATALOG.md) | 原组件名称、分类、用途 |
| [component.md](component.md) | 根据表达目的选择组件 |
| [docs/LEGACY-CATALOG.md](docs/LEGACY-CATALOG.md) | Composition ID、props、源码位置 |
| [schemas/legacy-catalog.json](schemas/legacy-catalog.json) | 机器可读的 props Schema |
| [component-readme.md](component-readme.md) | 每个视觉组件和模板的框图说明 |
| [MIGRATION.md](MIGRATION.md) | 更名、移动与历史兼容 |

默认展示内容主要来自 Airbnb 示例。正式节目应明确传入自己的数据、文案、期间和来源，不能只改标题。

### 4.2 在 React 中使用

例如在 `src/` 下创建自己的场景：

```tsx
import React from "react";
import { HeroMetric } from "./scenes/metrics/HeroMetric";

export const MyRevenueScene: React.FC = () => (
  <HeroMetric
    company="示例公司"
    label="全年营收 / 演示数据"
    value={128}
    prefix=""
    suffix="亿元"
    decimals={0}
    growth={12.8}
    period="FY2025"
    source="合成演示数据"
  />
);
```

在 `src/Root.tsx` 导入新场景，然后在现有返回内容中增加：

```tsx
<Composition
  id="MyRevenueScene"
  component={MyRevenueScene}
  width={1920}
  height={1080}
  fps={30}
  durationInFrames={210}
/>
```

这是加入现有 Root 的片段；需要补上 MyRevenueScene 的 import。`210 / 30 = 7` 秒。

多个原组件可通过 Remotion Sequence 编排。原场景通常已包含全屏画布，未经调整不能直接当作小卡片并排放进同一屏。

### 4.3 独立渲染原组件

保存 `hero.props.json`：

```json
{
  "company": "示例公司",
  "label": "全年营收 / 演示数据",
  "value": 128,
  "prefix": "",
  "suffix": "亿元",
  "decimals": 0,
  "growth": 12.8,
  "period": "FY2025",
  "source": "合成演示数据"
}
```

```bash
pnpm exec remotion render src/index.ts Metric-HeroMetric out/hero.mp4 --props=hero.props.json
```

这里输入的是原组件 props，不是 Episode。此命令使用 Remotion CLI；仓库的 `pnpm render` 专门负责 FinanceEpisode，提供额外校验及配套文件导出。

### 4.4 把原组件放进 Episode

在 `scenes` 中加入：

```json
{
  "id": "legacy-revenue",
  "type": "legacy",
  "title": "全年营收",
  "duration": 7,
  "sourceIds": ["demo"],
  "component": "Metric-HeroMetric",
  "props": {
    "company": "示例公司",
    "label": "全年营收 / 演示数据",
    "value": 128,
    "prefix": "",
    "suffix": "亿元",
    "decimals": 0,
    "growth": 12.8,
    "period": "FY2025",
    "source": "合成演示数据"
  }
}
```

外层 Episode 需要定义 `id: "demo"` 的来源。`component` 是 Composition ID，`props` 保持原接口。

legacy 保留全屏布局，不套原生 SceneFrame；画面内标题和来源要通过原组件支持的 props 明确设置。品牌 Provider 会传递 CSS 变量，但旧组件的固定字号、布局、部分边框和独立动画不会全部变成原生模板行为。

## 5. 用 Episode JSON 制作完整视频

### 5.1 可直接校验的节目

保存为项目根目录的 `episode.json`。全部数字为合成演示数据，总时长 34 秒。

```json
{
  "version": "2.0",
  "title": "收入增长，为什么利润没有同步增长？",
  "format": "landscape",
  "fps": 30,
  "locale": "zh-CN",
  "isDemo": true,
  "brand": {
    "preset": "newsroom",
    "name": "我的商业频道",
    "marketColors": "international",
    "overrides": {
      "typography": { "font": "mono" }
    }
  },
  "sources": [
    {
      "id": "demo",
      "label": "合成经营数据",
      "detail": "单位：亿元；用于说明节目结构，不代表真实公司。"
    }
  ],
  "scenes": [
    {
      "id": "opening",
      "type": "opener",
      "title": "收入增长，\n利润为什么没跟上？",
      "tagline": "先拆收入，再看成本。",
      "duration": 4,
      "narration": "收入增长，利润为什么没跟上？"
    },
    {
      "id": "revenue",
      "type": "hero",
      "title": "全年收入达到 120 亿元",
      "duration": 6,
      "sourceIds": ["demo"],
      "metric": {
        "label": "全年收入",
        "value": 120,
        "suffix": "亿元",
        "decimals": 0,
        "change": 20,
        "changeLabel": "同比"
      },
      "narration": "合成数据中，全年收入一百二十亿元，同比增长百分之二十。"
    },
    {
      "id": "segments",
      "type": "bars",
      "title": "业务 A 是最大的收入来源",
      "duration": 7,
      "sourceIds": ["demo"],
      "unit": "亿元",
      "orientation": "horizontal",
      "data": [
        { "label": "业务 A", "value": 60, "highlight": true },
        { "label": "业务 B", "value": 35 },
        { "label": "业务 C", "value": 25 }
      ]
    },
    {
      "id": "profit-bridge",
      "type": "waterfall",
      "title": "120 亿元收入，最终留下 15 亿元利润",
      "duration": 8,
      "sourceIds": ["demo"],
      "unit": "亿元",
      "data": [
        { "label": "收入", "value": 120, "kind": "total" },
        { "label": "直接成本", "value": -65, "kind": "delta" },
        { "label": "经营费用", "value": -40, "kind": "delta" },
        { "label": "经营利润", "value": 15, "kind": "total" }
      ],
      "note": "120 − 65 − 40 = 15；这里只展示当期拆解，不能据此推断同比变化原因。"
    },
    {
      "id": "conclusion",
      "type": "takeaway",
      "title": "收入和利润要分别解释",
      "duration": 5,
      "sourceIds": ["demo"],
      "body": "解释增长质量，需要同时观察收入结构、成本与费用。",
      "action": "下一步：补齐上年同期口径，比较成本率和费用率。"
    },
    {
      "id": "references",
      "type": "sources",
      "title": "数据来源与说明",
      "duration": 4,
      "sourceIds": ["demo"]
    }
  ]
}
```

### 5.2 从 JSON 到视频

```bash
pnpm validate episode.json
pnpm export:plan episode.json out/my-episode
pnpm stills episode.json out/my-episode-stills
pnpm render episode.json out/my-episode-draft.mp4 --draft
pnpm render episode.json out/my-episode.mp4
```

检查帧用于核对静态信息，草稿视频用于核对入场、切换和节奏。两者都不能替代数据核对。

### 5.3 每一期主要改什么

| 修改内容 | 位置 |
| --- | --- |
| 镜头选择和顺序 | scenes 数组 |
| 标题、数据、解释 | 对应 scene 字段 |
| 时长 | scene.duration，单位秒 |
| 统一外观 | brand |
| 来源 | sources 与 sourceIds |
| 旁白文稿 | scene.narration |
| 实际声音 | audio |
| 屏幕字幕 | captions |

日常换内容通常只改 JSON；增加图形或特殊布局时才改 React。

## 6. Workbench 使用指南

### 6.1 界面区域

| 区域 | 操作 |
| --- | --- |
| 顶栏 | 导入 JSON、导出分镜 |
| 左侧节目分镜 | 选择、上移、下移、复制、删除 |
| 中间预览 | 播放实际画面，切换画幅和预览范围 |
| 当前分镜信息 | 修改时长 |
| 下方分镜条 | 按时间跳到镜头 |
| 频道样式 | 名称、主题、颜色、字体、圆角、动效、涨跌惯例 |
| 分镜数据 | 编辑整份 Episode JSON、校验并应用 |
| 模板库 | 搜索并添加 24 种原生模板 |

### 6.2 操作顺序

1. 启动工作台，导入 Episode；或载入示例后修改。
2. 在频道样式中选择主题、设置频道名称。
3. 在模板库添加镜头。新增镜头带演示数据，需要替换。
4. 在分镜数据中修改数据、文案和来源，点击「校验并应用」。
5. 调整顺序和时长，切到整片预览。
6. 导出分镜，保存 episode.json。
7. 在项目根目录运行渲染命令。

当前没有独立的「新建空白节目」按钮，可以从最小 Episode 开始；至少保留一个镜头。

### 6.3 导入与导出

- 顶栏导入支持原始 Episode、`{ "episode": ... }` 包装、独立 brand.json。
- 独立 brand.json 是包含 preset 的品牌对象，不需要再包一层 brand。
- 分镜数据编辑框使用原始 Episode，不使用 `{ "episode": ... }` 包装。
- 文件导入上限为 2 MB。
- 导出分镜下载 Episode；导出频道样式只下载 brand.json。
- 素材需另行放入项目 public；导入 JSON 不会上传或复制素材。

### 6.4 保存、主题切换和预览

草稿存于当前浏览器、当前站点的 localStorage，不会自动写回磁盘 JSON，也不会跨设备同步。换浏览器、换端口或清理站点数据后，可能看不到原草稿；正式保存请导出。

工作台切换品牌预设时保留显式 typography，其他颜色、形状、留白、动效覆盖会重新取新预设。尝试不同预设前，先导出自己的 brand.json。

当前分镜模式只预览当前镜头，并关闭整期字幕和音轨；整片预览用于核对声音、字幕和完整编排。

通过工作台分镜按钮和时长输入修改节目，会让字幕随镜头移动或缩放，但不会剪辑或拉伸旁白音频。直接在 JSON 中修改顺序、时长，也不会自动执行字幕调整，需要自行校准。

## 7. Episode 协议与字段

运行时定义：[src/program/schema.ts](src/program/schema.ts)。机器接口：[schemas/episode.schema.json](schemas/episode.schema.json)。跨字段规则：[src/program/validate.ts](src/program/validate.ts)。

### 7.1 顶层字段

| 字段 | 说明 |
| --- | --- |
| version | 固定字符串 `"2.0"`，是协议版本而非 package 版本 |
| title | 节目标题，1–100 字符 |
| description | 可选说明，最多 500 字符 |
| format | landscape、portrait、square；默认 landscape |
| fps | 24、25、30、60；默认 30 |
| locale | zh-CN、en-US、ja-JP；默认 zh-CN |
| isDemo | 默认 false；true 会显示演示标记 |
| brand | 品牌配置，可使用默认品牌 |
| sources | 全节目来源，最多 100 条 |
| scenes | 按播放顺序排列的 1–150 个镜头 |
| ticker | 可选行情条，最多 8 项 |
| captions | 整期字幕，最多 2000 条 |
| audio | 可选旁白、音乐、音量 |

| format | 输出尺寸 |
| --- | --- |
| landscape | 1920 × 1080 |
| portrait | 1080 × 1920 |
| square | 1080 × 1080 |

locale 不会自动翻译文案，也不保证所有固定标签随之翻译。多语言节目需要准备对应文案并核对字形。

### 7.2 镜头公共字段

| 字段 | 说明 |
| --- | --- |
| id | 唯一标识，1–64 字符；复制时也要换 ID |
| type | 如 hero、bars、quote、legacy |
| title | 最多 84 字符；超过 48 字符会提示检查换行 |
| duration | 2–120 秒，默认 7 秒 |
| kicker | 可选眉题，最多 50 字符 |
| subtitle | 可选副标题，最多 150 字符 |
| sourceIds | 来源 ID，每镜头最多 8 个 |
| note | 可选注释，最多 180 字符 |
| narration | 可选旁白文稿，最多 1800 字符 |
| transition | cut、fade、slide，默认 fade |
| lowerThird | 可选人物姓名条，含 name、role |

转场是在新镜头起点执行入场，镜头按时长顺接，不存在两个镜头重叠的交叉溶解时段。总时长为所有 duration 之和。

### 7.3 常用结构

一个 Metric：

```json
{
  "label": "营业收入",
  "value": 120,
  "prefix": "",
  "suffix": "亿元",
  "decimals": 1,
  "change": 20,
  "changeLabel": "同比",
  "note": "与上年同期同口径"
}
```

value 必须是有限数值；decimals 为 0–3。`change: 20` 表示 20%，不是 0.20。如果指标本身是 12.5%，填写 `value: 12.5`、`suffix: "%"`。

一个来源：

```json
{
  "id": "company-report",
  "label": "公司年度报告 / 实际文件名",
  "detail": "页码、表名、单位、调整口径"
}
```

可选 url 和 date。date 是有效的 YYYY-MM-DD。内部文件可以作为来源，不必编造公开网址。

一个常规图表数据点：

```json
{ "label": "业务 A", "value": 60, "highlight": true }
```

### 7.4 校验边界

| 层 | 实现 | 能发现什么 |
| --- | --- | --- |
| 字段类型 | Zod / JSON Schema | 字段名、枚举、长度、容量、数值类型 |
| 节目语义 | validateEpisode | 来源、重复 ID、字幕时序、瀑布勾稽、趋势数组对齐 |
| 本地素材 | CLI checkAssets | 原生素材是否存在、是否处于 public 内 |
| 画面与事实 | 预览、人工核对 | 裁切、可读性、单位、真实出处和论点 |

大多数对象严格校验，多余字段也报错。Schema 通过不表示数值真实、证据支持所有论点，或任意长文案都能正常排版。

Workbench 做结构和语义校验，磁盘素材存在性还需 CLI 和实际播放确认。旧组件 props 中的特殊素材也需按组件检查。

## 8. 24 种节目模板怎么选

这些是 scene.type，不是 24 个同名 React 导出。内容实现主要在 [SceneContent.tsx](src/broadcast/SceneContent.tsx)，图表绘制在 [charts.tsx](src/broadcast/charts.tsx)。

以下只列专有字段，公共字段见上一节。`?` 表示可选；有默认值的字段另行注明。

| type | 用途 | 专有字段与容量 |
| --- | --- | --- |
| opener | 片头、问题或结论开场 | episode?、tagline? |
| chapter | 章节转场 | number、summary? |
| headline | 焦点头条 | body、metric?；label 默认「焦点」 |
| news-grid | 新闻简报 | items：2–4 项，各含 category、headline、summary |
| hero | 一个核心数字 | metric |
| kpis | 指标看板 | items：1–6 个 Metric |
| bars | 类别规模比较 | data：1–8 项；unit 默认空；orientation 默认 horizontal |
| ranking | 数值排名 | data：1–8 项；unit 默认空；数值降序 |
| trend | 时间趋势和预测标记 | labels：2–120；series：1–4；unit 默认空、zeroBaseline 默认 false、forecastFrom? |
| waterfall | 起点到终点拆解 | data：2–8 项，含 label、value、kind；unit 默认空 |
| donut | 整体组成 | data：2–6 项；unit 默认空；centerLabel 默认「构成」 |
| table | 精确明细 | columns：2–5；rows：1–7；highlightRow? |
| earnings | 财报快照 | company、period、items：2–4 个 Metric、guidance |
| scenario | 三种情景 | scenarios 恰好 3 项，含 name、value、assumption；unit 默认空 |
| comparison | 双边观点或状态 | left、right 各含 label、headline、points；每侧 1–4 条 |
| quote | 人物引述 | quote、author、role? |
| timeline | 事件时间线 | events：2–5 项，含 date、title、body? |
| equation | 商业公式 | terms：2–4 项，含 label、value；operators：1–3；explanation? |
| bullets | 逐条解释 | items：1–5 项，含 title、body? |
| takeaway | 核心结论与观察项 | body、action? |
| media | 图片与图像证据 | asset、caption；fit 默认 contain，可选 cover |
| presenter | 主持人分屏 | asset、points：1–4；mediaType 默认 image，可选 video |
| sources | 来源索引 | heading?；用公共 sourceIds 选本页来源 |
| endcard | 片尾 | message、nextTitle?、handle? |

另有适配类型 legacy，字段为 component、props。因此协议有 25 个 type，原生节目模板有 24 种。

完整例子见 [examples/template-gallery.json](examples/template-gallery.json)，不要只凭名字猜字段。

### 8.1 按表达目的选择

| 问题 | 首选 | 专业原组件 |
| --- | --- | --- |
| 最重要的数字 | hero | HeroMetric、ShareMetric |
| 谁更大、差多少 | bars / ranking | DumbbellChart、SlopeChart、TornadoChart |
| 这些年怎么变 | trend | AnnotatedLineChart、IndexedLineChart、EventStudyChart |
| 利润或现金怎么拆 | waterfall | WaterfallChart、UnitEconomicsDiagram |
| 总量由什么构成 | donut | TreemapChart、MarimekkoChart、StackedBarChart |
| 钱或用户流向哪里 | 原组件 | SankeyDiagram、FlowDiagram |
| 什么因素驱动结果 | equation / bullets | MetricDriverTree、CausalGraph |
| 谁持有或控制谁 | 原组件 | OwnershipTree、OrganizationTree |
| 分布、风险和群体结构 | 原组件 | Histogram、BoxPlot、PopulationPyramid、RiskMatrix |
| 未来不确定性 | scenario | ForecastFanChart、RangeBandChart |

原生 trend 支持预测起点、虚线和预测区域标记，没有上下置信界字段。需要扇区或区间带时，使用对应原组件或新增模板。

## 9. 数据图表的输入规则

### 9.1 单位、增速和缺失值

- 比较前统一币种、期间、名义/实际口径、量纲。
- 金额先转换到同一单位，例如全部为亿元，再设置 unit。
- 利润率从 10% 到 12%，是增加 2 个百分点，也是相对增加 20%。
- Metric.change 与 ticker.change 按百分比显示。百分点差异用独立指标的 `suffix: "个百分点"` 或注释。
- trend 中未知值使用 null；其他图表不能一概传 null，更不能把未知值补零。

### 9.2 趋势图

下面的镜头可放进含 demo 来源的演示 Episode：

```json
{
  "id": "trend-example",
  "type": "trend",
  "title": "观察值与预测值分开呈现",
  "duration": 7,
  "sourceIds": ["demo"],
  "unit": "亿元",
  "labels": ["2022", "2023", "2024", "2025", "2026E"],
  "series": [
    { "name": "业务 A", "values": [70, 82, null, 105, 120] },
    { "name": "业务 B", "values": [45, 52, 61, 66, 72] }
  ],
  "zeroBaseline": false,
  "forecastFrom": 4,
  "note": "合成演示；2026E 为假设，不代表实际预测。"
}
```

values 长度要与 labels 一致，每组至少一个非空值。forecastFrom 使用从 0 开始的索引，但最小为 1；上例 4 指第 5 个标签。

横轴按顺序等距排列，不解析日期的真实间隔。不规则时间点应先重采样，或使用表格、类别比较。

### 9.3 瀑布图

total 是从零开始的总量，delta 是对当前累计值的增减。首项必须是 total，建议末项也是 total。

例如 100 → 增加 30 → 减少 20 → 最终 110。后续每个 total 都必须与当前累计值一致。delta 自带正负号。

### 9.4 占比、排序和表格

- donut 各项非负，总和大于零。按各项占总和计算份额，不要求输入总和恰好为 100。
- ranking 按数值降序绘制，输入顺序不等于名次。
- bars 支持负数并包含零基线；窄画幅下可能改为横向布局。
- table 每行长度等于表头长度；highlightRow 从 0 开始。
- 竖屏表格超过 3 列会提示。未超 Schema 容量，也可能因文案过长而需要拆页。

### 9.5 来源和事实状态

生产内容使用 isDemo false。数据类、引述类及部分新闻镜头缺 sourceIds 会被拒绝；其他包含事实的镜头也应主动附来源。

所有 sourceIds 必须存在。挂上来源 ID 不会自动证明该来源支持全部文案，作者仍要核对数字、引语和推论。

## 10. 如何设计一期财经节目

以下是编辑建议，不是渲染器硬性规则。

### 10.1 先确定问题，再选图

先用一句话说明观众看完要理解什么，再为每个论点选择镜头。

| 顺序 | 观众要知道什么 | 建议镜头 |
| --- | --- | --- |
| 1 | 今天的问题 | opener |
| 2 | 关键变化有多大 | hero / headline |
| 3 | 来自哪些业务 | bars / trend |
| 4 | 收入如何变利润 | waterfall |
| 5 | 还有哪些解释 | comparison / bullets |
| 6 | 结论、限制和观察项 | takeaway |
| 7 | 数据从哪里来 | sources |
| 8 | 收尾或下期预告 | endcard |

### 10.2 一镜头一个主要任务

优先安排一句结论、一个证据主体、一条必要说明。把完整研究表直接放进画面，通常会同时失去可读性和节奏。

标题可以写「云业务贡献了新增收入的主要部分」，而不只写「收入分析」。这种判断需要相邻证据支持。

### 10.3 节奏与密度

先按每镜头 5–9 秒规划，再按实际配音调整。片头和章节卡可短一些，复杂关系图、表格通常更久。

中文初稿可用每秒约 3–4 字、英文每分钟约 130–160 词估算。这只是策划参考，最终以真实音轨为准。

需要长时间阅读的表格，先用强调色或独立镜头指出关键行。主线应在正常播放中可以理解。

### 10.4 常用节目组合

| 形式 | 建议组合 |
| --- | --- |
| 财报快评 | opener → earnings → trend → waterfall → takeaway → sources |
| 市场简报 | headline → kpis → news-grid → ranking → takeaway |
| 公司深度 | opener → timeline → bars → legacy 关系图 → comparison → scenario → takeaway |
| 宏观比较 | opener → trend → ranking → table → comparison → takeaway |
| Shorts | opener → hero → bars 或 waterfall → takeaway → endcard |

同一系列固定包装、标题层级、数字精度和涨跌惯例，通过内容和图形选择形成变化。无需一期用遍所有模板。

## 11. 如何统一设计自己的频道样式

### 11.1 三个样式入口

| 对象 | 入口 | 范围 |
| --- | --- | --- |
| 某频道或某期节目 | brand / brand.json | 当前 Episode |
| 共用预设 | src/brand/presets.ts | 使用该预设的节目 |
| 原组件默认系统 | src/style/theme.ts、src/style/index.css | 原组件和相关基础工具 |

字体族和回退统一在 src/style/fontFamilies.ts，加载在 src/style/fonts.ts。

先改 brand.json，长期复用后再考虑增加预设。组件内部尽量读取统一颜色和字体。

### 11.2 8 套预设

| preset | 名称 | 视觉方向 | 适合内容 |
| --- | --- | --- | --- |
| editorial | 财经编辑 | 暖纸、深墨、青柠、直角、硬阴影 | 商业解释 |
| newsroom | 午夜新闻 | 午夜蓝、琥珀、小圆角 | 新闻、市场周报 |
| terminal | 市场终端 | 深绿、网格、绿色强调 | 行情、量化 |
| journal | 经济周刊 | 暖纸、砖红、平面排版 | 宏观、研究 |
| cobalt | 科技商业 | 深蓝、青柠、大圆角 | 科技、产业 |
| documentary | 深度纪录 | 炭黑、克制金色 | 公司深度 |
| minimal | 极简研究 | 白蓝、轻边框、大圆角 | 机构、财务汇报 |
| signal | 焦点快讯 | 黑白红、直角 | 焦点新闻 |

当前所有预设默认保留 IBM Plex Mono 主字体，中文缺字回退 Noto Sans SC。配色预设不等于自动更换字体。

### 11.3 可复用的 brand.json

下面可直接保存为 brand.json，从 Workbench 顶栏导入；或整体放入 Episode.brand。

```json
{
  "preset": "newsroom",
  "name": "深度商业观察",
  "marketColors": "international",
  "overrides": {
    "colors": {
      "background": "#0B1727",
      "surface": "#12243A",
      "foreground": "#F1F5FA",
      "muted": "#A8B7C9",
      "line": "#304761",
      "accent": "#F6C667",
      "onAccent": "#132137",
      "positive": "#63D9AB",
      "negative": "#FF897D",
      "series": ["#F6C667", "#63BCD8", "#9D9AF1", "#73CAA3"]
    },
    "typography": { "font": "mono", "titleScale": 1 },
    "shape": { "radius": 8, "border": 1, "shadow": false },
    "layout": { "padding": 72, "grid": false },
    "motion": "calm"
  }
}
```

只填要改的字段即可。颜色必须为六位十六进制，不能用三位、rgba 或颜色名。

### 11.4 tokens 速查

| token | 用途与约束 |
| --- | --- |
| colors.background | 全屏背景 |
| colors.surface | 卡片和面板 |
| colors.foreground | 主文字 |
| colors.muted | 次要文字 |
| colors.line | 边线、网格 |
| colors.accent | 强调与重点项 |
| colors.onAccent | 强调底色上的文字 |
| colors.positive / negative | 涨跌语义色 |
| colors.series | 3–8 色；覆盖时替换整个数组 |
| typography.font | mono、sans、serif |
| typography.titleScale | 0.8–1.15，只影响已接入标题 |
| shape.radius | 0–40 |
| shape.border | 0–4 |
| shape.shadow | true / false |
| layout.padding | 48–96 |
| layout.grid | true / false |
| motion | calm / editorial / energetic / none |

resolveBrand 先取预设，再合并颜色、排版、形状、布局与 motion。Provider 为当前节目设置变量，不修改全局预设。

marketColors china 在合并后交换 positive / negative。自定义涨跌色时，先按 international 方向配置，再选择是否交换，避免重复处理。

### 11.5 原组件如何接入

原组件优先用 theme 常量或 bg-paper、text-ink、bg-yellow 等语义类：

| 原语义 | 品牌变量 |
| --- | --- |
| paper | --fm-paper |
| white / surface | --fm-surface |
| ink | --fm-ink |
| muted | --fm-muted |
| yellow / accent | --fm-accent |
| 字体 | --fm-font |
| 圆角、阴影 | --fm-radius、--fm-shadow；仅在已接入处生效 |

独立 Studio 原组件没有 Episode 品牌上下文，使用原设计默认值。要按频道预览，放入带 brand 的 Episode，或在自己的编排中加 BrandProvider。

统一颜色不等于统一所有布局。旧组件固定的字号、尺寸、部分阴影与动画仍由自身实现决定；需要精确统一时，把这些具体位置改为读取 tokens。

### 11.6 设计频道的顺序

1. 确定背景和主文字，检查可读性。
2. 固定主字体和少量字重。
3. 明确强调色的用途。
4. 固定系列色，同一对象跨镜头保持一致。
5. 固定形状、边框、阴影与留白。
6. 固定单位、精度、增速和来源的排版。
7. 先检查 hero、trend、table、presenter，再应用整片。

Workbench 只暴露常用控制项，完整 tokens 在 JSON 中设置。motion 主要作用于读取 useSceneMotion 的原生内容，不会统一控制所有旧组件、行情滚动和转场。

## 12. 字体的使用、修改与恢复

### 12.1 默认字体

| 键 | 字体栈 |
| --- | --- |
| mono | IBM Plex Mono → Noto Sans SC → monospace |
| sans | Noto Sans SC → Helvetica Neue / Arial → sans-serif |
| serif | Georgia → Noto Sans SC → serif |

IBM Plex Mono 和 Noto Sans SC 从本地加载。Georgia 依赖系统，不随项目打包。

| 文件 | 职责 |
| --- | --- |
| public/fonts/IBMPlexMono-Regular.woff2 | 原 IBM Plex Mono 400 |
| public/fonts/IBMPlexMono-SemiBold.woff2 | 原 IBM Plex Mono 600 |
| src/assets/index.ts | 原字体路径 |
| src/style/fontFamilies.ts | 字体名、默认键、回退 |
| src/style/fonts.ts | 注册与等待字体加载 |
| src/brand/presets.ts | 各预设默认 typography |

显示不对时，先检查 Episode 或 brand.json 中是否显式写了 sans / serif。恢复原主字体可把 brand.overrides 内的 typography 设置为：

```json
{ "typography": { "font": "mono" } }
```

旧 JSON 中的显式字体值会覆盖当前默认值。

### 12.2 添加自己的字体

1. 文件放入 public/fonts。
2. 在 fonts.ts 的加载流程注册 family、weight 和路径。
3. 在 fontFamilies.ts 更新字体栈与回退。
4. 要增加配置键时，同步 brand/schema.ts、Workbench 选项及类型。
5. 生成 Schema，检查数字、中英文、负号和日文字形。

只改 family 名不会加载文件；只放文件也不会注册字体。日文冷僻字和特殊符号应单独核对覆盖。

### 12.3 从 Git 找回字体文件

```bash
git log --oneline -- public/fonts/ src/style/fonts.ts src/style/theme.ts
```

找到正确提交后，将 GOOD_COMMIT 替换为实际提交号：

```bash
git restore --source=GOOD_COMMIT -- public/fonts/IBMPlexMono-Regular.woff2 public/fonts/IBMPlexMono-SemiBold.woff2
```

再检查当前路径、注册 family 和 brand.overrides 的 font。文件仍在但显示不对时优先改配置。单独恢复旧 fonts.ts 可能与当前 useFonts 接口不兼容，需要核对调用方。

## 13. 图片、视频、旁白、音乐与字幕

### 13.1 素材路径

| 文件 | JSON 引用 |
| --- | --- |
| public/images/screenshots/report.png | images/screenshots/report.png |
| public/images/photos/presenter.jpg | images/photos/presenter.jpg |
| public/video/presenter.mp4 | video/presenter.mp4 |
| public/audio/voiceover.wav | audio/voiceover.wav |
| public/audio/music.mp3 | audio/music.mp3 |
| public/images/logos/channel.svg | images/logos/channel.svg |

原生素材路径不带 public/，不以斜线开头，不含 URL、`..`、反斜线或盘符。来源 url 是资料链接，与素材路径用途不同。

素材始终相对项目 public，而非相对 JSON 目录。

### 13.2 图片与主持人

media 用于图片和图像证据。fit contain 保留完整内容，cover 可能裁切。

presenter 通过 mediaType 选择 image / video。视频静音，声音放在独立 audio.voiceover。姓名条用公共 lowerThird。

素材存在不等于能正确解码，应以实际预览和渲染确认。

### 13.3 旁白与音乐

在 Episode 顶层加入：

```json
{
  "audio": {
    "voiceover": "audio/voiceover.wav",
    "music": "audio/music.mp3",
    "voiceVolume": 1,
    "musicVolume": 0.12
  }
}
```

旁白从整期起点播放；音乐循环，在开头与结尾约 1 秒淡入淡出。当前没有逐镜头音轨起点、自动闪避、TTS 或声音时长匹配。

narration 不自动变声音。先导出文稿，用自己的配音流程生成音轨，再按实际声音调整镜头时长。

### 13.4 字幕

顶层 captions 示例：

```json
{
  "captions": [
    { "start": 0, "end": 2.4, "text": "收入增长，利润为什么没跟上？" },
    { "start": 2.4, "end": 4, "text": "我们先看业务，再看成本。" }
  ]
}
```

时间为整期秒数。结束晚于开始，顺序排列、不重叠、不超总时长。字幕显示在画面中，存在时也会导出 SRT。

```bash
pnpm captions:import input.srt episode.json out/episode-with-captions.json
pnpm validate out/episode-with-captions.json
```

字幕导入拒绝覆盖已存在的输出文件，需要使用新文件名。

### 13.5 行情条与 logo

顶层 ticker：

```json
{
  "ticker": [
    { "label": "示例指数", "value": "12,345", "change": 1.2 },
    { "label": "示例汇率", "value": "150.20", "change": -0.4 }
  ]
}
```

value 为已格式化字符串，change 为百分比数值。条目循环滚动。频道 logo 用 brand.logo 指向 public 内文件。

## 14. 预览、检查帧与正式渲染

### 14.1 操作与输出

| 操作 | 结果 |
| --- | --- |
| pnpm dev | 实际组件与节目预览 |
| pnpm workbench | 可编辑 Episode 的预览 |
| pnpm stills | 每镜头一张半尺寸 PNG |
| render --draft | 完整时长、半尺寸、高压缩视频 |
| render | 完整尺寸视频 |
| pnpm build | Remotion 网页资源 bundle，不是视频 |
| pnpm workbench:build | 工作台静态页面，不是视频 |

检查帧取镜头开始约 2.5 秒后的画面，短镜头取最后一帧；仅采样一帧，不证明全部入场与切换都正确。

### 14.2 输出命令

```bash
# 正式 MP4
pnpm render episode.json out/episode.mp4

# 草稿，横屏通常为 960 × 540
pnpm render episode.json out/episode-draft.mp4 --draft

# 降低并发
pnpm render episode.json out/episode-low-concurrency.mp4 --concurrency=1

# 明确替换现有视频
pnpm render episode.json out/episode.mp4 --overwrite

# ProRes HQ 编辑母版
pnpm render episode.json out/episode-master.mov --prores
```

默认并发 2，可设 1–16。MP4 使用 H.264、CRF 18、yuv420p；草稿 CRF 26、0.5 倍尺寸。ProRes 使用 HQ、yuv422p10le，扩展名必须为 .mov，当前不输出透明通道。

实际画幅由 Episode.format 决定。

### 14.3 配套文件

| 文件 | 何时导出 | 内容 |
| --- | --- | --- |
| episode.mp4 / mov | 渲染成功 | 视频 |
| episode.props.json | 渲染成功 | 包装后的 `{ "episode": ... }` |
| episode.storyboard.json | 渲染成功 | 镜头起止、类型、标题、旁白和来源 |
| episode.narration.md | 有 narration | 按镜头排列的文稿 |
| episode.srt | 有字幕 | 外置字幕 |

配套文件按同一前缀写入。想保留旧版计划也要换前缀。删除所有字幕或旁白后，不要把旧目录遗留的同名文件当成本次新产物。

### 14.4 Episode 与 Remotion props

- 仓库 Episode CLI 支持原始 Episode 和 episode 包装。
- 直接调 FinanceEpisode Composition，props 要有 episode 包装。
- 直接调原组件，props 是该组件自己的参数。

```bash
pnpm export:plan episode.json out/episode
pnpm exec remotion render src/index.ts FinanceEpisode out/direct.mp4 --props=out/episode.props.json
```

直接 CLI 不自动执行仓库 render.ts 的全部校验及配套文件导出。

## 15. 让 AI 根据数据自动生成视频

### 15.1 skill 与参考资料

项目附带 [finance-video-producer](.agents/skills/finance-video-producer/SKILL.md)。当前 AI 环境若已安装，可按 `$finance-video-producer` 调用；其他环境按自己的加载机制安装或读取。项目不会自动启动模型服务。

| 资料 | 用途 |
| --- | --- |
| [docs/AI-WORKFLOW.md](docs/AI-WORKFLOW.md) | 资料到节目流程 |
| [scene-guide.md](.agents/skills/finance-video-producer/references/scene-guide.md) | 模板选择与数据组织 |
| [brand-guide.md](.agents/skills/finance-video-producer/references/brand-guide.md) | 品牌约定 |
| [episode.schema.json](schemas/episode.schema.json) | 机器输入协议 |
| [template-gallery.json](examples/template-gallery.json) | 完整字段例子 |

### 15.2 给 AI 什么

| 输入 | 建议 |
| --- | --- |
| 问题 | 观众看完应理解什么 |
| 数据 | CSV、JSON、表格、财报、笔记、脚本 |
| 口径 | 单位、币种、期间、名义/实际、范围、预测状态 |
| 来源 | 文件名、页码、链接、日期 |
| 输出 | 语言、画幅、时长、MP4 / 母版 |
| 品牌 | 已保存的 brand.json 或预设 |
| 声音 | 音轨、SRT，或只要文稿与无声画面 |

### 15.3 可复制的指令

```text
使用 $finance-video-producer 和这个 Finance Motion 项目。

根据我提供的数据制作中文财经解说：
- 问题：收入增长，为什么利润没有同步增长？
- 时长目标：60–90 秒。
- 画幅：16:9，30 fps。
- 品牌：优先使用我给的 brand.json，否则 newsroom。
- 字体：保留原 IBM Plex Mono，中文缺字用回退字体。

先整理事实、口径、来源，用代码计算增速、占比和勾稽。
按结论、证据、解释、限制、观察项组织，每镜头一个主要任务。
从现有模板和组件选择，不要为这一期重写整套组件。
读取 schemas/episode.schema.json 和 examples/template-gallery.json，
生成可校验的 episode.json，不要猜字段。

交付事实表、分镜、旁白、episode.json、brand.json、检查帧、MP4。
没提供音轨时先出无声视频，区分文稿和实际声音。
不编造来源、引语、缺失值或预测。
报告实际完成的校验、预览和渲染结果。
```

### 15.4 接自己的模型流水线

可以用自己的 DeepSeek、OpenRouter 或其他模型生成 JSON，再调用同一本地接口：

1. 清洗资料，形成带单位、期间、来源 ID 的事实表。
2. 代码计算派生指标，区分事实、估计、假设和推论。
3. 参考当前 Schema 和示例生成 Episode。
4. 运行 validate，按明确报错修复。
5. 导出计划和检查帧，拆分过密镜头。
6. 校准声音、字幕并渲染。

模型调用在上游，视频项目接收数据与素材。不要把 API key 放进 Episode。

## 16. 扩展组件、模板和样式

### 16.1 选对修改层

| 需求 | 位置 |
| --- | --- |
| 换内容 | episode.json |
| 建频道外观 | brand.json |
| 改旧组件默认字号、间距 | 原设计系统及受影响组件 |
| 加特殊全屏图形 | src/scenes，注册 Composition |
| 让 AI 用 JSON 调新图形 | 新增 scene.type，或注册后用 legacy |
| 加工作台控制项 | studio/Workbench.tsx、Schema |
| 改通用几何或动画 | src/lib、broadcast/charts 或专用组件 |

### 16.2 新增原组件

1. 在语义目录新建组件，例如 src/scenes/charts 下。
2. 定义 props，让数据可替换。
3. 复用 Frame、SceneHeader、Source、图例、结构图工具。
4. 使用统一主题的颜色与字体。
5. 若要加入原组件目录及 legacy，在 src/showcase/compositions.ts 用 withProps 注册，给出默认样例和时长。
6. 按需同步 index.ts 导出，保留现有 Composition ID。
7. 运行 pnpm catalog 更新 props Schema 与参数目录。
8. 用长标题、负数、大数字、较多项目检查布局。

只在 Root 注册一个临时 Composition，不会自动进入 catalog 扫描；它扫描的是 src/showcase/compositions.ts。

### 16.3 新增原生模板

| 文件或步骤 | 内容 |
| --- | --- |
| src/program/schema.ts | 增加 discriminated union 类型与字段 |
| src/program/validate.ts | 增加语义、容量、来源等规则 |
| src/broadcast/SceneContent.tsx | 增加 case 和布局 |
| src/broadcast/charts.tsx | 按需增加绘图原语 |
| src/program/catalog.ts | 名称、分组、用途 |
| examples/template-gallery.json | 工作台添加镜头所用的完整示例 |
| pnpm schema | 重建 Episode、品牌 Schema |
| pnpm catalog | 更新目录 |
| 文档、skill 参考 | 同步字段与选择方法 |

原生内容置于 SceneFrame 内容区，不再嵌套旧的全屏 Frame；品牌、来源、页眉由外层处理。

### 16.4 增加品牌预设

最轻的方式是保存 brand.json，不增加枚举。

要作为工作台正式预设出现：

1. 在 brand/schema.ts 增加 preset 键。
2. 在 brand/presets.ts 增加 presets 与 presetLabels。
3. 沿用默认字体，除非明确需要换字体。
4. 检查 Root 预览和工作台能读取它。
5. 重建 Schema，检查亮暗背景与多系列图表。
6. 更新界面和文档中写死的数量。

只加 presets 对象、不改 Schema，会让校验和类型不一致。

### 16.5 动画设计

正式动画由帧驱动，同一帧和输入应有同一画面。原组件常用 src/lib/motion.ts、chartMotion.ts；原生模板使用 useSceneMotion 与 Reveal。

模板内部示意片段：

```tsx
const motion = useSceneMotion();
const p = motion(0.2, 0.65);

return (
  <div
    style={{
      opacity: p,
      transform: `translateY(${(1 - p) * 20}px)`,
    }}
  >
    内容
  </div>
);
```

需从 broadcast/primitives 对应相对路径导入 hook。这里延迟、时长为秒；旧 fadeUp 等工具的 delay 通常是帧，不要混用。

正式视频避免依赖真实时间、无种子随机数、setInterval 或普通 CSS transition。component-readme 的 CSS / SVG 只是文档模拟。

### 16.6 改完怎么验证

```bash
pnpm lint
pnpm test
pnpm schema
pnpm catalog
pnpm validate examples/template-gallery.json
pnpm workbench:build
pnpm build
```

协议变化时校验新 JSON；布局变化时检查实际目标画幅的帧与动态片段。现有测试不能穷举所有数据组合。

新增组件或模板后，component-readme 生成脚本也需要同步描述与数量校验。

## 17. 目录结构与实现关系

| 路径 | 职责 |
| --- | --- |
| src/index.ts | 注册 Remotion Root |
| src/Root.tsx | Composition、Folder、动态尺寸、总帧数 |
| src/scenes | 原完整画面组件 |
| src/showcase/compositions.ts | 原组件 ID、默认 props、时长 |
| src/showcase/examples | 原组件示例数据 |
| src/showcase/reels | 合集视频 |
| src/components | 画布、标题、卡片等 |
| src/components/viz | 网格、图例、节点、树边 |
| src/lib | 动画、几何工具 |
| src/style | 原设计系统、字体、Tailwind 映射 |
| src/brand | 品牌 Schema、预设、对比度、Provider |
| src/program | Episode、语义校验、时间线、字幕、编排 |
| src/broadcast | 原生模板、图表和品牌基础组件 |
| src/assets | 原素材路径与注册工具 |
| src/spec | 早期 SceneSpec、兼容类型 |
| studio | Workbench、播放器与编辑逻辑 |
| scripts | 校验、导出、渲染、Schema 和目录生成 |
| examples | 节目与品牌示例 |
| schemas | 自动生成的机器协议资料 |
| public | 字体、图片、视频、音频 |
| .agents/skills/finance-video-producer | 配套 skill |
| tests | 实现测试 |
| docs | 参考资料 |
| out | 默认输出，已被 Git 忽略 |

### 17.1 一次渲染经过哪些步骤

| 顺序 | 实现 | 工作 |
| --- | --- | --- |
| 1 | scripts/io.ts | 读取、识别包装、校验、检查原生素材 |
| 2 | scripts/bundle-server.ts | 构建资源、临时本地服务 |
| 3 | src/Root.tsx | 计算 fps、画幅、总帧数 |
| 4 | program/Episode.tsx | 品牌、Sequence、覆盖层、音轨 |
| 5 | SceneContent / 原组件 | 按 type 或 legacy ID 生成内容 |
| 6 | Remotion renderer | 逐帧绘制并编码 |
| 7 | sidecars | props、分镜、存在时的旁白和字幕 |

src/spec/types.ts 中早期 hero-metric、quote-card 等不属于当前 Episode 协议。新节目使用 program/schema.ts 的 Episode / Scene，或兼容导出的 EpisodeSpec / ProgramSceneSpec。

## 18. 命令速查

都在项目根目录执行。

| 命令 | 作用 |
| --- | --- |
| pnpm install --frozen-lockfile | 安装锁定依赖 |
| pnpm dev | Remotion Studio |
| pnpm workbench | Workbench |
| pnpm validate episode.json | 校验节目、语义与原生素材 |
| pnpm export:plan episode.json out/episode | 导出计划及配套文件 |
| pnpm stills episode.json out/stills | 每镜头检查帧 |
| pnpm render episode.json out/episode.mp4 | 正式 MP4 |
| pnpm render:sample | 默认示例到 out/episode.mp4 |
| pnpm captions:import input.srt episode.json out/captioned.json | 导入字幕并另存 |
| pnpm styles out/brands | 各主题检查帧 |
| pnpm legacy:stills out/legacy-stills | 原组件默认检查帧 |
| pnpm typecheck | TypeScript |
| pnpm lint | ESLint、TypeScript |
| pnpm test | 自动化测试 |
| pnpm check | 类型检查、测试、校验默认示例 |
| pnpm schema | 重建 Episode 与品牌 Schema |
| pnpm catalog | 重建原组件和模板目录 |
| pnpm workbench:build | 工作台构建到 dist/workbench |
| pnpm build | Remotion bundle |
| python3 scripts/generate-component-readme.py | 重建组件说明，需要 Python 3 |

styles 和 legacy:stills 生成的是预览 PNG，不是所有业务数据下的测试报告。

## 19. 常见问题与当前边界

| 问题 | 处理 |
| --- | --- |
| 只想用原组件，为什么要写 JSON | 可直接使用 React 和 Studio |
| 工作台找不到原来的组件 | 模板库列 24 种原生模板；原组件在 Studio 或 legacy |
| 导出分镜后没有视频 | 导出的是 JSON，再运行 pnpm render |
| 有 narration 却没人声 | 接入实际 audio.voiceover |
| 当前镜头无字幕、声音 | 切整片预览 |
| 改磁盘 JSON 后工作台没变 | 重新导入；工作台恢复浏览器草稿 |
| 字体文件在但视觉不对 | 检查 brand.overrides.typography.font、字体族与加载 |
| 换主题后旧组件尺寸没变 | 旧布局未全部接入 tokens，修改具体组件 |
| motion none 仍有运动 | 行情条、转场、旧组件有独立实现 |
| Unknown legacy component | 使用正确 Composition ID，更新 catalog |
| JSON 类似示例却被拒绝 | 检查是否混用旧 SceneSpec、原 props、模板字段、包装 |
| Unrecognized keys | 去掉多余字段，参照当前示例 |
| Missing or unsafe local asset | 从根目录执行，核对 public 文件和引用 |
| Unknown source / requires a source | 补全 sources 和 sourceIds |
| Total does not reconcile | 重新计算累计值，检查符号、单位和期间 |
| 来源页放不下 | 一页最多 8 条，用 sourceIds 拆页 |
| 竖屏 legacy 报错 | 改用原生模板或开发适配布局 |
| 标题或表格裁切 | 缩短、拆页、减少项目、按画幅调整 |
| 改时长后旁白错位 | 音频不自动伸缩，按实际声音重调字幕和镜头 |
| Output exists | 换文件名，或明确给 render 加 --overwrite |
| 渲染内存紧张 | 降低并发，先 stills / draft |
| 无法启动浏览器 | 检查浏览器下载、环境依赖和实际报错 |
| build 后没有 MP4 | build 是网页资源，另运行 render |

需要自行接入或实现的能力包括：数据采集清洗、模型 API、TTS、ASR、自动声音对齐、通用非线性剪辑、云端协作和发布。

## 20. 建议的日常工作流程

### 第一次建立频道

1. 在 Studio 看原组件，用 TemplateGallery 看原生镜头。
2. 在 Workbench 调品牌，保留原字体或明确选择其他字体。
3. 导出 brand.json，保存常用 Episode。
4. 分别检查横屏和 Shorts，按画幅保存版本。
5. 将认可的配置和素材纳入自己的 Git 管理。

### 每一期节目

1. 准备事实、来源、问题和 brand.json。
2. AI 或自己的程序生成原始 Episode。
3. 核对数字、单位、出处和勾稽。
4. Workbench 调标题、密度、顺序。
5. 导出文稿，完成配音，按实际声音校准时长和字幕。
6. 检查每镜头 PNG 和草稿视频。
7. 渲染正式 MP4，需要剪辑时输出 ProRes。
8. 保存本期 JSON、品牌、源数据、素材和最终文件。

### 修改实现时

内容改 JSON，频道外观改 brand，图形能力改组件，通用行为改基础层。改接口后重新生成 Schema 与目录，再按实际画幅预览。
