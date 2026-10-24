# AI 数据生成工作流

## 最小输入

提供研究问题、数据文件、单位、期间、来源，以及希望的频道风格。若已有 brand.json，一起给 AI。无需指定每个图表，AI 应根据论点选取模板。

示例：

> 数据来自我上传的经营表，单位亿元，2023–2025 全年口径。请解释为什么收入增长但自由现金流下降。生成 60–90 秒中文财经视频，午夜新闻风格，16:9。不要假设现金流下降的具体原因；把尚待验证的应收、库存、资本开支列为观察项。

## 交付顺序

1. 整理标准事实表：数值、单位、期间、来源、真实/估计/假设状态。
2. 用代码计算增长、占比与勾稽；不擅自补零或更改币种。
3. 规划“问题 → 证据 → 解释 → 限制 → 结论 → 来源”。
4. 从 `examples/template-gallery.json` 复制所需的字段结构，生成 episode.json。
5. 运行 validate，修复所有错误，逐项处理警告。
6. 导出旁白与分镜计划，按实际配音校准 duration 和 captions。
7. 生成检查帧与视频，检查裁切、数字、轴、来源和单位。

## 最小可运行 Episode

以下为人工演示数据，不代表真实事实。

```json
{
  "version": "2.0",
  "title": "一组经营指标",
  "format": "landscape",
  "fps": 30,
  "locale": "zh-CN",
  "isDemo": true,
  "brand": { "preset": "newsroom", "name": "我的频道" },
  "sources": [{ "id": "demo", "label": "合成演示数据" }],
  "scenes": [
    {
      "id": "revenue",
      "type": "hero",
      "title": "收入增长仍需现金验证",
      "duration": 7,
      "sourceIds": ["demo"],
      "metric": {
        "label": "全年营收",
        "value": 125,
        "suffix": "亿元",
        "change": 25,
        "changeLabel": "同比"
      },
      "narration": "收入增长百分之二十五，但现金表现需要单独检查。"
    }
  ]
}
```

生产节目设 `isDemo: false` 并使用实际出处。用户内部数据可用文件名作为来源标签，不必虚构公开网址。

## 自动化接口

- JSON schema：`schemas/episode.schema.json`（输入格式，包含默认值）。
- 运行时 Zod：`src/program/schema.ts`。
- 跨字段/财经语义校验：`src/program/validate.ts`。
- 参数化 Composition：`FinanceEpisode`。
- 命令行输入：原始 Episode 或 `{ "episode": ... }` 均可。
- 视频输出：MP4 / ProRes，附 `.props.json`、`.storyboard.json` 和存在时的旁白、SRT。

模型调用由你的 AI 环境负责，渲染器只接收经过校验的数据，不接收或执行模型生成的代码。不会把模型 API key 写入视频项目。生产环境如需接入 OpenRouter、DeepSeek 等，可在上游生成结构化 JSON 后调用相同命令行接口。

## 既有图表的复用

高级图形（Sankey、产业链、人口金字塔、所有权、情景树等）可用 legacy + Composition ID。阅读 `docs/LEGACY-CATALOG.md` 与对应源文件。输入字段必须匹配 schema；至少显式提供实际数据、标题、来源，不能只改标题后保留示例公司数据。原组件侧重专业图形广度，新模板侧重统一节目包装与多画幅。

## 声音与字幕

旁白文本与声音文件是两种不同交付。未提供音轨时，系统生成无声画面与文稿。SRT 导入会保留换行、移除常见字幕标记，并校验时间。工作台重排/复制/删减分镜时会调整对应字幕，但不会剪切或伸缩声音。以最终声音作为时间基准。
