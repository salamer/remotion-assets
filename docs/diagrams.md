# Diagrams

Structure / relationship / flow scenes under `src/scenes/diagrams/`.

| Subfolder | Use for |
|---|---|
| `flow/` | Sequences, funnels, sankey, value chain, marketplace |
| `relationships/` | Networks, causal graphs, ecosystems, rivalry |
| `hierarchy/` | Org / ownership trees, pyramids |
| `finance/` | Balance sheet, capital stack |

**Distinctions**

- `SankeyDiagram` — magnitude-encoded multi-node flows
- `FlowDiagram` — simple sequential steps
- `ValueChainDiagram` — margin/capture economics
- `ValueChainMap` — players on each stage
- `MetricDriverTree` lives under `frameworks/planning/` (KPI math), not here
