/**
 * Studio Composition registry — semantic IDs (Metric-*, Chart-*, Diagram-*, …).
 */
import type { ComponentType } from "react";

import { SCENE_DURATION } from "../config";
import {
  // metrics
  HeroMetric,
  SplitMetric,
  ShareMetric,
  MetricGrid,
  FactGrid,
  // charts categorical
  BarChart,
  GroupedBarChart,
  PairedBarChart,
  LollipopChart,
  DotPlot,
  BulletChart,
  DivergingBarChart,
  ParetoChart,
  RankingChart,
  ScenarioBarChart,
  TornadoChart,
  VarianceComparisonChart,
  // time-series
  LineChart,
  MultiLineChart,
  AreaChart,
  StackedAreaChart,
  CandlestickChart,
  IndexedLineChart,
  AnnotatedLineChart,
  EventStudyChart,
  DualAxisChart,
  ConnectedScatterPlot,
  BumpChart,
  IndexedComparisonChart,
  // comparison
  DumbbellChart,
  SlopeChart,
  SmallMultiples,
  BenchmarkBandChart,
  // composition
  DonutChart,
  StackedBarChart,
  TreemapChart,
  MarimekkoChart,
  NestedCompositionChart,
  WaffleChart,
  DistributionBlocksChart,
  CompositionCompareChart,
  ContributionBarChart,
  WaterfallChart,
  PictogramChart,
  // distribution
  Histogram,
  BoxPlot,
  BeeswarmPlot,
  RidgelinePlot,
  DotStripPlot,
  PopulationPyramid,
  ScatterPlot,
  BubbleChart,
  Heatmap,
  CalendarHeatmap,
  CohortMatrix,
  // uncertainty
  ForecastFanChart,
  RangeBandChart,
  // multivariate
  ParallelCoordinates,
  RadarChart,
  QuadrantScatterChart,
  // tables
  MetricTable,
  SparklineTable,
  BenchmarkScorecard,
  DistributionComparisonTable,
  CapabilityHeatmap,
  // diagrams
  FlowDiagram,
  FunnelDiagram,
  UnitEconomicsDiagram,
  TwoSidedMarketplaceDiagram,
  SankeyDiagram,
  ValueChainDiagram,
  ValueChainMap,
  RelationshipGraph,
  CausalGraph,
  RivalryNetworkDiagram,
  CompetitiveLandscapeDiagram,
  EcosystemMap,
  CapabilityVennDiagram,
  HierarchyPyramid,
  OrganizationTree,
  OwnershipTree,
  BalanceSheetDiagram,
  CapitalStackDiagram,
  // frameworks
  StrategyMatrix,
  RiskMatrix,
  PrioritizationMatrix,
  OpportunityMatrix,
  StrategicRoadmap,
  ScenarioTree,
  BridgeToTarget,
  IssueTree,
  MetricDriverTree,
  SwimlaneDiagram,
  // narrative
  BeforeAfterCompare,
  CompareCards,
  ExecutiveSummary,
  BulletReveal,
  KeyTakeaway,
  Timeline,
  PageFlipChoice,
  EquationCards,
  SideBySideCompare,
  // media
  ImageCard,
  QuoteCard,
  ScreenshotZoom,
  MapCallout,
  LogoCloud,
  // overlays
  PresenterOrbitOverlay,
} from "../scenes";
import { airbnbShowcase } from "./examples/airbnb";
import { TickerPreview } from "./TickerPreview";

export type ShowcaseEntry = {
  id: string;
  component: ComponentType<Record<string, unknown>>;
  durationInFrames: number;
  defaultProps?: Record<string, unknown>;
};

const withProps = <P extends Record<string, unknown>>(
  id: string,
  component: ComponentType<P>,
  defaultProps?: P,
  durationInFrames = SCENE_DURATION,
): ShowcaseEntry => ({
  id,
  component: component as ComponentType<Record<string, unknown>>,
  defaultProps: defaultProps as Record<string, unknown> | undefined,
  durationInFrames,
});

const propsOf = (key: keyof typeof airbnbShowcase) =>
  airbnbShowcase[key] as Record<string, unknown> | undefined;

/** Core / frequently used scenes */
export const CORE_SHOWCASE: ShowcaseEntry[] = [
  withProps("Metric-HeroMetric", HeroMetric, propsOf("HeroMetric")),
  withProps("Narrative-SideBySideCompare", SideBySideCompare),
  withProps("Chart-Bar", BarChart),
  withProps("Diagram-Flow", FlowDiagram),
  withProps("Chart-Ranking", RankingChart),
  withProps("Narrative-KeyTakeaway", KeyTakeaway),
  withProps("Media-Quote", QuoteCard, propsOf("QuoteCard")),
  withProps("Chart-Line", LineChart, propsOf("LineChart")),
  withProps("Chart-Candlestick", CandlestickChart),
  withProps("Chart-Donut", DonutChart, propsOf("DonutChart")),
  withProps("Chart-Waterfall", WaterfallChart),
  withProps("Table-Metric", MetricTable),
  withProps("Metric-Grid", MetricGrid),
  withProps("Narrative-BulletReveal", BulletReveal),
  withProps("Narrative-BeforeAfter", BeforeAfterCompare),
  withProps("Narrative-Equation", EquationCards),
  withProps("Diagram-Funnel", FunnelDiagram),
  withProps("Media-ImageCard", ImageCard, propsOf("ImageCard")),
  withProps("Media-LogoCloud", LogoCloud),
  withProps("Media-MapCallout", MapCallout, propsOf("MapCallout")),
  withProps("Metric-Share", ShareMetric, propsOf("ShareMetric")),
  withProps("Chart-Scatter", ScatterPlot),
  withProps("Media-ScreenshotZoom", ScreenshotZoom, propsOf("ScreenshotZoom")),
  withProps("Chart-StackedBar", StackedBarChart),
  withProps("Narrative-Timeline", Timeline),
  withProps("Diagram-UnitEconomics", UnitEconomicsDiagram),
  withProps("Overlay-Ticker", TickerPreview, propsOf("TickerOverlay")),
];

export const CHARTS_SHOWCASE: ShowcaseEntry[] = [
  withProps("Chart-GroupedBar", GroupedBarChart),
  withProps("Chart-PairedBar", PairedBarChart),
  withProps("Chart-Lollipop", LollipopChart),
  withProps("Chart-DotPlot", DotPlot),
  withProps("Chart-Bullet", BulletChart),
  withProps("Chart-DivergingBar", DivergingBarChart),
  withProps("Chart-Pareto", ParetoChart),
  withProps("Chart-ScenarioBar", ScenarioBarChart),
  withProps("Chart-Tornado", TornadoChart),
  withProps("Chart-VarianceComparison", VarianceComparisonChart),
  withProps("Chart-MultiLine", MultiLineChart),
  withProps("Chart-Area", AreaChart),
  withProps("Chart-StackedArea", StackedAreaChart),
  withProps("Chart-IndexedLine", IndexedLineChart),
  withProps("Chart-AnnotatedLine", AnnotatedLineChart, undefined, 180),
  withProps("Chart-EventStudy", EventStudyChart, undefined, 180),
  withProps("Chart-DualAxis", DualAxisChart, propsOf("DualAxisChart"), 210),
  withProps("Chart-ConnectedScatter", ConnectedScatterPlot, undefined, 180),
  withProps("Chart-Bump", BumpChart),
  withProps("Chart-IndexedComparison", IndexedComparisonChart, undefined, 180),
  withProps("Chart-Dumbbell", DumbbellChart),
  withProps("Chart-Slope", SlopeChart),
  withProps("Chart-SmallMultiples", SmallMultiples),
  withProps("Chart-BenchmarkBand", BenchmarkBandChart),
  withProps("Chart-Treemap", TreemapChart),
  withProps("Chart-Marimekko", MarimekkoChart),
  withProps("Chart-NestedComposition", NestedCompositionChart),
  withProps("Chart-Waffle", WaffleChart, undefined, 180),
  withProps(
    "Chart-DistributionBlocks",
    DistributionBlocksChart,
    propsOf("DistributionBlocksChart"),
    180,
  ),
  withProps("Chart-CompositionCompare", CompositionCompareChart),
  withProps("Chart-ContributionBar", ContributionBarChart),
  withProps("Chart-Pictogram", PictogramChart, undefined, 180),
  withProps("Chart-Histogram", Histogram),
  withProps("Chart-BoxPlot", BoxPlot),
  withProps("Chart-Beeswarm", BeeswarmPlot, undefined, 180),
  withProps("Chart-Ridgeline", RidgelinePlot, undefined, 180),
  withProps("Chart-DotStrip", DotStripPlot, undefined, 180),
  withProps("Chart-PopulationPyramid", PopulationPyramid, undefined, 180),
  withProps("Chart-Bubble", BubbleChart),
  withProps("Chart-Heatmap", Heatmap),
  withProps("Chart-CalendarHeatmap", CalendarHeatmap, undefined, 180),
  withProps("Chart-CohortMatrix", CohortMatrix),
  withProps("Chart-ForecastFan", ForecastFanChart),
  withProps("Chart-RangeBand", RangeBandChart),
  withProps("Chart-ParallelCoordinates", ParallelCoordinates),
  withProps("Chart-Radar", RadarChart),
  withProps("Chart-QuadrantScatter", QuadrantScatterChart),
];

export const DIAGRAMS_SHOWCASE: ShowcaseEntry[] = [
  withProps("Diagram-TwoSidedMarketplace", TwoSidedMarketplaceDiagram),
  withProps("Diagram-Sankey", SankeyDiagram, propsOf("SankeyDiagram"), 180),
  withProps(
    "Diagram-ValueChain",
    ValueChainDiagram,
    propsOf("ValueChainDiagram"),
    180,
  ),
  withProps("Diagram-ValueChainMap", ValueChainMap),
  withProps(
    "Diagram-RelationshipGraph",
    RelationshipGraph,
    propsOf("RelationshipGraph"),
    180,
  ),
  withProps("Diagram-CausalGraph", CausalGraph, propsOf("CausalGraph"), 180),
  withProps("Diagram-RivalryNetwork", RivalryNetworkDiagram),
  withProps("Diagram-CompetitiveLandscape", CompetitiveLandscapeDiagram),
  withProps("Diagram-EcosystemMap", EcosystemMap),
  withProps("Diagram-CapabilityVenn", CapabilityVennDiagram),
  withProps(
    "Diagram-HierarchyPyramid",
    HierarchyPyramid,
    propsOf("HierarchyPyramid"),
  ),
  withProps(
    "Diagram-OrganizationTree",
    OrganizationTree,
    propsOf("OrganizationTree"),
    180,
  ),
  withProps(
    "Diagram-OwnershipTree",
    OwnershipTree,
    propsOf("OwnershipTree"),
    180,
  ),
  withProps(
    "Diagram-BalanceSheet",
    BalanceSheetDiagram,
    propsOf("BalanceSheetDiagram"),
    180,
  ),
  withProps(
    "Diagram-CapitalStack",
    CapitalStackDiagram,
    propsOf("CapitalStackDiagram"),
    180,
  ),
];

export const FRAMEWORKS_SHOWCASE: ShowcaseEntry[] = [
  withProps("Framework-StrategyMatrix", StrategyMatrix, undefined, 180),
  withProps("Framework-RiskMatrix", RiskMatrix, undefined, 180),
  withProps(
    "Framework-PrioritizationMatrix",
    PrioritizationMatrix,
    undefined,
    180,
  ),
  withProps("Framework-OpportunityMatrix", OpportunityMatrix, undefined, 180),
  withProps("Framework-StrategicRoadmap", StrategicRoadmap, undefined, 180),
  withProps("Framework-ScenarioTree", ScenarioTree, undefined, 180),
  withProps("Framework-BridgeToTarget", BridgeToTarget, undefined, 180),
  withProps("Framework-IssueTree", IssueTree, undefined, 180),
  withProps(
    "Framework-MetricDriverTree",
    MetricDriverTree,
    propsOf("MetricDriverTree"),
    180,
  ),
  withProps("Framework-Swimlane", SwimlaneDiagram, undefined, 180),
];

export const TABLES_SHOWCASE: ShowcaseEntry[] = [
  withProps("Table-Sparkline", SparklineTable, undefined, 180),
  withProps("Table-BenchmarkScorecard", BenchmarkScorecard, undefined, 180),
  withProps(
    "Table-DistributionComparison",
    DistributionComparisonTable,
    propsOf("DistributionComparisonTable"),
    180,
  ),
  withProps("Table-CapabilityHeatmap", CapabilityHeatmap, undefined, 180),
];

export const NARRATIVE_SHOWCASE: ShowcaseEntry[] = [
  withProps("Narrative-CompareCards", CompareCards, propsOf("CompareCards")),
  withProps("Narrative-ExecutiveSummary", ExecutiveSummary, undefined, 180),
  withProps(
    "Narrative-PageFlipChoice",
    PageFlipChoice,
    propsOf("PageFlipChoice"),
  ),
];

export const MEDIA_SHOWCASE: ShowcaseEntry[] = [
  // already in CORE; keep empty extras if needed
];

export const OVERLAY_SHOWCASE: ShowcaseEntry[] = [
  withProps(
    "Overlay-PresenterOrbit",
    PresenterOrbitOverlay,
    propsOf("PresenterOrbitOverlay"),
  ),
];

export const METRICS_SHOWCASE: ShowcaseEntry[] = [
  withProps("Metric-Split", SplitMetric, propsOf("SplitMetric"), 120),
  withProps("Metric-FactGrid", FactGrid, undefined, 180),
];

/** Curated chart reel (~12) */
export const CHARTS_DEMO_IDS = [
  "Chart-PairedBar",
  "Chart-Treemap",
  "Chart-GroupedBar",
  "Chart-MultiLine",
  "Chart-RangeBand",
  "Chart-Tornado",
  "Chart-ForecastFan",
  "Chart-Marimekko",
  "Chart-Heatmap",
  "Chart-ScenarioBar",
  "Chart-Ridgeline",
  "Chart-AnnotatedLine",
] as const;

/** Curated diagrams reel */
export const DIAGRAMS_DEMO_IDS = [
  "Diagram-Sankey",
  "Diagram-ValueChain",
  "Diagram-OrganizationTree",
  "Diagram-OwnershipTree",
  "Diagram-CausalGraph",
  "Diagram-CompetitiveLandscape",
  "Diagram-RivalryNetwork",
  "Diagram-EcosystemMap",
  "Diagram-HierarchyPyramid",
  "Diagram-BalanceSheet",
  "Diagram-CapitalStack",
  "Diagram-TwoSidedMarketplace",
] as const;

/** Curated frameworks reel */
export const FRAMEWORKS_DEMO_IDS = [
  "Framework-IssueTree",
  "Framework-MetricDriverTree",
  "Framework-RiskMatrix",
  "Framework-StrategyMatrix",
  "Framework-StrategicRoadmap",
  "Framework-BridgeToTarget",
  "Framework-ScenarioTree",
  "Framework-OpportunityMatrix",
  "Framework-PrioritizationMatrix",
  "Framework-Swimlane",
  "Narrative-ExecutiveSummary",
  "Table-BenchmarkScorecard",
] as const;

const pick = (ids: readonly string[], pool: ShowcaseEntry[]) =>
  ids.map((id) => {
    const entry = pool.find((item) => item.id === id);
    if (!entry) throw new Error(`Missing showcase composition: ${id}`);
    return entry;
  });

export const ALL_SHOWCASE_COMPOSITIONS: ShowcaseEntry[] = [
  ...CORE_SHOWCASE,
  ...METRICS_SHOWCASE,
  ...CHARTS_SHOWCASE,
  ...TABLES_SHOWCASE,
  ...DIAGRAMS_SHOWCASE,
  ...FRAMEWORKS_SHOWCASE,
  ...NARRATIVE_SHOWCASE,
  ...OVERLAY_SHOWCASE,
];

export const CHARTS_DEMO_SHOWCASE = pick(
  CHARTS_DEMO_IDS,
  ALL_SHOWCASE_COMPOSITIONS,
);
export const DIAGRAMS_DEMO_SHOWCASE = pick(
  DIAGRAMS_DEMO_IDS,
  ALL_SHOWCASE_COMPOSITIONS,
);
export const FRAMEWORKS_DEMO_SHOWCASE = pick(
  FRAMEWORKS_DEMO_IDS,
  ALL_SHOWCASE_COMPOSITIONS,
);

/** @deprecated Use CORE_SHOWCASE */
export const STANDARD_SHOWCASE = CORE_SHOWCASE;
