# Finance Motion 2 升级说明

## 主要变化

- 从展示组件集合扩展为 Episode 数据协议、校验器、时间线编排和参数化视频 Composition。
- 新增 24 类节目模板，覆盖片头、头条、财报、图表、观点、来源、主持人与片尾。
- 新增 8 套局部作用域品牌预设。颜色、字体、形状、动效和序列色集中管理，支持 JSON 深度覆盖。
- 新增可视化工作台，支持样式编辑、画幅切换、分镜重排、时长、JSON 校验和导入导出。
- 保留原有 109 个 Composition ID，补充数据/标题参数，并生成可检查的参数目录和 schema。
- 修复普通柱形图固定量程、瀑布图未累计、折线边缘标签裁切、负增长箭头、K 线固定价格区间等问题。
- 补齐本地中文字体，修复长片渲染中的字体延迟句柄超时；字体在渲染生命周期内按文档加载一次。
- 新增旁白文稿、计划、props、SRT 导出，既有音轨接入，以及字幕随分镜编辑的时序调整。
- 配套 finance-video-producer skill，可从原始经营数据生成结构化分镜、旁白和可渲染配置。

## 兼容边界

原组件的既有 ID 与语义目录保留；其专用图形以 16:9 为基础。新增 Episode 协议使用 `version: "2.0"`，旧 `src/spec/types.ts` 中的早期 SceneSpec 不是新协议；新代码使用 ProgramSceneSpec / EpisodeSpec 或 program/schema.ts。

原组件参数校验覆盖 TypeScript 形状，专业图形仍应检查负数、比例总和、坐标域与节点数量等业务前提。新模板对来源、负数、预测、缺失值、瀑布勾稽和字幕时序提供更完整的校验。数据结构有效不等于事实已独立核验。

## 验证方法

- TypeScript 与 ESLint。
- 19 项业务和时序测试，包括来源、无穷值、缺失值、跨图勾稽、百分比、字幕编辑和品牌隔离。
- 24 个新模板 × 横屏、竖屏、方形：72 个布局检查，包含边界溢出检查。
- 工作台实际操作：主题切换、添加/复制/删除、重排、时长、无效 JSON 拒绝。
- 原有 109 个 Composition 的默认数据检查帧全部渲染成功；不是对每种业务数据组合的穷举验证。
- 8 套品牌预设检查帧；完整示例 MP4 检查视频编码、分辨率、时长及每一分镜的中间帧。
- 独立 skill 试跑：使用合成经营数据，生成 9 场景 / 59 秒节目，校验和 9 张检查帧通过；这份试跑没有生成配音或视频。

构建检查包括工作台生产构建和 Remotion bundle。Vite 可能提示第三方 Player 的 `use client` 与大块体积；它们不会阻止本地工作台构建。

## 可复现命令

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm catalog
pnpm schema
pnpm workbench:build
pnpm build
pnpm legacy:stills out/legacy-stills
pnpm styles out/brands
pnpm stills examples/template-gallery.json out/stills
pnpm render examples/episode.json out/episode.mp4 --concurrency=2
```

资源紧张时可用 `--concurrency=1` 与 `--draft`。原始数据更改后，应重新生成检查帧及视频。目录和 schema 是自动生成文件，修改 props 后重新运行 catalog / schema。
