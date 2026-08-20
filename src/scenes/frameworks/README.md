# Frameworks

咨询 / 决策 / 流程框架。

## 子类线框速览

```text
strategy/             定性 2×2 / 矩阵
  ┌───┬───┐
  │ D │ I │
  ├───┼───┤
  │ E │ O │
  └───┴───┘

planning/             问题树 / 驱动树 / 路线图 / 桥
  [? ]──→[ ]──→ ···
  ●────●────●

process/              泳道（谁 / 何时）
  角色 │ [步骤]····[步骤]
```

## 子目录

| 目录        | 何时进                           | README                                     |
| ----------- | -------------------------------- | ------------------------------------------ |
| `strategy/` | 战略 / 风险 / 优先级 / 机会矩阵  | [strategy/README.md](./strategy/README.md) |
| `planning/` | 问题树、驱动树、情景、路线图、桥 | [planning/README.md](./planning/README.md) |
| `process/`  | 谁做什么、何时做                 | [process/README.md](./process/README.md)   |

定量散点象限 → `charts/multivariate/QuadrantScatterChart`。  
资金流动 → `diagrams/flow/`。
