import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {springIn, stagger} from "../../../lib/chartMotion";
import {layout, spacing} from "../../../style/theme";
import {VIZ} from "../../../components/viz/chartPrimitives";

type Party = {label: string; icon?: string; detail?: string};
const LEFT: Party[] = [
  {label: "BUYERS", icon: "🛒", detail: "Demand"},
  {label: "ADVERTISERS", icon: "📣", detail: "Budget"},
  {label: "USERS", icon: "👤", detail: "Attention"},
];
const RIGHT: Party[] = [
  {label: "SELLERS", icon: "🏪", detail: "Supply"},
  {label: "CREATORS", icon: "🎬", detail: "Content"},
  {label: "DEVELOPERS", icon: "💻", detail: "Apps"},
];

const W = layout.width - spacing.framePadding * 2;
const H = 650;
const CENTER_W = 360;
const GAP = 56; // gap-14
const CARD_H = 120;
const CARD_GAP = 32; // space-y-8

function cardCentersY(count: number) {
  const stack = count * CARD_H + Math.max(0, count - 1) * CARD_GAP;
  const top = (H - stack) / 2;
  return Array.from(
    {length: count},
    (_, i) => top + i * (CARD_H + CARD_GAP) + CARD_H / 2,
  );
}

export const TwoSidedMarketplaceDiagram: React.FC<{
  eyebrow?: string;
  title?: string;
  left?: Party[];
  right?: Party[];
  platform?: string;
}> = ({
  eyebrow = "MULTI-SIDED MARKET",
  title = "The product is often the coordination layer.",
  left = LEFT,
  right = RIGHT,
  platform = "PLATFORM",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cp = springIn({frame, fps, delay: 12});

  const sideW = (W - CENTER_W - GAP * 2) / 2;
  const platL = sideW + GAP;
  const platR = platL + CENTER_W;
  const rightL = platR + GAP;
  const platCY = H / 2;
  const leftYs = cardCentersY(left.length);
  const rightYs = cardCentersY(right.length);

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div
        className="relative mt-10 grid grid-cols-[1fr_360px_1fr] gap-14 items-center"
        style={{height: H}}
      >
        <div className="space-y-8">
          {left.map((p, i) => {
            const q = stagger(frame, i, 8, 7, 16);
            return (
              <div
                key={p.label}
                className="flex h-[120px] items-center gap-6 border-2 border-ink bg-white px-7"
                style={{
                  opacity: q,
                  transform: `translateX(${(1 - q) * -35}px)`,
                  boxShadow: "5px 5px 0 #111",
                }}
              >
                <span className="text-[46px]">{p.icon}</span>
                <div>
                  <div className="text-[23px] font-semibold">{p.label}</div>
                  <div className="text-[17px] text-muted">{p.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="relative flex h-[290px] items-center justify-center border-2 border-ink bg-yellow"
          style={{
            transform: `scale(${0.88 + 0.12 * cp})`,
            boxShadow: "8px 8px 0 #111",
          }}
        >
          <div className="text-center">
            <div className="text-[76px]">⚙️</div>
            <div className="text-[30px] font-semibold">{platform}</div>
            <div className="mt-2 text-[18px]">MATCH · PRICE · TRUST</div>
          </div>
        </div>
        <div className="space-y-8">
          {right.map((p, i) => {
            const q = stagger(frame, i, 12, 7, 16);
            return (
              <div
                key={p.label}
                className="flex h-[120px] items-center gap-6 border-2 border-ink bg-white px-7"
                style={{
                  opacity: q,
                  transform: `translateX(${(1 - q) * 35}px)`,
                  boxShadow: "5px 5px 0 #111",
                }}
              >
                <span className="text-[46px]">{p.icon}</span>
                <div>
                  <div className="text-[23px] font-semibold">{p.label}</div>
                  <div className="text-[17px] text-muted">{p.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
        >
          <defs>
            <marker
              id="tsm-arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={VIZ.ink} />
            </marker>
          </defs>
          {leftYs.map((y, i) => {
            const p = stagger(frame, i, 26, 5, 18);
            return (
              <line
                key={`L${i}`}
                x1={sideW - 8}
                y1={y}
                x2={platL + 6}
                y2={platCY}
                stroke={VIZ.ink}
                strokeWidth={4}
                opacity={p}
                markerEnd="url(#tsm-arrow)"
              />
            );
          })}
          {rightYs.map((y, i) => {
            const p = stagger(frame, i, 26, 5, 18);
            return (
              <line
                key={`R${i}`}
                x1={platR - 6}
                y1={platCY}
                x2={rightL + 8}
                y2={y}
                stroke={VIZ.ink}
                strokeWidth={4}
                opacity={p}
                markerEnd="url(#tsm-arrow)"
              />
            );
          })}
        </svg>
      </div>
    </Frame>
  );
};
