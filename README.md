# Finance Motion 2

把财经数据、研究结论和本地素材，制作成统一频道风格的 Remotion 视频。

现在包含 **24 类数据驱动模板、8 套品牌预设、109 个原有 Composition、可视化样式工作台和 AI 生成 skill**。适合公司财报、宏观比较、商业模式、市场周报、财经 YouTube 与竖屏 Shorts。

## 开始使用

需要 Node.js 22+ 和 pnpm。建议按 package.json 的 packageManager 使用 pnpm 10.30.2。首次渲染会下载 Chromium。

```bash
pnpm install --frozen-lockfile
pnpm workbench
```

打开终端显示的本地网址。工作台支持：

- 切换 8 套频道样式，修改频道名称、颜色、字体、圆角、动效与涨跌惯例。
- 导入 AI 生成的 Episode JSON；预览当前分镜或整片。
- 添加、复制、删除、重排分镜，调整时长；字幕随分镜移动。
- 切换 16:9 / 9:16 / 1:1；导出 episode.json 和可复用的 brand.json。

工作台草稿只保存在当前浏览器的本地存储，正式交付请导出 JSON。时间线编辑不会剪辑旁白音轨；有音频时需重新核对。`pnpm dev` 则打开原 Remotion Studio，查看所有独立 Composition。

## 从数据到视频

```bash
pnpm validate examples/episode.json
pnpm export:plan examples/episode.json out/episode
pnpm stills examples/episode.json out/stills
pnpm render examples/episode.json out/episode.mp4
```

- `validate`：结构、来源引用、勾稽关系、时序和素材存在性校验。
- `export:plan`：导出 `.props.json`、`.storyboard.json`，以及有内容时的 `.narration.md` 与 `.srt`。
- `stills`：每个分镜导出一张半尺寸检查帧。
- `render`：默认 H.264 / 1080p / CRF 18；输出对应的计划、旁白和字幕文件。

```bash
pnpm render examples/episode.json out/draft.mp4 --draft
pnpm render examples/episode.json out/master.mov --prores
pnpm render examples/shorts.json out/shorts.mp4
pnpm captions:import captions.srt examples/episode.json out/episode-with-captions.json
pnpm styles out/brand-previews
```

`--concurrency=1` 可用于资源紧张的机器（默认 2，可设 1–16）。`--draft` 输出半尺寸；已存在的 MP4/MOV 需要明确添加 `--overwrite`。ProRes 为 HQ / 10-bit 4:2:2。字幕可导出供剪辑软件使用，也会随 Episode 在画面内显示。

**旁白文稿不会自动变成语音。** 当前系统接受已有音轨，不内置 TTS、ASR 或模型 API。示例中的字幕按计划分镜手工定时，样片为无声视觉示例。添加正式配音后应按实际声音校准字幕和时长。

## 给 AI 数据即可生成

已配套 `$finance-video-producer` skill。项目中也附带可复制的 `.agents/skills/finance-video-producer/`；已在支持 Skills 的当前环境中保存时，可直接按名字调用。

示例指令：

> 使用 $finance-video-producer，把我提供的 CSV 制作成 90 秒中文财经解说。16:9，午夜新闻风格，先给结论，再解释营收、利润与现金流的差异。保留数据来源和单位，生成旁白、Episode JSON、检查帧与 MP4；未提供配音时先输出无声视频。频道名称为“深度商业观察”。

AI 根据语义选择模板并写 JSON，再用相同的 schema 和渲染器校验与出片；不需要为每一期重新写 React。任何模型都可以按 [AI 工作流](docs/AI-WORKFLOW.md) 和 JSON Schema 生成，未绑定特定服务商。

## 样式统一管理

| 预设        | 视觉方向               | 适合场景           |
| ----------- | ---------------------- | ------------------ |
| editorial   | 暖纸、深墨、青柠、硬边 | 商业解释与数据叙事 |
| newsroom    | 午夜蓝、琥珀、低圆角   | 财经新闻、每周市场 |
| terminal    | 深绿、等宽字、网格     | 市场终端、量化观察 |
| journal     | 暖纸、衬线、砖红       | 宏观与经济评论     |
| cobalt      | 深蓝、青柠、圆角       | 科技商业、产业研究 |
| documentary | 炭黑、衬线、克制金色   | 公司深度与纪录叙事 |
| minimal     | 白蓝、轻边框、大圆角   | 机构研究、财务汇报 |
| signal      | 黑白红、直角           | 焦点新闻、重点解读 |

统一入口：`src/brand/presets.ts`。单个频道用 JSON 的 `brand.overrides`，完整例子见 `examples/brand-custom.json`。可覆盖颜色、序列色、字体、标题比例、圆角、边框、阴影、留白、网格与动效。原组件通过 CSS 变量接入同一调色板；保留其原有布局比例与部分专用图形结构。

```json
{
  "preset": "newsroom",
  "name": "我的财经频道",
  "marketColors": "international",
  "overrides": {
    "colors": { "accent": "#F6C667", "onAccent": "#132137" },
    "shape": { "radius": 8, "border": 1, "shadow": false },
    "typography": { "font": "sans", "titleScale": 1 },
    "motion": "calm"
  }
}
```

`international` 为绿涨红跌，`china` 为红涨绿跌；箭头和正负号保持数据方向。浅色强调色在文字上会自动选择可读的前景色。Noto Sans SC 与 IBM Plex Mono 已本地打包，不依赖在线字体服务；日语冷僻字和特殊符号需补充合适的授权字体。

## 模板与原组件

| 类别     | 新模板                                                    |
| -------- | --------------------------------------------------------- |
| 节目包装 | opener、chapter、headline、news-grid、sources、endcard    |
| 数据展示 | hero、kpis、bars、ranking、trend、waterfall、donut、table |
| 公司研究 | earnings、scenario                                        |
| 观点叙事 | comparison、quote、timeline、equation、bullets、takeaway  |
| 媒体呈现 | media、presenter                                          |

`examples/template-gallery.json` 覆盖全部 24 类模板。精确字段见 `schemas/episode.schema.json`；全部原组件参数见 [原组件目录](docs/LEGACY-CATALOG.md)。原有 CATALOG.md、component.md 和 MIGRATION.md 保留为历史组件参考。

新模板自动适配三种画幅；原有 109 个 Composition 通过 `legacy` 场景复用，限定横屏：

```json
{
  "id": "industry-sankey",
  "type": "legacy",
  "title": "收入如何沿价值链分配",
  "duration": 9,
  "sourceIds": ["my-source"],
  "component": "Diagram-Sankey",
  "props": { "title": "收入如何沿价值链分配" }
}
```

完整节目是原始 Episode 对象；只有直接调用 Remotion `--props` 时才使用 `{ "episode": ... }` 包装。CLI 的 `render` 会自动处理包装。原组件的 props 由 TypeScript 接口生成 schema 校验，默认演示数据不能替代生产数据；高级图形仍需检查其专用口径和布局容量。

## 数据与素材规则

- `version` 固定为 `"2.0"`。生产数据场景与引用需要有效 `sourceIds`；`sources` 中保存名称、可选日期、链接和口径。
- `isDemo: true` 显示演示标记；不得用此开关掩盖真实节目的缺失来源。
- 趋势图的 `null` 保留缺口，不当作零；标签等距，非等距日期应先重采样。`forecastFrom` 标记首个预测点。
- 柱形图从零开始并支持负数；瀑布图按累计余额绘制，起点与终点必须勾稽；结构图总额必须大于零。
- `change` 是百分比。百分点差异应单独作为带“百分点”后缀的指标或注释，避免混淆。
- 图片、主持人视频、logo、语音和音乐放入 `public/`，JSON 使用不带 `public/` 的相对路径。主持人视频默认静音，使用单独的旁白音轨。
- 数量上限用于控制信息密度，不是任何长度文案的排版保证。复杂节目应拆页，并检查实际画幅下每一帧。

升级细节与验证记录见 [UPGRADE-2.md](docs/UPGRADE-2.md)。

## 实现与维护

| 路径          | 职责                                         |
| ------------- | -------------------------------------------- |
| src/brand     | 品牌 tokens、预设、对比度与 Provider         |
| src/program   | Zod 协议、语义校验、时间线、字幕与渲染编排   |
| src/broadcast | 新节目模板与准确的图表原语                   |
| src/scenes    | 原有专业图表、关系图、策略框架与媒体组件     |
| studio        | 可视化样式与分镜工作台                       |
| scripts       | 校验、导出、渲染、目录生成与字幕导入         |
| examples      | 横屏、Shorts、模板全览、新闻包装与自定义品牌 |
| schemas       | 自动生成的 Episode、品牌、模板与原组件接口   |

```bash
pnpm lint
pnpm test
pnpm schema
pnpm catalog
pnpm workbench:build
pnpm build
```

新增模板时同步更新 discriminated union、SceneContent、templateCatalog 和全览示例，再生成 schema。动画只依赖帧与 fps；主题在 Provider 局部生效，支持并发渲染不同品牌。Remotion 用 `calculateMetadata` 根据输入推导总帧数、fps 和画幅，参见 [官方参数化视频文档](https://www.remotion.dev/docs/parameterized-rendering)。
