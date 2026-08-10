export type BigNumberScene = {
  type: "big-number";
  company: string;
  label: string;
  value: number;
  suffix?: string;
  growth?: number;
};

export type QuoteScene = {
  type: "quote";
  quote: string;
  author: string;
  role?: string;
};

export type FlowScene = {
  type: "flow";
  nodes: {
    icon: string;
    title: string;
    subtitle?: string;
  }[];
};

export type CalloutScene = {
  type: "callout";
  text: string;
};

export type Scene =
  | BigNumberScene
  | QuoteScene
  | FlowScene
  | CalloutScene;
