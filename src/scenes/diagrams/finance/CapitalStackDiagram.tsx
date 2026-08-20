import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { countTo, tween } from "../../../lib/motion";
import { shadows } from "../../../style/theme";

export type CapitalLayer = {
  label: string;
  percent: number;
  subtitle?: string;
  icon?: string;
  accent?: boolean;
};

export type CapitalStackDiagramProps = {
  eyebrow?: string;
  title?: string;
  layers?: CapitalLayer[];
  lossPercent?: number;
  source?: string;
};

const DEFAULT_LAYERS: CapitalLayer[] = [
  {
    label: "EQUITY",
    percent: 25,
    subtitle: "First loss · highest upside",
    icon: "📈",
    accent: true,
  },
  {
    label: "MEZZANINE",
    percent: 15,
    subtitle: "Subordinated debt",
    icon: "🧾",
  },
  {
    label: "SENIOR DEBT",
    percent: 60,
    subtitle: "Highest repayment priority",
    icon: "🏦",
  },
];

export const CapitalStackDiagram: React.FC<CapitalStackDiagramProps> = ({
  eyebrow = "CAPITAL STRUCTURE",
  title = "Who gets paid first — and who absorbs losses first?",
  layers = DEFAULT_LAYERS,
  lossPercent = 18,
  source = "ILLUSTRATIVE CAPITAL STACK",
}) => {
  const frame = useCurrentFrame();
  const stackHeight = 520;
  const stackWidth = 680;
  const reveal = tween(frame, 12, 34);
  const shock = tween(frame, 62, 32);
  const animatedLoss = countTo(frame, lossPercent, 62, 32);
  const total = layers.reduce((sum, l) => sum + l.percent, 0) || 100;

  return (
    <Frame>
      <SceneHeader
        eyebrow={eyebrow}
        title={title}
        subtitle="Ordered by loss absorption and repayment priority."
      />

      <div className="mt-6 flex items-center gap-16">
        <div
          className="relative border-2 border-ink bg-white"
          style={{
            width: stackWidth,
            height: stackHeight,
            boxShadow: shadows.brutal,
          }}
        >
          <div className="absolute inset-0 flex flex-col">
            {layers.map((layer, index) => {
              const h = (layer.percent / total) * 100;
              const local = tween(frame, 12 + index * 8, 22);
              return (
                <div
                  key={layer.label}
                  className={`relative flex items-center justify-between overflow-hidden border-b-2 border-ink px-8 last:border-b-0 ${layer.accent ? "bg-yellow" : index % 2 ? "bg-soft" : "bg-white"}`}
                  style={{ height: `${h * local}%` }}
                >
                  <div className="flex items-center gap-5">
                    <div className="text-[46px]">{layer.icon ?? "◻️"}</div>
                    <div>
                      <div className="text-[28px] font-semibold">
                        {layer.label}
                      </div>
                      {layer.subtitle ? (
                        <div className="mt-1 text-[18px] text-muted">
                          {layer.subtitle}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-[42px] font-semibold">
                    {Math.round(layer.percent * reveal)}%
                  </div>
                </div>
              );
            })}
          </div>

          {lossPercent > 0 ? (
            <div
              className="absolute left-0 top-0 flex w-full items-end justify-center overflow-hidden bg-ink text-white"
              style={{ height: `${Math.min(100, lossPercent) * shock}%` }}
            >
              {shock > 0.65 ? (
                <div className="pb-4 text-[21px] font-semibold">
                  LOSS ABSORBED · {Math.round(animatedLoss)}%
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex-1">
          <div className="border-l-[6px] border-yellow pl-7">
            <div className="text-[22px] tracking-[0.1em] text-muted">RISK</div>
            <div className="mt-2 text-[44px] font-semibold">Higher ↑</div>
            <div className="mt-3 text-[22px] leading-[1.5] text-muted">
              Equity sits at the top because it absorbs losses first.
            </div>
          </div>

          <div className="mt-16 border-l-[6px] border-ink pl-7">
            <div className="text-[22px] tracking-[0.1em] text-muted">
              REPAYMENT PRIORITY
            </div>
            <div className="mt-2 text-[44px] font-semibold">Higher ↓</div>
            <div className="mt-3 text-[22px] leading-[1.5] text-muted">
              Senior claims sit lower in the stack and are paid before junior
              capital.
            </div>
          </div>

          <div
            className="mt-16 inline-block border-2 border-ink bg-yellow px-6 py-4 text-[26px] font-semibold"
            style={{ boxShadow: shadows.brutalMd }}
          >
            SHOCK / −{Math.round(animatedLoss)}%
          </div>
        </div>
      </div>

      <Source>{source}</Source>
    </Frame>
  );
};
