/**
 * Airbnb 商业数据 — 全组件 Studio 展示用 defaultProps
 * 数字为演示/近似值，便于财经视频叙事。
 */

import type { PresenterOrbitItem } from "../../scenes/overlays/PresenterOrbitOverlay";
import type {
  CausalLink,
  CausalNode,
} from "../../scenes/diagrams/relationships/CausalGraph";
import type { OrganizationNode } from "../../scenes/diagrams/hierarchy/OrganizationTree";
import type { OwnershipNode } from "../../scenes/diagrams/hierarchy/OwnershipTree";
import type { DriverNode } from "../../scenes/frameworks/planning/MetricDriverTree";
import type {
  SankeyLink,
  SankeyNode,
} from "../../scenes/diagrams/flow/SankeyDiagram";
import type { ValueChainStage } from "../../scenes/diagrams/flow/ValueChainDiagram";
import type { CapitalLayer } from "../../scenes/diagrams/finance/CapitalStackDiagram";
import type { BalanceSheetItem } from "../../scenes/diagrams/finance/BalanceSheetDiagram";
import type {
  GraphLink,
  GraphNode,
} from "../../scenes/diagrams/relationships/RelationshipGraph";

export const AIRBNB_REVENUE = [
  { year: "2020", value: 3.4 },
  { year: "2021", value: 6.0 },
  { year: "2022", value: 8.4 },
  { year: "2023", value: 9.9 },
  { year: "2024", value: 11.1 },
];

export const airbnbShowcase = {
  HeroMetric: {
    company: "AIRBNB",
    label: "FY2025 REVENUE",
    value: 11.1,
    suffix: "B",
    growth: 12,
  },

  QuoteCard: {
    quote: "We believe travel is fundamentally changing.",
    author: "BRIAN CHESKY",
    role: "CEO / AIRBNB",
  },

  LineChart: {
    eyebrow: "AIRBNB / REVENUE",
    title: "Growth resumed after the pandemic.",
    data: AIRBNB_REVENUE,
  },

  DonutChart: {
    value: 82,
  },

  ShareMetric: {
    value: 23,
    label: "AIRBNB OPERATING MARGIN",
  },

  ImageCard: {
    emoji: "👤",
    title: "BRIAN CHESKY",
    subtitle: "Co-founder & CEO / Airbnb",
  },

  MapCallout: {
    emoji: "🌍",
    label: "PARIS",
    x: 48,
    y: 38,
  },

  ScreenshotZoom: {
    emoji: "📊",
    focusX: 55,
    focusY: 45,
  },

  TickerOverlay: {
    company: "AIRBNB",
    ticker: "ABNB",
    change: "+4.6%",
    value: "$92B",
  },

  HierarchyPyramid: {
    eyebrow: "VALUE CHAIN",
    title: "Most economic rent sits at the top of travel.",
    tiers: [
      {
        label: "PLATFORM",
        sublabel: "Airbnb",
        description: "Network + brand + trust layer",
        icon: "💻",
        accent: true,
      },
      {
        label: "SUPPLY",
        sublabel: "Hosts",
        description: "Unique inventory at scale",
        icon: "🏠",
      },
      {
        label: "SERVICES",
        sublabel: "Local ops",
        description: "Cleaning, support, insurance",
        icon: "🧹",
      },
      {
        label: "COMMODITY",
        sublabel: "Utilities",
        description: "Power, water, maintenance",
        icon: "⚙️",
      },
    ],
    footer: {
      label: "NO HOTEL OWNERSHIP",
      description: "Asset-light vs traditional hospitality",
      icon: "🏨",
    },
    source: "COMPANY FILINGS / INDUSTRY ESTIMATES",
  },

  CompareCards: {
    transparent: false,
    showVs: true,
    left: {
      label: "AIRBNB",
      sublabel: "Platform model",
      icon: "🏠",
      note: "7.7M listings · asset-light",
      accent: true,
    },
    right: {
      label: "MARRIOTT",
      sublabel: "Hotel chain",
      icon: "🏨",
      note: "9,000+ owned & managed hotels",
    },
  },

  DistributionBlocksChart: {
    eyebrow: "BOOKING ECONOMICS",
    title: "A small share of nights drives most platform revenue.",
    groups: [
      { label: "CASUAL HOSTS", value: 12, people: 5, blocks: 5 },
      { label: "PRO HOSTS", value: 28, people: 4, blocks: 14 },
      { label: "SUPER HOSTS", value: 60, people: 1, blocks: 26, accent: true },
    ],
    unit: "%",
    source: "COMPANY FILINGS",
  },

  PresenterOrbitOverlay: {
    transparent: false,
    items: [
      {
        label: "RATES",
        sublabel: "Mortgage & credit",
        icon: "🏦",
        state: "default",
      },
      {
        label: "DEMAND",
        sublabel: "Travel recovery",
        icon: "🛒",
        state: "accent",
      },
      {
        label: "SUPPLY",
        sublabel: "Host listings",
        icon: "🏠",
        state: "accent",
      },
      {
        label: "REGULATION",
        sublabel: "City rules",
        icon: "⚖️",
        state: "default",
      },
    ] satisfies PresenterOrbitItem[],
  },

  DualAxisChart: {
    eyebrow: "AIRBNB / NIGHTS & ADR",
    title: "Nights rebounded while average rates kept rising.",
    barLabel: "NIGHTS BOOKED",
    lineLabel: "AVERAGE DAILY RATE",
    leftUnit: "M",
    rightUnit: "$",
    data: [
      { label: "2019", bar: 327, line: 143 },
      { label: "2020", bar: 193, line: 120 },
      { label: "2021", bar: 300, line: 152 },
      { label: "2022", bar: 393, line: 161 },
      { label: "2023", bar: 448, line: 168 },
      { label: "2024", bar: 491, line: 175 },
    ],
    source: "COMPANY FILINGS",
  },

  RelationshipGraph: {
    eyebrow: "AIRBNB ECOSYSTEM",
    title: "The platform sits between guests, hosts, and capital.",
    nodes: [
      {
        id: "platform",
        label: "AIRBNB",
        sublabel: "Matching + trust",
        icon: "💻",
        x: 0.5,
        y: 0.34,
        accent: true,
      },
      {
        id: "guests",
        label: "GUESTS",
        sublabel: "Demand",
        icon: "🧳",
        x: 0.18,
        y: 0.72,
      },
      {
        id: "hosts",
        label: "HOSTS",
        sublabel: "Supply",
        icon: "🏠",
        x: 0.5,
        y: 0.75,
      },
      {
        id: "capital",
        label: "INVESTORS",
        sublabel: "Public markets",
        icon: "💰",
        x: 0.82,
        y: 0.72,
      },
    ] satisfies GraphNode[],
    links: [
      {
        from: "platform",
        to: "guests",
        label: "bookings",
        accent: true,
        bend: -60,
      },
      { from: "platform", to: "hosts", label: "payouts", bend: 20 },
      { from: "platform", to: "capital", label: "returns", bend: -60 },
    ] satisfies GraphLink[],
  },

  DistributionComparisonTable: {
    eyebrow: "CITY ECONOMICS",
    title: "Host income is uneven across markets.",
    rows: [
      { name: "PARIS", left: 4.2, right: 58.1, icon: "🗼" },
      { name: "NEW YORK", left: 3.8, right: 62.4, icon: "🌆" },
      { name: "TOKYO", left: 2.1, right: 48.7, icon: "🗾" },
      { name: "BARCELONA", left: 5.6, right: 71.2, icon: "🏖️" },
      { name: "MIAMI", left: 1.9, right: 55.8, icon: "🌴" },
    ],
    leftLabel: "BOTTOM HOSTS",
    middleLabel: "CITY",
    rightLabel: "TOP HOSTS",
    leftUnit: "%",
    rightUnit: "%",
    source: "INTERNAL ESTIMATES",
  },

  PageFlipChoice: {
    eyebrow: "AIRBNB GROWTH",
    question: "WHAT DRIVES THE NEXT LEG?",
    left: {
      label: "SUPPLY",
      sublabel: "More hosts & listings",
      icon: "🏠",
      accent: true,
    },
    right: {
      label: "DEMAND",
      sublabel: "More nights & experiences",
      icon: "🧳",
    },
  },

  SplitMetric: {
    eyebrow: "THE SHIFT",
    leftValue: 82,
    rightValue: 18,
    leftSuffix: "%",
    rightSuffix: "%",
    leftLabel: "Of booking value goes to hosts",
    rightLabel: "Airbnb take rate on a typical stay",
    rightTag: "TAKE RATE",
  },

  OrganizationTree: {
    eyebrow: "AIRBNB / ORG",
    title: "Product, trust, and host ops sit under one platform CEO.",
    root: {
      id: "ceo",
      label: "CEO",
      subtitle: "Brian Chesky",
      icon: "👤",
      accent: true,
      children: [
        {
          id: "product",
          label: "PRODUCT",
          subtitle: "App · Search · Trust",
          icon: "💻",
          children: [
            {
              id: "search",
              label: "SEARCH",
              subtitle: "Matching",
              icon: "🔎",
              accent: true,
            },
            {
              id: "trust",
              label: "TRUST",
              subtitle: "Reviews & safety",
              icon: "🛡️",
            },
          ],
        },
        {
          id: "ops",
          label: "OPS",
          subtitle: "Hosts · Support",
          icon: "🏠",
          children: [
            {
              id: "hosts",
              label: "HOSTS",
              subtitle: "Supply growth",
              icon: "🗝️",
            },
            {
              id: "support",
              label: "SUPPORT",
              subtitle: "Guest care",
              icon: "🎧",
            },
          ],
        },
        {
          id: "finance",
          label: "FINANCE",
          subtitle: "CFO · FP&A",
          icon: "💰",
          children: [
            { id: "fpna", label: "FP&A", subtitle: "Planning", icon: "📊" },
            {
              id: "treasury",
              label: "TREASURY",
              subtitle: "Liquidity",
              icon: "🏦",
            },
          ],
        },
      ],
    } satisfies OrganizationNode,
    source: "COMPANY ORG / ILLUSTRATIVE",
  },

  OwnershipTree: {
    eyebrow: "CORPORATE STRUCTURE",
    title: "Public float sits above the operating platform.",
    root: {
      id: "public",
      label: "PUBLIC MARKETS",
      subtitle: "ABNB shareholders",
      icon: "📈",
      accent: true,
      children: [
        {
          id: "airbnb",
          label: "AIRBNB INC.",
          subtitle: "Operating company",
          icon: "🏠",
          ownershipPct: 100,
          children: [
            {
              id: "platform",
              label: "PLATFORM",
              subtitle: "Marketplace ops",
              icon: "💻",
              ownershipPct: 100,
              accent: true,
            },
            {
              id: "payments",
              label: "PAYMENTS",
              subtitle: "Settlement layer",
              icon: "💳",
              ownershipPct: 100,
            },
          ],
        },
        {
          id: "china",
          label: "CHINA JV",
          subtitle: "Historical structure",
          icon: "🌏",
          ownershipPct: 0,
          muted: true,
        },
      ],
    } satisfies OwnershipNode,
    source: "CORPORATE FILINGS / ILLUSTRATIVE",
  },

  SankeyDiagram: {
    eyebrow: "BOOKING VALUE FLOW",
    title: "Most of the stay value goes to hosts — Airbnb takes the fee.",
    nodes: [
      {
        id: "guest",
        label: "GUEST",
        subtitle: "Booking value",
        icon: "🧳",
        column: 0,
        order: 0,
      },
      {
        id: "airbnb",
        label: "AIRBNB",
        subtitle: "Platform pool",
        icon: "🏠",
        column: 1,
        order: 0,
        accent: true,
      },
      {
        id: "host",
        label: "HOST",
        subtitle: "Payout",
        icon: "🗝️",
        column: 2,
        order: 0,
      },
      {
        id: "fee",
        label: "TAKE RATE",
        subtitle: "Service fee",
        icon: "💰",
        column: 2,
        order: 1,
        accent: true,
      },
      {
        id: "tax",
        label: "TAX / OTHER",
        subtitle: "Local rules",
        icon: "🧾",
        column: 2,
        order: 2,
      },
    ] satisfies SankeyNode[],
    links: [
      { from: "guest", to: "airbnb", value: 100, label: "100", accent: true },
      { from: "airbnb", to: "host", value: 82, label: "82" },
      { from: "airbnb", to: "fee", value: 14, label: "14", accent: true },
      { from: "airbnb", to: "tax", value: 4, label: "4" },
    ] satisfies SankeyLink[],
    unit: "%",
    source: "ILLUSTRATIVE BOOKING ECONOMICS",
  },

  ValueChainDiagram: {
    eyebrow: "TRAVEL VALUE CHAIN",
    title: "The platform captures rent without owning hotel rooms.",
    stages: [
      {
        label: "DEMAND",
        subtitle: "Guest discovery",
        icon: "🧳",
        metric: 18,
        metricLabel: "TAKE RATE",
        unit: "%",
        capture: 18,
      },
      {
        label: "PLATFORM",
        subtitle: "Matching + trust",
        icon: "💻",
        metric: 72,
        metricLabel: "GROSS MARGIN",
        unit: "%",
        capture: 42,
        accent: true,
      },
      {
        label: "SUPPLY",
        subtitle: "Host inventory",
        icon: "🏠",
        metric: 82,
        metricLabel: "HOST SHARE",
        unit: "%",
        capture: 28,
      },
      {
        label: "SERVICES",
        subtitle: "Cleaning · support",
        icon: "🧹",
        metric: 22,
        metricLabel: "GROSS MARGIN",
        unit: "%",
        capture: 8,
      },
      {
        label: "ASSET",
        subtitle: "Real estate",
        icon: "🏨",
        metric: 8,
        metricLabel: "AIRBNB EXPOSURE",
        unit: "%",
        capture: 4,
      },
    ] satisfies ValueChainStage[],
    source: "COMPANY FILINGS / INDUSTRY ESTIMATES",
  },

  MetricDriverTree: {
    eyebrow: "REVENUE DRIVERS",
    title: "Nights booked × ADR still explain most of Airbnb revenue.",
    root: {
      id: "revenue",
      label: "REVENUE",
      subtitle: "$11.1B",
      icon: "💰",
      accent: true,
      children: [
        {
          id: "nights",
          label: "NIGHTS",
          subtitle: "491M",
          icon: "🛏️",
          relation: "×",
          children: [
            {
              id: "listings",
              label: "LISTINGS",
              subtitle: "7.7M",
              icon: "🏠",
              relation: "×",
            },
            {
              id: "occupancy",
              label: "OCCUPANCY",
              subtitle: "Utilization",
              icon: "📅",
              relation: "×",
            },
          ],
        },
        {
          id: "adr",
          label: "ADR",
          subtitle: "$175",
          icon: "🏷️",
          relation: "×",
          children: [
            {
              id: "mix",
              label: "MIX",
              subtitle: "City & length",
              icon: "🌍",
              relation: "×",
              accent: true,
            },
            {
              id: "take",
              label: "TAKE RATE",
              subtitle: "~14–18%",
              icon: "📈",
              relation: "×",
            },
          ],
        },
      ],
    } satisfies DriverNode,
    source: "COMPANY FILINGS / ILLUSTRATIVE",
  },

  CausalGraph: {
    eyebrow: "TRAVEL DEMAND",
    title: "Rates and wages feed into nights booked with a lag.",
    subtitle: "Signed arrows show direction of effect.",
    nodes: [
      {
        id: "rates",
        label: "RATES",
        subtitle: "Mortgage & credit",
        icon: "🏦",
        x: 0.1,
        y: 0.28,
        direction: "up",
      },
      {
        id: "wages",
        label: "WAGES",
        subtitle: "Household income",
        icon: "💵",
        x: 0.1,
        y: 0.78,
        direction: "up",
      },
      {
        id: "demand",
        label: "DEMAND",
        subtitle: "Trips planned",
        icon: "🧳",
        x: 0.4,
        y: 0.52,
        accent: true,
        direction: "up",
      },
      {
        id: "nights",
        label: "NIGHTS",
        subtitle: "Booked stays",
        icon: "🛏️",
        x: 0.68,
        y: 0.28,
        accent: true,
        direction: "up",
      },
      {
        id: "adr",
        label: "ADR",
        subtitle: "Average rate",
        icon: "🏷️",
        x: 0.68,
        y: 0.78,
        direction: "up",
      },
      {
        id: "revenue",
        label: "REVENUE",
        subtitle: "GMV × take",
        icon: "💰",
        x: 0.92,
        y: 0.52,
        accent: true,
        direction: "up",
      },
    ] satisfies CausalNode[],
    links: [
      { from: "rates", to: "demand", sign: "−", label: "financing", bend: -55 },
      {
        from: "wages",
        to: "demand",
        sign: "+",
        label: "spending",
        bend: 55,
        accent: true,
      },
      {
        from: "demand",
        to: "nights",
        sign: "+",
        label: "trips",
        accent: true,
        bend: -30,
      },
      { from: "demand", to: "adr", sign: "+", label: "pricing", bend: 35 },
      { from: "nights", to: "revenue", sign: "+", label: "volume", bend: -25 },
      {
        from: "adr",
        to: "revenue",
        sign: "+",
        label: "rate × take",
        bend: 25,
        accent: true,
      },
    ] satisfies CausalLink[],
    source: "ILLUSTRATIVE DEMAND MODEL",
  },

  CapitalStackDiagram: {
    eyebrow: "AIRBNB CAPITAL",
    title: "An asset-light platform is mostly equity-funded.",
    layers: [
      {
        label: "EQUITY",
        percent: 78,
        subtitle: "Public float · retained earnings",
        icon: "📈",
        accent: true,
      },
      {
        label: "CONVERTIBLE / OTHER",
        percent: 8,
        subtitle: "Hybrid claims",
        icon: "🧾",
      },
      {
        label: "SENIOR DEBT",
        percent: 14,
        subtitle: "Long-term notes",
        icon: "🏦",
      },
    ] satisfies CapitalLayer[],
    lossPercent: 12,
    source: "ILLUSTRATIVE CAPITAL STRUCTURE",
  },

  BalanceSheetDiagram: {
    eyebrow: "BALANCE SHEET",
    title: "Cash and marketable securities dominate the asset side.",
    assets: [
      { label: "CASH & SECURITIES", value: 58, icon: "💵", accent: true },
      { label: "RECEIVABLES", value: 22, icon: "🧾" },
      { label: "OTHER ASSETS", value: 20, icon: "📦" },
    ] satisfies BalanceSheetItem[],
    liabilities: [
      { label: "DEFERRED REVENUE", value: 34, icon: "📅" },
      { label: "DEBT", value: 18, icon: "🏦" },
      { label: "OTHER LIAB.", value: 12, icon: "📄" },
    ] satisfies BalanceSheetItem[],
    equity: [
      { label: "EQUITY", value: 36, icon: "📈", accent: true },
    ] satisfies BalanceSheetItem[],
    unit: "$",
    source: "COMPANY FILINGS / ILLUSTRATIVE $B",
  },
};
