import type {ComponentType} from "react";

import {BeforeAfter} from "./BeforeAfter";
import {BarChart} from "./BarChart";
import {BigNumber} from "./BigNumber";
import {BulletReveal} from "./BulletReveal";
import {Callout} from "./Callout";
import {Candlestick} from "./Candlestick";
import {Compare} from "./Compare";
import {DataTable} from "./DataTable";
import {Donut} from "./Donut";
import {Equation} from "./Equation";
import {Flow} from "./Flow";
import {Funnel} from "./Funnel";
import {ImageCard} from "./ImageCard";
import {KPIGrid} from "./KPIGrid";
import {LineChart} from "./LineChart";
import {LogoCloud} from "./LogoCloud";
import {MapCallout} from "./MapCallout";
import {Percentage} from "./Percentage";
import {Quote} from "./Quote";
import {Ranking} from "./Ranking";
import {ScatterPlot} from "./ScatterPlot";
import {ScreenshotZoom} from "./ScreenshotZoom";
import {StackedBar} from "./StackedBar";
import {Ticker} from "./Ticker";
import {Timeline} from "./Timeline";
import {UnitEconomics} from "./UnitEconomics";
import {Waterfall} from "./Waterfall";

export type SceneEntry = {
  id: string;
  component: ComponentType;
};

export const SCENES: SceneEntry[] = [
  {id: "BigNumber", component: BigNumber},
  {id: "Compare", component: Compare},
  {id: "BarChart", component: BarChart},
  {id: "Flow", component: Flow},
  {id: "Ranking", component: Ranking},
  {id: "Callout", component: Callout},
  {id: "Quote", component: Quote},
  {id: "LineChart", component: LineChart},
  {id: "Candlestick", component: Candlestick},
  {id: "Donut", component: Donut},
  {id: "Waterfall", component: Waterfall},
  {id: "DataTable", component: DataTable},
  {id: "KPIGrid", component: KPIGrid},
  {id: "BulletReveal", component: BulletReveal},
  {id: "BeforeAfter", component: BeforeAfter},
  {id: "Equation", component: Equation},
  {id: "Funnel", component: Funnel},
  {id: "ImageCard", component: ImageCard},
  {id: "LogoCloud", component: LogoCloud},
  {id: "MapCallout", component: MapCallout},
  {id: "Percentage", component: Percentage},
  {id: "ScatterPlot", component: ScatterPlot},
  {id: "ScreenshotZoom", component: ScreenshotZoom},
  {id: "StackedBar", component: StackedBar},
  {id: "Timeline", component: Timeline},
  {id: "UnitEconomics", component: UnitEconomics},
  {id: "Ticker", component: Ticker},
];
