import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {Source} from "../../../components/Source";
import {countTo, springIn, tween} from "../../../lib/motion";
import {shadows} from "../../../style/theme";

export type ValueChainStage = {
  label: string;
  subtitle?: string;
  icon?: string;
  metric?: number;
  metricLabel?: string;
  unit?: string;
  capture?: number;
  accent?: boolean;
};

export type ValueChainDiagramProps = {
  eyebrow?: string;
  title?: string;
  stages?: ValueChainStage[];
  source?: string;
};

const DEFAULT_STAGES: ValueChainStage[] = [
  {label: "IP / DESIGN", subtitle: "Scarce know-how", icon: "🧠", metric: 78, metricLabel: "GROSS MARGIN", unit: "%", capture: 32, accent: true},
  {label: "EQUIPMENT", subtitle: "Critical machines", icon: "⚙️", metric: 48, metricLabel: "GROSS MARGIN", unit: "%", capture: 24},
  {label: "MANUFACTURING", subtitle: "Scale + capex", icon: "🏭", metric: 41, metricLabel: "GROSS MARGIN", unit: "%", capture: 21},
  {label: "ASSEMBLY", subtitle: "More competition", icon: "📦", metric: 16, metricLabel: "GROSS MARGIN", unit: "%", capture: 9},
  {label: "DISTRIBUTION", subtitle: "Access to demand", icon: "🛒", metric: 24, metricLabel: "GROSS MARGIN", unit: "%", capture: 14},
];

export const ValueChainDiagram: React.FC<ValueChainDiagramProps> = ({
  eyebrow = "VALUE CHAIN",
  title = "Where is value created — and where is it captured?",
  stages = DEFAULT_STAGES,
  source = "ILLUSTRATIVE INDUSTRY ECONOMICS",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalCapture = stages.reduce((sum, s) => sum + (s.capture ?? 0), 0) || 1;

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} subtitle="Margin and capture per stage along the chain." />

      <div className="mt-10 flex items-stretch gap-3">
        {stages.map((stage, index) => {
          const p = springIn({frame, fps, delay: index * 7, damping: 17, stiffness: 125});
          const metric = stage.metric == null ? null : countTo(frame, stage.metric, 16 + index * 7, 25);
          return (
            <React.Fragment key={stage.label}>
              <div
                className={`flex min-h-[320px] flex-1 flex-col justify-between border-2 border-ink p-5 ${stage.accent ? "bg-yellow" : "bg-white"}`}
                style={{
                  boxShadow: stage.accent ? shadows.brutal : shadows.brutalMd,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                <div>
                  <div className="text-[54px]">{stage.icon ?? "◻️"}</div>
                  <div className="mt-5 text-[26px] font-semibold leading-[1.05]">{stage.label}</div>
                  {stage.subtitle ? <div className="mt-3 text-[18px] leading-[1.35] text-muted">{stage.subtitle}</div> : null}
                </div>

                {metric != null ? (
                  <div>
                    <div className="text-[48px] font-semibold tracking-[-0.05em]">
                      {Math.round(metric)}{stage.unit ?? ""}
                    </div>
                    <div className="mt-1 text-[16px] tracking-[0.08em] text-muted">{stage.metricLabel ?? "METRIC"}</div>
                  </div>
                ) : null}
              </div>

              {index < stages.length - 1 ? (
                <div
                  className="flex w-[54px] items-center justify-center text-[44px] font-semibold"
                  style={{opacity: tween(frame, 10 + index * 7, 12)}}
                >
                  →
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex justify-between text-[18px] text-muted">
          <span>VALUE CAPTURE</span>
          <span>100%</span>
        </div>
        <div className="flex h-[64px] border-2 border-ink bg-white">
          {stages.map((stage, index) => {
            const share = ((stage.capture ?? 0) / totalCapture) * 100;
            const p = tween(frame, 48 + index * 5, 20);
            return (
              <div
                key={`capture-${stage.label}`}
                className={`flex items-center justify-center overflow-hidden border-r-2 border-ink last:border-r-0 ${stage.accent ? "bg-yellow" : index % 2 ? "bg-soft" : "bg-white"}`}
                style={{width: `${share * p}%`}}
              >
                {p > 0.68 && share > 8 ? <span className="text-[17px] font-semibold">{Math.round(share)}%</span> : null}
              </div>
            );
          })}
        </div>
      </div>

      <Source>{source}</Source>
    </Frame>
  );
};
