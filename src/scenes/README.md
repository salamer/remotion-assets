# Scenes

按「视觉表达语义」选目录 → 进子 README 看线框 → 选组件。

```ts
import { HeroMetric, LineChart, SankeyDiagram, RiskMatrix } from "./scenes";
```

## 怎么选（看轮廓）

```text
只要几个大数字？
┌──────────────────┐
│     $ 11.1 B     │  →  metrics/
└──────────────────┘

数据变成坐标 / 长度 / 面积？
┌──┐ ┌──┐ ┌──┐
│██│ │██│ │█ │  →  charts/
└──┘ └──┘ └──┘

精确对照表格？
┌────┬────┬────┐
│ A  │ 12 │ 8% │  →  tables/
└────┴────┴────┘

关系 / 结构 / 流动？
○──→○──→○           →  diagrams/

咨询框架 / 决策矩阵？
┌───┬───┐
│   │   │           →  frameworks/
└───┴───┘

讲故事、转折、结论？
「一句话 takeaway」     →  narrative/

图 / 引用 / 地图 / Logo？ →  media/

叠在真人画面上？
┌ ticker ┐             →  overlays/
```

## 目录

| 文件夹        | 何时进                 | README                                         |
| ------------- | ---------------------- | ---------------------------------------------- |
| `metrics/`    | 1～6 个 headline 数字  | [metrics/README.md](./metrics/README.md)       |
| `charts/`     | 定量图                 | [charts/README.md](./charts/README.md)         |
| `tables/`     | 精确数字表             | [tables/README.md](./tables/README.md)         |
| `diagrams/`   | 关系 / 结构 / 流       | [diagrams/README.md](./diagrams/README.md)     |
| `frameworks/` | 战略 / 规划 / 流程框架 | [frameworks/README.md](./frameworks/README.md) |
| `narrative/`  | 叙事节拍               | [narrative/README.md](./narrative/README.md)   |
| `media/`      | 素材表达               | [media/README.md](./media/README.md)           |
| `overlays/`   | 透明叠加               | [overlays/README.md](./overlays/README.md)     |

每个叶子目录的 README 用 **ASCII 线框** 模拟最终 UI，方便直接选型。
