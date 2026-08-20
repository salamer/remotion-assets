import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { reveal } from "../../../lib/motion";

const lanes = [
  {
    name: "CUSTOMER",
    icon: "👤",
    steps: [
      { x: 10, w: 18, text: "REQUEST" },
      { x: 58, w: 18, text: "APPROVE" },
    ],
  },
  {
    name: "PLATFORM",
    icon: "💻",
    steps: [
      { x: 30, w: 22, text: "MATCH" },
      { x: 78, w: 15, text: "SETTLE" },
    ],
  },
  { name: "SUPPLIER", icon: "🏭", steps: [{ x: 48, w: 18, text: "FULFILL" }] },
];

export const SwimlaneDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow="PROCESS MAP" title="Who does what — and when?" />
      <div className="mt-14 border-2 border-ink bg-white">
        {lanes.map((lane, i) => (
          <div
            key={lane.name}
            className="grid grid-cols-[240px_1fr] border-t-2 first:border-t-0 border-ink"
          >
            <div className="flex items-center gap-4 bg-soft p-6 text-[22px] font-semibold">
              {lane.icon} {lane.name}
            </div>
            <div className="relative h-[150px] border-l-2 border-ink">
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-soft" />
              {lane.steps.map((st, j) => {
                const p = reveal(frame, 10 + (i * 2 + j) * 7);
                return (
                  <div
                    key={st.text}
                    className="absolute top-1/2 -translate-y-1/2 border-2 border-ink bg-yellow px-5 py-4 text-[20px] font-semibold"
                    style={{ left: `${st.x}%`, width: `${st.w}%`, opacity: p }}
                  >
                    {st.text}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};
