import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { palette, reveal } from "../../../lib/motion";

const branches = [
  { title: "REVENUE", icon: "💰", leaves: ["Volume", "Price", "Mix"] },
  { title: "COST", icon: "⚙️", leaves: ["COGS", "Labor", "Marketing"] },
  {
    title: "CAPITAL",
    icon: "🏦",
    leaves: ["Debt", "Capex", "Working capital"],
  },
];

const ROOT = { x: 40, y: 250, w: 340, h: 110 };
const BRANCH_X = 620;
const BRANCH_W = 300;
const BRANCH_H = 78;
const LEAF_W = 170;
const LEAF_H = 52;
const LEAF_GAP = 20;

export const IssueTree: React.FC = () => {
  const frame = useCurrentFrame();
  const rootCx = ROOT.x + ROOT.w;
  const rootCy = ROOT.y + ROOT.h / 2;

  return (
    <Frame>
      <SceneHeader
        eyebrow="ISSUE TREE"
        title="Break the question into drivers."
      />
      <div className="relative mt-12 h-[650px]">
        <div
          className="absolute border-2 border-ink bg-yellow p-7 text-[30px] font-semibold"
          style={{
            left: ROOT.x,
            top: ROOT.y,
            width: ROOT.w,
            boxShadow: "6px 6px 0 #111",
          }}
        >
          WHAT DRIVES PROFIT?
        </div>
        {branches.map((b, i) => {
          const y = 65 + i * 190;
          const p = reveal(frame, 18 + i * 10);
          const branchCy = y + BRANCH_H / 2;
          const leafStartX = BRANCH_X + BRANCH_W + 40;
          return (
            <React.Fragment key={b.title}>
              <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                <path
                  d={`M ${rootCx} ${rootCy} C ${rootCx + 80} ${rootCy}, ${BRANCH_X - 40} ${branchCy}, ${BRANCH_X} ${branchCy}`}
                  fill="none"
                  stroke={palette.ink}
                  strokeWidth={3}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
              </svg>
              <div
                className="absolute border-2 border-ink bg-white p-5"
                style={{
                  left: BRANCH_X,
                  top: y,
                  width: BRANCH_W,
                  height: BRANCH_H,
                  opacity: p,
                }}
              >
                <div className="text-[24px] font-semibold">
                  {b.icon} {b.title}
                </div>
              </div>
              {b.leaves.map((leaf, j) => {
                const lp = reveal(frame, 32 + i * 10 + j * 4);
                const lx = leafStartX + j * (LEAF_W + LEAF_GAP);
                const leafCy = y + BRANCH_H / 2;
                const leafTop = leafCy - LEAF_H / 2;
                return (
                  <React.Fragment key={leaf}>
                    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                      <path
                        d={`M ${BRANCH_X + BRANCH_W} ${leafCy} L ${lx} ${leafCy}`}
                        fill="none"
                        stroke={palette.muted}
                        strokeWidth={2}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1 - lp}
                      />
                    </svg>
                    <div
                      className="absolute flex items-center justify-center border-2 border-ink bg-soft px-4 text-[18px] font-semibold"
                      style={{
                        left: lx,
                        top: leafTop,
                        width: LEAF_W,
                        height: LEAF_H,
                        opacity: lp,
                      }}
                    >
                      {leaf}
                    </div>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </Frame>
  );
};
