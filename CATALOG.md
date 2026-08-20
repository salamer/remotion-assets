# Component Catalog

Auto-generated from `src/scenes/`. Prefer this + `component.md` when selecting a scene.

| Component                   | Category               | Purpose                                  | Former name                                |
| --------------------------- | ---------------------- | ---------------------------------------- | ------------------------------------------ |
| BarChart                    | charts/categorical     | Category magnitudes as bars              | —                                          |
| BulletChart                 | charts/categorical     | Actual vs target performance             | —                                          |
| DivergingBarChart           | charts/categorical     | Positive/negative from center            | —                                          |
| DotPlot                     | charts/categorical     | Values as dots on a shared axis          | —                                          |
| GroupedBarChart             | charts/categorical     | Multiple series across categories        | —                                          |
| LollipopChart               | charts/categorical     | Sparse bar alternative with stems        | —                                          |
| PairedBarChart              | charts/categorical     | Two bars paired per category             | PairedBars                                 |
| ParetoChart                 | charts/categorical     | Bars + cumulative contribution           | —                                          |
| RankingChart                | charts/categorical     | Ordered ranking bars/list                | Ranking                                    |
| ScenarioBarChart            | charts/categorical     | Bear/base/bull scenario bars             | ScenarioBars                               |
| TornadoChart                | charts/categorical     | Sensitivity ranked by impact             | —                                          |
| VarianceComparisonChart     | charts/categorical     | Plan vs actual variance                  | VarianceComparison                         |
| BenchmarkBandChart          | charts/comparison      | Series against a band                    | —                                          |
| DumbbellChart               | charts/comparison      | Two-point comparison per row             | —                                          |
| SlopeChart                  | charts/comparison      | Two-period slope comparison              | —                                          |
| SmallMultiples              | charts/comparison      | Repeated mini charts                     | —                                          |
| CompositionCompareChart     | charts/composition     | Two compositions compared                | CompositionCompare                         |
| ContributionBarChart        | charts/composition     | Drivers contributing to total            | ContributionBars                           |
| DistributionBlocksChart     | charts/composition     | Block units of distribution              | DistributionBlocks                         |
| DonutChart                  | charts/composition     | Part-to-whole ring                       | Donut                                      |
| MarimekkoChart              | charts/composition     | Variable-width stacked composition       | Marimekko                                  |
| NestedCompositionChart      | charts/composition     | Hierarchy of parts                       | NestedComposition                          |
| PictogramChart              | charts/composition     | Icon array for proportions               | PictogramArray                             |
| StackedBarChart             | charts/composition     | Stacked category composition             | StackedBar                                 |
| TreemapChart                | charts/composition     | Nested area composition                  | Treemap                                    |
| WaffleChart                 | charts/composition     | Grid of unit squares for share           | —                                          |
| WaterfallChart              | charts/composition     | Bridge from start to end                 | Waterfall                                  |
| BeeswarmPlot                | charts/distribution    | Point density without overlap            | —                                          |
| BoxPlot                     | charts/distribution    | Quartiles and outliers                   | —                                          |
| BubbleChart                 | charts/distribution    | Scatter with size encoding               | —                                          |
| CalendarHeatmap             | charts/distribution    | Day/week activity intensity              | —                                          |
| CohortMatrix                | charts/distribution    | Cohort retention matrix                  | —                                          |
| DotStripPlot                | charts/distribution    | Dot density along a strip                | DotDensityStrip                            |
| Heatmap                     | charts/distribution    | Matrix intensity grid                    | —                                          |
| Histogram                   | charts/distribution    | Distribution of a continuous variable    | —                                          |
| PopulationPyramid           | charts/distribution    | Age/sex population structure             | —                                          |
| RidgelinePlot               | charts/distribution    | Stacked density ridges                   | —                                          |
| ScatterPlot                 | charts/distribution    | Two continuous variables                 | —                                          |
| ParallelCoordinates         | charts/multivariate    | Many dimensions as axes                  | —                                          |
| QuadrantScatterChart        | charts/multivariate    | Quantitative 2×2 scatter map             | QuadrantScatter                            |
| RadarChart                  | charts/multivariate    | Radial multivariate profile              | —                                          |
| AnnotatedLineChart          | charts/time-series     | Time series with callout events          | AnnotatedTimeSeries                        |
| AreaChart                   | charts/time-series     | Filled time series                       | —                                          |
| BumpChart                   | charts/time-series     | Rank changes over time                   | —                                          |
| CandlestickChart            | charts/time-series     | OHLC price candles                       | Candlestick                                |
| ConnectedScatterPlot        | charts/time-series     | Scatter path through time                | ConnectedScatter                           |
| DualAxisChart               | charts/time-series     | Bar + line on dual Y axes                | DualMetricChart                            |
| EventStudyChart             | charts/time-series     | Returns around an event window           | —                                          |
| IndexedComparisonChart      | charts/time-series     | Indexed peer ribbon comparison           | IndexedComparisonRibbon                    |
| IndexedLineChart            | charts/time-series     | Rebased index lines                      | —                                          |
| LineChart                   | charts/time-series     | Single series over time                  | —                                          |
| MultiLineChart              | charts/time-series     | Multiple series over time                | —                                          |
| StackedAreaChart            | charts/time-series     | Composition over time as areas           | —                                          |
| ForecastFanChart            | charts/uncertainty     | Forecast with uncertainty fan            | —                                          |
| RangeBandChart              | charts/uncertainty     | Range band around a series               | —                                          |
| BalanceSheetDiagram         | diagrams/finance       | Assets vs liabilities/equity             | BalanceSheet                               |
| CapitalStackDiagram         | diagrams/finance       | Capital stack layers                     | CapitalStack                               |
| FlowDiagram                 | diagrams/flow          | Sequential process nodes                 | Flow                                       |
| FunnelDiagram               | diagrams/flow          | Conversion funnel stages                 | Funnel                                     |
| SankeyDiagram               | diagrams/flow          | Magnitude-encoded flow ribbons           | SankeyFlow (expressive; editorial removed) |
| TwoSidedMarketplaceDiagram  | diagrams/flow          | Two-sided market flows                   | TwoSidedMarketplace                        |
| UnitEconomicsDiagram        | diagrams/flow          | Unit economics cascade                   | UnitEconomics                              |
| ValueChainDiagram           | diagrams/flow          | Margin/capture along stages              | ValueChain                                 |
| ValueChainMap               | diagrams/flow          | Players along a value chain              | —                                          |
| HierarchyPyramid            | diagrams/hierarchy     | Layered hierarchy pyramid                | —                                          |
| OrganizationTree            | diagrams/hierarchy     | Org reporting tree                       | —                                          |
| OwnershipTree               | diagrams/hierarchy     | Ownership / equity tree                  | —                                          |
| CapabilityVennDiagram       | diagrams/relationships | Overlapping capability sets              | VennCapabilities                           |
| CausalGraph                 | diagrams/relationships | Signed causal arrows                     | —                                          |
| CompetitiveLandscapeDiagram | diagrams/relationships | Competitive landscape map                | CompetitiveLandscape                       |
| EcosystemMap                | diagrams/relationships | Hub-and-spoke ecosystem                  | EcosystemHub                               |
| RelationshipGraph           | diagrams/relationships | Entity relationship network              | —                                          |
| RivalryNetworkDiagram       | diagrams/relationships | Competitor rivalry network               | RivalryNetwork                             |
| BridgeToTarget              | frameworks/planning    | Bridge from today to target              | —                                          |
| IssueTree                   | frameworks/planning    | Qualitative issue decomposition          | —                                          |
| MetricDriverTree            | frameworks/planning    | Quantitative KPI driver tree             | DriverTree (expressive; editorial removed) |
| ScenarioTree                | frameworks/planning    | Decision scenario branches               | —                                          |
| StrategicRoadmap            | frameworks/planning    | Phased strategic roadmap                 | —                                          |
| SwimlaneDiagram             | frameworks/process     | Who does what when                       | SwimlaneProcess                            |
| OpportunityMatrix           | frameworks/strategy    | Size × right-to-win matrix               | OpportunityMap                             |
| PrioritizationMatrix        | frameworks/strategy    | Value × effort matrix                    | —                                          |
| RiskMatrix                  | frameworks/strategy    | Probability × impact matrix              | —                                          |
| StrategyMatrix              | frameworks/strategy    | Qualitative strategy 2×2                 | —                                          |
| ImageCard                   | media                  | Photo/portrait card                      | —                                          |
| LogoCloud                   | media                  | Logo grid                                | —                                          |
| MapCallout                  | media                  | Geographic callout                       | —                                          |
| QuoteCard                   | media                  | Pull quote card                          | Quote                                      |
| ScreenshotZoom              | media                  | UI screenshot with zoom                  | —                                          |
| FactGrid                    | metrics                | Dense fact boxes of key stats            | FactBox                                    |
| HeroMetric                  | metrics                | One headline number with optional growth | BigNumber                                  |
| MetricGrid                  | metrics                | Small grid of KPI tiles                  | KPIGrid                                    |
| ShareMetric                 | metrics                | Single share / percentage as hero        | Percentage                                 |
| SplitMetric                 | metrics                | Two headline shares side by side         | HeroStatSplit                              |
| BeforeAfterCompare          | narrative              | Before/after narrative split             | BeforeAfter                                |
| BulletReveal                | narrative              | Staggered bullet reveal                  | —                                          |
| CompareCards                | narrative              | Visual A vs B cards                      | DuelCards                                  |
| EquationCards               | narrative              | Business equation cards                  | Equation                                   |
| ExecutiveSummary            | narrative              | Executive summary slide                  | —                                          |
| KeyTakeaway                 | narrative              | Single key takeaway                      | Callout                                    |
| PageFlipChoice              | narrative              | Binary narrative choice                  | —                                          |
| SideBySideCompare           | narrative              | Numeric A vs B compare                   | Compare                                    |
| Timeline                    | narrative              | Chronological milestones                 | —                                          |
| PresenterOrbitOverlay       | overlays               | Orbiting cards over presenter            | PresenterOrbitCards                        |
| TickerOverlay               | overlays               | Transparent market ticker                | Ticker                                     |
| BenchmarkScorecard          | tables                 | Peer scorecard table                     | —                                          |
| CapabilityHeatmap           | tables                 | Capability × entity score table          | —                                          |
| DistributionComparisonTable | tables                 | Paired distribution table                | —                                          |
| MetricTable                 | tables                 | Precise numeric table                    | DataTable                                  |
| SparklineTable              | tables                 | Table with inline sparklines             | —                                          |

_Total: 109 components_
