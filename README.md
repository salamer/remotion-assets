# Finance Motion

Remotion component library for finance / business / data YouTube videos.

Style: **Soft Brutalism + Financial Editorial** — large type, ink/yellow, hard borders, no gradients.

```text
Data / assets
    ↓
Scene props / SceneSpec
    ↓
React scenes (semantic families)
    ↓
Design system (style/theme.ts)
    ↓
Remotion → MP4 / ProRes → NLE
```

## Quick start

```bash
pnpm install
pnpm dev
```

Studio reels:

| Composition          | Contents                                   |
| -------------------- | ------------------------------------------ |
| `CoreComponentsReel` | Core metrics / charts / narrative / media  |
| `ChartsReel`         | Curated advanced charts                    |
| `DiagramsReel`       | Flow / relationships / hierarchy / finance |
| `FrameworksReel`     | Strategy / planning / process              |
| `FullShowcaseReel`   | Everything                                 |

Render examples:

```bash
pnpm exec remotion render Metric-HeroMetric out/hero-metric.mp4
pnpm exec remotion render Chart-Line out/line-chart.mp4
pnpm exec remotion render CoreComponentsReel out/core-reel.mp4
```

## Semantic layout

```text
src/scenes/
├── metrics/
├── charts/        categorical · time-series · comparison · composition
│                  distribution · uncertainty · multivariate
├── tables/
├── diagrams/      flow · relationships · hierarchy · finance
├── frameworks/    strategy · planning · process
├── narrative/
├── media/
└── overlays/
```

```ts
import { HeroMetric, LineChart, SankeyDiagram, RiskMatrix } from "./scenes";
```

See **[CATALOG.md](./CATALOG.md)** for the full component list, **[component.md](./component.md)** for selection guidance, and **[MIGRATION.md](./MIGRATION.md)** for rename/move history.

## Scripts

```bash
pnpm lint          # eslint + tsc
pnpm build         # remotion bundle
pnpm exec tsc --noEmit
```
