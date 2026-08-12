# Migration Report — Semantic Classification Refactor

Historical folders `advanced/`, `editorial/`, `expressive/` are removed. Components now live under semantic families: metrics / charts / tables / diagrams / frameworks / narrative / media / overlays.

## Renamed

| Former | New |
|---|---|
| BigNumber | HeroMetric |
| HeroStatSplit | SplitMetric |
| Percentage | ShareMetric |
| KPIGrid | MetricGrid |
| FactBox | FactGrid |
| PairedBars | PairedBarChart |
| Ranking | RankingChart |
| ScenarioBars | ScenarioBarChart |
| VarianceComparison | VarianceComparisonChart |
| Candlestick | CandlestickChart |
| AnnotatedTimeSeries | AnnotatedLineChart |
| DualMetricChart | DualAxisChart |
| ConnectedScatter | ConnectedScatterPlot |
| IndexedComparisonRibbon | IndexedComparisonChart |
| Donut | DonutChart |
| StackedBar | StackedBarChart |
| Treemap | TreemapChart |
| Marimekko | MarimekkoChart |
| NestedComposition | NestedCompositionChart |
| DistributionBlocks | DistributionBlocksChart |
| CompositionCompare | CompositionCompareChart |
| ContributionBars | ContributionBarChart |
| Waterfall | WaterfallChart |
| PictogramArray | PictogramChart |
| DotDensityStrip | DotStripPlot |
| QuadrantScatter | QuadrantScatterChart |
| DataTable | MetricTable |
| Flow | FlowDiagram |
| Funnel | FunnelDiagram |
| UnitEconomics | UnitEconomicsDiagram |
| TwoSidedMarketplace | TwoSidedMarketplaceDiagram |
| SankeyFlow | SankeyDiagram |
| ValueChain | ValueChainDiagram |
| RivalryNetwork | RivalryNetworkDiagram |
| CompetitiveLandscape | CompetitiveLandscapeDiagram |
| EcosystemHub | EcosystemMap |
| VennCapabilities | CapabilityVennDiagram |
| BalanceSheet | BalanceSheetDiagram |
| CapitalStack | CapitalStackDiagram |
| OpportunityMap | OpportunityMatrix |
| DriverTree (expressive) | MetricDriverTree |
| SwimlaneProcess | SwimlaneDiagram |
| BeforeAfter | BeforeAfterCompare |
| DuelCards | CompareCards |
| Callout | KeyTakeaway |
| Equation | EquationCards |
| Compare | SideBySideCompare |
| Quote | QuoteCard |
| Ticker | TickerOverlay |
| PresenterOrbitCards | PresenterOrbitOverlay |

## Moved

| From | To |
|---|---|
| `src/scenes/*.tsx` (core) | semantic dirs under `src/scenes/{metrics,charts,…}/` |
| `src/scenes/advanced/charts/*` | `charts/{categorical,time-series,comparison,distribution,uncertainty,multivariate}/` |
| `src/scenes/advanced/comparison/*` | `charts/categorical/` or `charts/comparison/` |
| `src/scenes/advanced/composition/*` | `charts/composition/` |
| `src/scenes/advanced/relationships/*` | `diagrams/{flow,relationships}/` |
| `src/scenes/editorial/*` | charts / tables / frameworks / narrative / metrics |
| `src/scenes/expressive/*` | metrics / charts / diagrams / narrative / overlays / tables |
| `advanced/shared.tsx` | `src/components/viz/chartPrimitives.tsx` |
| `expressive/structuralShared.tsx` | `src/components/viz/structuralShared.tsx` |
| `expressive/shared.tsx` | `src/components/viz/overlayShared.tsx` |
| `src/showcase/airbnb.ts` | `src/showcase/examples/airbnb.ts` |
| Demo reels at `src/*DemoReel.tsx` | `src/showcase/reels/*` |

## Merged

| Inputs | Result | Decision |
|---|---|---|
| `editorial/SankeyFlow` + `expressive/SankeyFlow` | `SankeyDiagram` | Kept prop-driven expressive implementation; removed hardcoded editorial demo |
| `editorial/DriverTree` + `expressive/DriverTree` | `MetricDriverTree` | Kept recursive prop-driven tree; removed flat editorial layout (misaligned connectors) |

## Removed

- `src/scenes/advanced/` (entire tree)
- `src/scenes/editorial/` (entire tree)
- `src/scenes/expressive/` (entire tree)
- `src/lib/motionAdvanced.ts`, `src/lib/vizMotion.ts`, `src/lib/editorialViz.ts` (merged into `motion.ts` / `chartMotion.ts`)
- `AdvancedDemoReel`, `EditorialDemoReel`, `ExpressiveDemoReel`, `StructuralDemoReel`, root `DemoReel`
- Composition ID prefixes `Advanced-`, `Editorial-`, `Expressive-`, `Structural-`

## Lib consolidation

| Former | New |
|---|---|
| motion.ts + motionAdvanced + editorialViz (reveal/count/palette) | `src/lib/motion.ts` |
| vizMotion (stagger/clamp) | `src/lib/chartMotion.ts` |
| scale/path helpers from advanced/shared | `src/lib/geometry.ts` (+ re-export via chartPrimitives) |

## Showcase / Composition IDs

| Former reel | New |
|---|---|
| DemoReel | CoreComponentsReel |
| Advanced-DemoReel | ChartsReel |
| Structural-DemoReel / Expressive-DemoReel | DiagramsReel (+ narrative/metrics in other reels) |
| Editorial-DemoReel | FrameworksReel |
| — | FullShowcaseReel |

Example scene IDs: `Metric-HeroMetric`, `Chart-Line`, `Diagram-Sankey`, `Framework-RiskMatrix`, `Overlay-Ticker`.

## Ambiguous decisions

| Component | Judgment |
|---|---|
| `ValueChainDiagram` vs `ValueChainMap` | Kept both: economics/capture vs competitive players on stages |
| `QuadrantScatterChart` | Kept in `charts/multivariate` (quantitative points); qualitative 2×2 stays in frameworks (`StrategyMatrix`, `OpportunityMatrix`) |
| `ContributionBarChart` | Placed in `charts/composition` (parts contributing to a total) |
| `CapabilityHeatmap` | Placed in `tables/` (tabular score grid), not strategy framework |
| `SwimlaneDiagram` | Placed in `frameworks/process` (who/when), not flow diagrams |
| `EquationCards` | Placed in `narrative/` (story equation), not finance diagrams |
| `CompareCards` | Narrative (visual duel); can still use `OverlayShell` for transparent B-roll |
| `ContributionBarChart` vs `DivergingBarChart` | Both kept: contribution-to-total framing vs general diverging bars |
| `WaterfallChart` / `PictogramChart` | Added to composition (not in original sketch but fit composition semantics) |

## Alignment fixes

- `IssueTree` — fixed connector endpoints to card edge midpoints with explicit geometry
- `ScenarioTree` — same connector alignment fix
- Removed editorial `DriverTree` (connector misalignment); use `MetricDriverTree`

## Still-overlapping semantics (intentional)

These remain distinct on purpose:

1. **Scatter family:** `ScatterPlot` (stats) · `QuadrantScatterChart` (quant 2×2) · `StrategyMatrix` / `OpportunityMatrix` (qualitative frameworks)
2. **Compare family:** `SideBySideCompare` (numeric) · `CompareCards` (visual cards) · `CompositionCompareChart` (mix over time)
3. **Value chain:** `ValueChainDiagram` vs `ValueChainMap`
4. **Scenario:** `ScenarioBarChart` (scale) vs `ScenarioTree` (decision branches)
5. **Heatmaps:** `Heatmap` · `CalendarHeatmap` · `CapabilityHeatmap`
