# Charts

Quantitative scenes under `src/scenes/charts/`.

| Subfolder | Use for |
|---|---|
| `categorical/` | Bars, rankings, tornado, scenario bars |
| `time-series/` | Lines, areas, candles, event studies, dual-axis |
| `comparison/` | Dumbbell, slope, small multiples, benchmark bands |
| `composition/` | Donut, stacked, treemap, marimekko, waterfall, waffle |
| `distribution/` | Histogram, box, beeswarm, heatmap, scatter, bubble |
| `uncertainty/` | Forecast fan, range band |
| `multivariate/` | Parallel coordinates, radar, quadrant scatter |

**Pick carefully**

- Share of whole → composition (`DonutChart`, `TreemapChart`, …)
- Change over time → time-series
- Uncertainty around a path → uncertainty (not a plain `LineChart`)
- Qualitative 2×2 strategy → `frameworks/strategy`, not `QuadrantScatterChart`
