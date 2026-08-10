# Finance Motion Components

A reusable Remotion component library for finance, business, economics, and data-driven YouTube videos.

The system is intentionally simple:

```text
Data / Assets
    ↓
Scene Props / JSON
    ↓
React Components
    ↓
Tailwind Design System
    ↓
Remotion
    ↓
MP4 / ProRes 4444
    ↓
Premiere / DaVinci / Final Cut
```

The goal is **not complex motion graphics**.

The goal is:

> Use a small number of repeatable visual patterns to explain financial and business concepts clearly.

---

# 1. Visual Style

Style direction:

**Soft Brutalism + Financial Editorial Graphics**

Primary palette:

```text
Paper       #FAFAF7
Black       #111111
Yellow      #FFD43B
Muted       #737373
Soft Gray   #ECECE7
```

Typography:

```text
IBM Plex Mono
```

General rules:

```text
Border        2px black
Shadow        6px 6px 0 black
Border radius 0–4px
Large spacing
Large numbers
Minimal colors
Yellow = emphasis
Black = primary information
Gray = secondary information
```

Avoid:

```text
Gradients
Glow
Glassmorphism
Heavy blur
3D effects
Elastic animations
Random colors
Complex transitions
```

---

# 2. Animation Language

All animations should be driven by Remotion frames:

```tsx
const frame = useCurrentFrame();
```

Do not use:

```text
CSS transitions
CSS keyframes
setTimeout()
requestAnimationFrame()
runtime-dependent animation
```

Standard animation primitives:

```text
fadeUp
fadeLeft
scaleIn
grow
countUp
draw
highlight
```

Typical timing:

```text
Entrance       10–18 frames
Chart grow     20–40 frames
Line draw      30–60 frames
Stagger        5–10 frames/item
```

Most transitions between scenes should simply be:

```text
hard cut
```

---

# 3. Shared Components

## Frame

Base full-screen canvas.

```tsx
<Frame>
  ...
</Frame>
```

Provides:

* 1920×1080 layout
* Paper background
* Mono typography
* Consistent padding
* Optional subtle grid

Use for most full-screen scenes.

---

## BrutalCard

Standard visual container.

```tsx
<BrutalCard>
  Content
</BrutalCard>
```

Highlighted version:

```tsx
<BrutalCard yellow>
  Important Content
</BrutalCard>
```

Style:

```text
2px black border
6px hard shadow
white / yellow background
```

---

## SceneHeader

Standard title block.

```tsx
<SceneHeader
  eyebrow="AIRBNB / REVENUE"
  title="Revenue almost tripled."
  subtitle="Growth resumed after the pandemic."
/>
```

Use for most analytical scenes.

---

## Tag

Small highlighted label.

```tsx
<Tag>MARKET SHARE</Tag>

<Tag yellow>
  KEY POINT
</Tag>
```

Typical uses:

```text
QUOTE
2025
KEY POINT
MARKET SHARE
UNIT ECONOMICS
```

---

## Source

Source label at the bottom.

```tsx
<Source>
  COMPANY FILINGS
</Source>
```

Example:

```text
SOURCE / COMPANY FILINGS
```

---

# 4. Core Finance Components

# BigNumber

Use when **one number is the story**.

Examples:

```text
Revenue
Profit
GDP
Market Cap
Users
Debt
Growth rate
```

Example:

```tsx
<BigNumber
  company="AIRBNB"
  label="FY2025 REVENUE"
  value={11.1}
  suffix="B"
  growth={12}
/>
```

Visual:

```text
AIRBNB                         2025

FY2025 REVENUE

$11.1B

[ ▲ +12% ] year over year
```

Best for:

> “Airbnb generated $11.1 billion in revenue.”

---

# Compare

Use for **A vs B** comparisons.

Examples:

```text
Airbnb vs Marriott
Japan vs Germany
AWS vs Azure
2020 vs 2025
Old model vs new model
```

Example:

```tsx
<Compare />
```

Visual:

```text
🏠 AIRBNB            🏨 MARRIOTT

$11.1B               $25.1B
Revenue              Revenue
```

Prefer two items only.

For larger comparisons use `DataTable` or `Ranking`.

---

# BarChart

Use for **discrete values over time or categories**.

Examples:

```text
Annual revenue
GDP by country
Market size
Company profits
Industry output
```

Visual:

```text
       █
       █
    █  █
 █  █  █
 █  █  █
────────────
22 23 24
```

Use when differences between individual periods matter.

---

# LineChart

Use for **continuous trends**.

Examples:

```text
Stock prices
GDP growth
Revenue growth
Population
Margins
Interest rates
```

Example data:

```tsx
[
  {label: "2020", value: 3.4},
  {label: "2021", value: 6.0},
  {label: "2022", value: 8.4},
  {label: "2023", value: 9.9},
]
```

Typical animation:

```text
axes
↓
line draws left → right
↓
points appear
↓
latest value highlighted
```

---

# Ranking

Use when **order matters**.

Examples:

```text
Largest companies
Market share
Top countries
Top products
Advertising platforms
```

Visual:

```text
🔎 GOOGLE    █████████████    46%
👥 META      ███████          23%
📦 AMAZON    ████             14%
🎵 TIKTOK    ██                8%
```

Prefer:

```text
3–7 items
```

---

# Percentage

Use when **one percentage deserves emphasis**.

Examples:

```text
46% market share
72% revenue concentration
35% export exposure
```

Visual:

```text
46%

█████████░░░░░░░░░░
0%                100%
```

Prefer this over a pie chart when only one percentage matters.

---

# Donut

Use for **one major part of a whole**.

Example:

```text
72%

CORE BUSINESS
```

Good for:

```text
Revenue mix
Customer mix
Domestic vs international
Subscription share
```

Avoid using many donut slices.

---

# StackedBar

Use for **composition**.

Examples:

```text
Revenue mix
GDP components
Market share
Cost structure
User types
```

Visual:

```text
| CORE 55% | ADS 25% | OTHER 20% |
```

Better than a pie when labels are important.

---

# Waterfall

Use for **value decomposition**.

Examples:

```text
Revenue → Profit
EBITDA → Net income
Starting cash → Ending cash
GDP contribution
```

Typical story:

```text
$100 Revenue
 -25 COGS
 -15 Sales
 -12 R&D
-------------
 $48 Profit
```

Use simplified presentation for video clarity.

---

# UnitEconomics

Use for **explaining what happens to one transaction**.

Example:

```text
$100 BOOKING

| HOST $82                       | AIRBNB $18 |
```

Excellent for:

```text
Marketplace take rate
Payment fees
Delivery economics
Advertising economics
E-commerce commissions
```

---

# KPIGrid

Use when the viewer needs **a snapshot of the entire business**.

Example:

```text
💰 Revenue        $11.1B
📈 Net income      $2.6B
👤 Users             220M
⚙️ Margin              23%
```

Ideal number of KPIs:

```text
4
```

Maximum:

```text
6
```

---

# DataTable

Use when **precision matters more than visual trend**.

Examples:

```text
Company comparisons
Financial statements
Country statistics
Valuation multiples
Industry metrics
```

Example:

```text
COMPANY     REVENUE   MARGIN   VALUE
Airbnb      $11.1B     23%     $92B
Booking     $23.7B     31%    $175B
Marriott    $25.1B     12%     $75B
```

Prefer tables when viewers need exact values.

---

# Candlestick

Use for:

```text
Stocks
FX
Crypto
Commodity prices
```

Only use when candlestick behavior itself matters.

For simple price direction use `LineChart`.

---

# ScatterPlot

Use when explaining **relationships between two variables**.

Examples:

```text
Growth vs valuation
ROE vs P/E
GDP vs productivity
Income vs consumption
Working hours vs GDP per capita
```

Visual:

```text
VALUATION
│                D
│       B
│            C
│  A
└────────────────── GROWTH
```

Best when you want to show:

```text
clusters
outliers
tradeoffs
correlation
```

---

# 5. Explanation Components

# Flow

One of the most important components.

Use for:

```text
Business models
Money flows
Supply chains
Transactions
Credit creation
Industry structure
```

Example:

```text
🧳 GUEST
    ↓
   $100
    ↓
🏠 AIRBNB
    ↓
   fee
    ↓
👤 HOST
```

Rule:

> Reveal nodes progressively instead of showing the whole graph immediately.

---

# Timeline

Use for:

```text
Company history
Policy history
Technology development
Financial crises
Product launches
Economic cycles
```

Example:

```text
2007        2011        2020        2024
 ●───────────●────────────●────────────●
Idea         Global       IPO          Scale
```

Ideal number of points:

```text
4–7
```

---

# Funnel

Use for conversion processes.

Examples:

```text
Visitors
↓
Signups
↓
Active users
↓
Paying users
```

Also useful for:

```text
TAM
SAM
SOM
```

Visual:

```text
████████████████ 100M visitors
 ███████████      38M signup
  ███████         18M active
    ███            7M paying
```

---

# BeforeAfter

Use when explaining **structural change**.

Examples:

```text
Before AI / After AI
Hotel / Platform
2010 / 2025
Old supply chain / New supply chain
Before QE / After QE
```

Visual:

```text
BEFORE                AFTER

🏨                     💻
Own assets             Own platform

Buildings              Software
Employees              Network
Maintenance            Brand
```

---

# Equation

Use to reduce a business into a simple model.

Examples:

```text
PROFIT
=
REVENUE
-
COST
```

Other examples:

```text
Revenue
=
Users × ARPU
```

```text
GDP
=
Consumption
+
Investment
+
Government
+
Net Exports
```

Keep formulas conceptual rather than academic.

---

# BulletReveal

Use for sequential reasoning.

Example:

```text
🏠 Does not own inventory
💻 Runs the marketplace
💰 Takes transaction fees
🌍 Scales internationally
```

Do not reveal all bullets immediately.

Reveal them alongside narration.

---

# Callout

Use when **one sentence is the entire point**.

Example:

```text
[ THE KEY POINT ]

Airbnb does not need to build
a hotel to add another room.
```

Good for pacing between dense analytical scenes.

---

# 6. Source / Evidence Components

# Quote

Use for:

```text
CEO quotes
Annual report statements
Earnings calls
Central bank statements
Government documents
Analyst comments
```

Example:

```text
[ QUOTE ]

“We believe travel is
fundamentally changing.”

BRIAN CHESKY
CEO / AIRBNB
```

Always keep source information available.

---

# ImageCard

Use for:

```text
CEO
Founder
Product
Factory
Building
Historical person
Company office
```

Example:

```tsx
<ImageCard
  publicPath="images/brian.jpg"
  title="BRIAN CHESKY"
  subtitle="Co-founder & CEO / Airbnb"
/>
```

Assets go in:

```text
public/images/
```

Use Remotion:

```tsx
staticFile("images/brian.jpg")
```

---

# ScreenshotZoom

Extremely useful for evidence-heavy financial videos.

Use for:

```text
10-K
Annual reports
News articles
Company websites
Charts
Government reports
Research papers
```

Example:

```tsx
<ScreenshotZoom
  publicPath="screenshots/airbnb-10k.png"
  focusX={68}
  focusY={63}
/>
```

Animation:

```text
full page
↓
slow zoom
↓
important number / sentence
```

This visually connects a claim to its source.

---

# MapCallout

Use for geographic arguments.

Examples:

```text
Factory location
Revenue geography
Trade routes
Market expansion
Regional concentration
Population
```

Prefer generating the underlying map using:

```text
Datawrapper
SVG
Natural Earth data
```

Then use Remotion for:

```text
highlight
label
zoom
annotation
```

---

# 7. Context Components

# LogoCloud

Use to quickly introduce a market or competitive landscape.

Example:

```text
🤖 OPENAI     🧠 ANTHROPIC     🔎 GOOGLE

👥 META       ⚡ XAI           ☁️ AWS
```

Good for:

```text
competition
industry participants
customers
suppliers
ecosystem
```

Do not use for precise comparisons.

Use `Ranking`, `Compare`, or `DataTable` instead.

---

# Ticker

Overlay component.

Use over:

```text
B-roll
CEO footage
Factory footage
Website footage
News clips
```

Example:

```text
AIRBNB | ABNB | ▲ +4.6% | $92B
```

Ticker should **not** use the full-screen `Frame` component.

It is intended for transparent video export.

---

# 8. Full-Screen vs Overlay Components

## Full-Screen

Usually render with paper background:

```text
BigNumber
Compare
BarChart
LineChart
Ranking
Percentage
Donut
Timeline
Flow
Quote
ImageCard
ScreenshotZoom
KPIGrid
DataTable
StackedBar
Waterfall
UnitEconomics
Funnel
BeforeAfter
BulletReveal
Equation
ScatterPlot
MapCallout
LogoCloud
Callout
Candlestick
```

Default:

```text
1920 × 1080
30 FPS
```

---

## Overlay

Transparent background:

```text
Ticker
Small KPI
Labels
Arrows
Highlights
Lower thirds
Callout labels
```

Render overlays as:

```text
ProRes 4444
alpha channel
```

Then place them above B-roll in the editor.

---

# 9. Asset Structure

Recommended:

```text
public/

├── fonts/
│   ├── IBMPlexMono-Regular.woff2
│   └── IBMPlexMono-SemiBold.woff2
│
├── images/
│   ├── ceos/
│   ├── companies/
│   ├── products/
│   └── historical/
│
├── screenshots/
│   ├── filings/
│   ├── websites/
│   └── articles/
│
├── charts/
│   ├── datawrapper/
│   └── custom/
│
├── maps/
│
└── logos/
```

Use:

```tsx
staticFile("images/example.jpg")
```

instead of hardcoded filesystem paths.

---

# 10. Component Selection Guide

Use this decision tree:

```text
What are you trying to say?
│
├─ One important number
│    └─ BigNumber
│
├─ A vs B
│    └─ Compare
│
├─ Trend over time
│    ├─ Continuous → LineChart
│    └─ Discrete   → BarChart
│
├─ Ranking
│    └─ Ranking
│
├─ Exact comparison
│    └─ DataTable
│
├─ One percentage
│    └─ Percentage
│
├─ Composition
│    ├─ Simple → StackedBar
│    └─ Circular emphasis → Donut
│
├─ Value decomposition
│    └─ Waterfall
│
├─ Transaction economics
│    └─ UnitEconomics
│
├─ Business process
│    └─ Flow
│
├─ Conversion
│    └─ Funnel
│
├─ Historical progression
│    └─ Timeline
│
├─ Structural change
│    └─ BeforeAfter
│
├─ Relationship between variables
│    └─ ScatterPlot
│
├─ Geographic argument
│    └─ MapCallout
│
├─ Source evidence
│    ├─ Text → Quote
│    └─ Document → ScreenshotZoom
│
├─ Person / Product / Physical asset
│    └─ ImageCard
│
├─ Multiple headline metrics
│    └─ KPIGrid
│
├─ Sequential explanation
│    └─ BulletReveal
│
├─ Simple conceptual model
│    └─ Equation
│
└─ One important conclusion
     └─ Callout
```

---

# 11. Recommended Scene Rhythm

A finance video should not look like a presentation deck.

Mix visual types.

Example:

```text
00:00  Callout
00:06  ImageCard
00:12  BigNumber
00:18  LineChart
00:27  B-roll + Ticker
00:34  Flow
00:45  ScreenshotZoom
00:53  Compare
01:02  B-roll
01:10  UnitEconomics
01:20  Quote
01:28  BarChart
01:38  Callout
```

A useful general rhythm is:

```text
Reality
↓
Model
↓
Data
↓
Evidence
↓
Reality
```

Example:

```text
Hotel footage
↓
Airbnb business Flow
↓
Revenue chart
↓
10-K ScreenshotZoom
↓
Airbnb apartment footage
```

---

# 12. Scene Specification

Long-term, components should be controlled through data rather than manually editing JSX.

Example:

```json
{
  "type": "big-number",
  "company": "AIRBNB",
  "label": "FY2025 REVENUE",
  "value": 11.1,
  "suffix": "B",
  "growth": 12
}
```

Another example:

```json
{
  "type": "quote",
  "quote": "We believe travel is fundamentally changing.",
  "author": "BRIAN CHESKY",
  "role": "CEO / AIRBNB"
}
```

A complete video can eventually become:

```json
[
  {
    "type": "callout",
    "text": "Airbnb is not really a hotel company."
  },
  {
    "type": "big-number",
    "company": "AIRBNB",
    "label": "REVENUE",
    "value": 11.1,
    "suffix": "B"
  },
  {
    "type": "flow",
    "nodes": [
      {
        "icon": "🧳",
        "title": "GUEST"
      },
      {
        "icon": "🏠",
        "title": "AIRBNB"
      },
      {
        "icon": "👤",
        "title": "HOST"
      }
    ]
  }
]
```

Target architecture:

```text
Script
↓
Visual Beat Extraction
↓
SceneSpec JSON
↓
SceneRenderer
↓
Remotion
↓
Video
```

---

# 13. Component Philosophy

The library should remain intentionally small.

Before creating a new component, ask:

> Can this idea be expressed using an existing visual grammar?

Prefer:

```text
BigNumber
Compare
Trend
Composition
Flow
Evidence
Callout
```

over creating a new visual effect for every video.

The channel's identity should come from:

```text
consistent typography
consistent spacing
consistent yellow highlight
consistent borders
consistent animations
consistent visual reasoning
```

—not from complex animation.

---

# 14. Current Component Inventory

```text
CORE DATA
├── BigNumber
├── Compare
├── BarChart
├── LineChart
├── Ranking
├── Percentage
├── Donut
├── StackedBar
├── Waterfall
├── KPIGrid
├── DataTable
├── ScatterPlot
└── Candlestick

EXPLANATION
├── Flow
├── Timeline
├── Funnel
├── UnitEconomics
├── BeforeAfter
├── BulletReveal
├── Equation
└── Callout

EVIDENCE / MEDIA
├── Quote
├── ImageCard
├── ScreenshotZoom
└── MapCallout

CONTEXT
├── LogoCloud
└── Ticker

PRIMITIVES
├── Frame
├── BrutalCard
├── SceneHeader
├── Tag
└── Source
```

---

# 15. Rule of Thumb

When editing a script, every visual beat should answer one of these questions:

```text
What?
→ Image / Callout

How much?
→ BigNumber

Compared with what?
→ Compare

How did it change?
→ LineChart / BarChart

Where does it come from?
→ StackedBar / Waterfall

How does the system work?
→ Flow

What happens to $1?
→ UnitEconomics

What happened first?
→ Timeline

Who dominates?
→ Ranking

Where?
→ MapCallout

What is the evidence?
→ Quote / ScreenshotZoom

What is the conclusion?
→ Callout
```

If the component does not make the spoken argument easier to understand, do not show it.

---

# 16. Design Principle

The final goal is:

```text
not:

"make every frame beautiful"

but:

"make every argument visible"
```

The component library exists to convert:

```text
abstract financial reasoning
```

into:

```text
simple spatial relationships
+
numbers
+
evidence
+
motion
```

with as little production overhead as possible.
