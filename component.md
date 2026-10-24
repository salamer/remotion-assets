# Finance Motion — Component Design Guide

Remotion library for finance / business / data YouTube videos.

Style: **Soft Brutalism + Financial Editorial** — large type, ink/yellow, hard borders, frame-driven motion.

```text
Data / assets / script
    ↓
Scene props (Studio) / SceneSpec (src/spec)
    ↓
React scene components (src/scenes/*)
    ↓
Design system (src/style/theme.ts)
    ↓
Remotion → MP4 / ProRes → NLE
```

Default demo data: Airbnb (`src/showcase/examples/airbnb.ts`).

For the full inventory, see **[CATALOG.md](./CATALOG.md)**. For rename/move history, see **[MIGRATION.md](./MIGRATION.md)**.

---

## Semantic families

Components are classified by **what they express**, not when they were added.

| Family         | Means                           | Directory                |
| -------------- | ------------------------------- | ------------------------ |
| **Metrics**    | 1–6 headline numbers            | `src/scenes/metrics/`    |
| **Charts**     | Data → position / length / area | `src/scenes/charts/`     |
| **Tables**     | Precise numeric comparison      | `src/scenes/tables/`     |
| **Diagrams**   | Relations, structure, flow      | `src/scenes/diagrams/`   |
| **Frameworks** | Consulting / decision frames    | `src/scenes/frameworks/` |
| **Narrative**  | Story beats, turns, takeaways   | `src/scenes/narrative/`  |
| **Media**      | Photos, quotes, maps, logos     | `src/scenes/media/`      |
| **Overlays**   | Transparent layers on B-roll    | `src/scenes/overlays/`   |

Import from the barrel:

```ts
import { HeroMetric, LineChart, SankeyDiagram, RiskMatrix } from "./scenes";
```

---

## 1. Metrics

**Use when:** one or a few numbers should dominate the frame.

| Component     | Purpose                 | Use when                               | Do not use when             |
| ------------- | ----------------------- | -------------------------------------- | --------------------------- |
| `HeroMetric`  | Single hero KPI         | Revenue / GMV / users as the punchline | You need a full chart       |
| `SplitMetric` | Two shares side by side | Host share vs take rate                | More than ~2 numbers        |
| `ShareMetric` | One percentage as hero  | Margin / share of total                | Absolute levels matter more |
| `MetricGrid`  | Small KPI tile grid     | 4–6 supporting metrics                 | Dense tabular detail        |
| `FactGrid`    | Fact boxes              | Executive “facts on a page”            | Time-series narrative       |

---

## 2. Charts

### categorical

Bar family for discrete categories: `BarChart`, `GroupedBarChart`, `PairedBarChart`, `LollipopChart`, `DotPlot`, `BulletChart`, `DivergingBarChart`, `ParetoChart`, `RankingChart`, `ScenarioBarChart`, `TornadoChart`, `VarianceComparisonChart`.

### time-series

Change over time: `LineChart`, `MultiLineChart`, `AreaChart`, `StackedAreaChart`, `CandlestickChart`, `IndexedLineChart`, `AnnotatedLineChart`, `EventStudyChart`, `DualAxisChart`, `ConnectedScatterPlot`, `BumpChart`, `IndexedComparisonChart`.

### comparison

Direct comparisons: `DumbbellChart`, `SlopeChart`, `SmallMultiples`, `BenchmarkBandChart`.

### composition

Parts of a whole: `DonutChart`, `StackedBarChart`, `TreemapChart`, `MarimekkoChart`, `NestedCompositionChart`, `WaffleChart`, `DistributionBlocksChart`, `CompositionCompareChart`, `ContributionBarChart`, `WaterfallChart`, `PictogramChart`.

### distribution

Shape / spread / density: `Histogram`, `BoxPlot`, `BeeswarmPlot`, `RidgelinePlot`, `DotStripPlot`, `PopulationPyramid`, `ScatterPlot`, `BubbleChart`, `Heatmap`, `CalendarHeatmap`, `CohortMatrix`.

### uncertainty

`ForecastFanChart`, `RangeBandChart`.

### multivariate

`ParallelCoordinates`, `RadarChart`, `QuadrantScatterChart` (quantitative 2×2).

**Example — Sankey vs Flow**

`SankeyDiagram` — Purpose: show magnitude-encoded flows between nodes.
Use when: money / users / value move across sources and destinations.
Do not use when: a simple 3-step sequence is enough → use `FlowDiagram`.

---

## 3. Tables

| Component                     | Purpose                         |
| ----------------------------- | ------------------------------- |
| `MetricTable`                 | Precise numbers in rows/columns |
| `SparklineTable`              | Table + inline trend            |
| `BenchmarkScorecard`          | Peer scorecard                  |
| `DistributionComparisonTable` | Two-sided distribution rows     |
| `CapabilityHeatmap`           | Entity × capability score grid  |

---

## 4. Diagrams

### flow

`FlowDiagram`, `FunnelDiagram`, `UnitEconomicsDiagram`, `TwoSidedMarketplaceDiagram`, `SankeyDiagram`, `ValueChainDiagram`, `ValueChainMap`.

- `ValueChainDiagram` = margin / capture economics per stage
- `ValueChainMap` = which players sit on each stage

### relationships

`RelationshipGraph`, `CausalGraph`, `RivalryNetworkDiagram`, `CompetitiveLandscapeDiagram`, `EcosystemMap`, `CapabilityVennDiagram`.

### hierarchy

`HierarchyPyramid`, `OrganizationTree`, `OwnershipTree`.

### finance

`BalanceSheetDiagram`, `CapitalStackDiagram`.

---

## 5. Frameworks

### strategy

Qualitative 2×2 / matrices: `StrategyMatrix`, `RiskMatrix`, `PrioritizationMatrix`, `OpportunityMatrix`.

Do not confuse with `QuadrantScatterChart` / `ScatterPlot` (data plots).

### planning

`IssueTree`, `MetricDriverTree`, `ScenarioTree`, `StrategicRoadmap`, `BridgeToTarget`.

- `IssueTree` = qualitative question → branches
- `MetricDriverTree` = quantitative KPI decomposition with ×÷+−

### process

`SwimlaneDiagram` — who does what when.

---

## 6. Narrative

`BeforeAfterCompare`, `CompareCards`, `SideBySideCompare`, `ExecutiveSummary`, `BulletReveal`, `KeyTakeaway`, `Timeline`, `PageFlipChoice`, `EquationCards`.

- `SideBySideCompare` = numeric A vs B
- `CompareCards` = visual / overlay duel cards

---

## 7. Media

`ImageCard`, `QuoteCard`, `ScreenshotZoom`, `MapCallout`, `LogoCloud`.

---

## 8. Overlays

Transparent by default — do not wrap in `Frame` for real B-roll use.

`TickerOverlay`, `PresenterOrbitOverlay`.

Studio preview for ticker: `TickerPreview`.

---

## Studio compositions

Reel IDs:

- `CoreComponentsReel`
- `ChartsReel`
- `DiagramsReel`
- `FrameworksReel`
- `FullShowcaseReel`

Scene IDs use semantic prefixes: `Metric-HeroMetric`, `Chart-Line`, `Diagram-Sankey`, `Framework-RiskMatrix`, `Media-Quote`, `Overlay-Ticker`, …

Registry: `src/showcase/compositions.ts`.

---

## Motion / viz helpers

```text
src/lib/motion.ts        fade / spring / reveal / count / palette
src/lib/chartMotion.ts   stagger / clamp / tween re-exports
src/lib/geometry.ts      scale / extent / smoothPath / niceMax

src/components/viz/
  chartPrimitives.tsx    GridLines, MiniLegend, VIZ
  structuralShared.tsx   tree layout, NodeCard, edges
  overlayShared.tsx      OverlayShell, InlineLegend
```

---

## SceneSpec

- `src/spec/types.ts` — early `SceneSpec` union (`hero-metric`, `quote-card`, …)
- `src/spec/structuralSceneSpec.ts` — `DiagramSceneSpec` for prop-driven trees / sankey / capital

Prefer kebab-case `type` values matching catalog names.
