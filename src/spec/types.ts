/**
 * SceneSpec — semantic scene types for programmatic composition.
 * Prefer kebab-case `type` values matching CATALOG.md.
 */

export type HeroMetricScene = {
  type: "hero-metric";
  company: string;
  label: string;
  value: number;
  suffix?: string;
  growth?: number;
};

export type QuoteCardScene = {
  type: "quote-card";
  quote: string;
  author: string;
  role?: string;
};

export type FlowDiagramScene = {
  type: "flow-diagram";
  nodes: {
    icon: string;
    title: string;
    subtitle?: string;
  }[];
};

export type KeyTakeawayScene = {
  type: "key-takeaway";
  text: string;
};

/** Partial / early SceneSpec union — expand as props are formalized */
export type SceneSpec =
  | HeroMetricScene
  | QuoteCardScene
  | FlowDiagramScene
  | KeyTakeawayScene;

/** @deprecated Use SceneSpec */
export type Scene = SceneSpec;
/** @deprecated Use HeroMetricScene */
export type BigNumberScene = HeroMetricScene;
/** @deprecated Use QuoteCardScene */
export type QuoteScene = QuoteCardScene;
/** @deprecated Use FlowDiagramScene */
export type FlowScene = FlowDiagramScene;
/** @deprecated Use KeyTakeawayScene */
export type CalloutScene = KeyTakeawayScene;
