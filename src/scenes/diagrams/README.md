# Diagrams

关系、结构、流动、组织——不是坐标图。

## 子类线框速览

```text
flow/                 顺序 / 漏斗 / 桑基 / 价值链
  ○──→○──→○
  ═══╗   ╔═══
     ╚═══╝

relationships/        网络 / 因果 / 生态 / 维恩
       ○
     ╱ │ ╲
    ○  ○  ○

hierarchy/            金字塔 / 组织树 / 股权树
       ╱──╲
      ╱────╲
         │
       ┌─┴─┐

finance/              资产负债表 / 资本栈
  ┌──┐ ┌──┐      ┌────┐
  │▓▓│ │░░│      │████│
  └──┘ └──┘      └────┘
```

## 子目录

| 目录 | 何时进 | README |
|---|---|---|
| `flow/` | 顺序、漏斗、资金流、价值链 | [flow/README.md](./flow/README.md) |
| `relationships/` | 网络、因果、生态、竞争 | [relationships/README.md](./relationships/README.md) |
| `hierarchy/` | 组织 / 股权 / 层级 | [hierarchy/README.md](./hierarchy/README.md) |
| `finance/` | 资产负债表、资本结构 | [finance/README.md](./finance/README.md) |

KPI 拆解树在 `frameworks/planning/MetricDriverTree`，不在这里。
