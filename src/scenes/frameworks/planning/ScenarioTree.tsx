import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {palette, reveal} from "../../../lib/motion";

const ROOT = {x: 80, y: 250, w: 280, h: 120};
const CARD_X = 980;
const CARD_W = 430;
const CARD_H = 140;

const scenarios = [
  {name: "BULL", probability: "20%", value: "$140", y: 90, accent: true},
  {name: "BASE", probability: "55%", value: "$105", y: 280, accent: false},
  {name: "BEAR", probability: "25%", value: "$72", y: 470, accent: false},
];

export const ScenarioTree: React.FC = () => {
  const frame = useCurrentFrame();
  const rootCx = ROOT.x + ROOT.w;
  const rootCy = ROOT.y + ROOT.h / 2;

  return (
    <Frame>
      <SceneHeader eyebrow="SCENARIO TREE" title="One decision, three possible worlds." />
      <div className="relative mt-10 h-[650px]">
        <div
          className="absolute border-2 border-ink bg-yellow px-8 py-7 text-[30px] font-semibold"
          style={{left: ROOT.x, top: ROOT.y, width: ROOT.w, height: ROOT.h, boxShadow: "6px 6px 0 #111"}}
        >
          TODAY
          <br />
          <span className="text-[20px] font-normal">Current value: $100</span>
        </div>
        {scenarios.map((x, i) => {
          const p = reveal(frame, 12 + i * 10);
          const cardCy = x.y + CARD_H / 2;
          return (
            <React.Fragment key={x.name}>
              <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                <path
                  d={`M ${rootCx} ${rootCy} C ${rootCx + 220} ${rootCy}, ${CARD_X - 120} ${cardCy}, ${CARD_X} ${cardCy}`}
                  fill="none"
                  stroke={x.accent ? palette.yellow : palette.ink}
                  strokeWidth={x.accent ? 8 : 3}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
              </svg>
              <div
                className={`absolute border-2 border-ink p-6 ${x.accent ? "bg-yellow" : "bg-white"}`}
                style={{left: CARD_X, top: x.y, width: CARD_W, height: CARD_H, opacity: p}}
              >
                <div className="flex justify-between">
                  <div className="text-[30px] font-semibold">{x.name}</div>
                  <div className="text-[24px]">{x.probability}</div>
                </div>
                <div className="mt-5 text-[52px] font-semibold">{x.value}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </Frame>
  );
};
