import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";
import { VIZ } from "../../../components/viz/chartPrimitives";

type Node = {
  id: string;
  label: string;
  icon?: string;
  x: number;
  y: number;
  highlight?: boolean;
};
type Edge = {
  from: string;
  to: string;
  type: "compete" | "cooperate" | "supply";
  label?: string;
};
const NODES: Node[] = [
  { id: "a", label: "PLATFORM A", icon: "⚡", x: 50, y: 18, highlight: true },
  { id: "b", label: "PLATFORM B", icon: "☁️", x: 20, y: 55 },
  { id: "c", label: "PLATFORM C", icon: "🧠", x: 80, y: 55 },
  { id: "d", label: "SUPPLIER", icon: "🏭", x: 35, y: 84 },
  { id: "e", label: "PARTNER", icon: "🤝", x: 65, y: 84 },
];
const EDGES: Edge[] = [
  { from: "a", to: "b", type: "compete", label: "COMPETE" },
  { from: "a", to: "c", type: "compete" },
  { from: "b", to: "c", type: "cooperate", label: "STANDARD" },
  { from: "d", to: "a", type: "supply", label: "SUPPLY" },
  { from: "e", to: "a", type: "cooperate", label: "PARTNER" },
];

export const RivalryNetworkDiagram: React.FC<{
  eyebrow?: string;
  title?: string;
  nodes?: Node[];
  edges?: Edge[];
}> = ({
  eyebrow = "COMPETE + COOPERATE",
  title = "Markets are rarely pure rivalry.",
  nodes = NODES,
  edges = EDGES,
}) => {
  const frame = useCurrentFrame();
  const get = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="relative mt-5 h-[680px]">
        <svg width={1680} height={680} className="absolute inset-0">
          {edges.map((e, i) => {
            const a = get(e.from),
              b = get(e.to),
              p = stagger(frame, i, 10, 5, 22);
            const x1 = (a.x / 100) * 1680,
              y1 = (a.y / 100) * 680,
              x2 = (b.x / 100) * 1680,
              y2 = (b.y / 100) * 680;
            const color =
              e.type === "compete"
                ? VIZ.ink
                : e.type === "cooperate"
                  ? VIZ.yellow
                  : VIZ.muted;
            const dash = e.type === "compete" ? "14 10" : undefined;
            return (
              <g key={`${e.from}-${e.to}`} opacity={p}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x1 + (x2 - x1) * p}
                  y2={y1 + (y2 - y1) * p}
                  stroke={color}
                  strokeWidth={e.type === "cooperate" ? 12 : 5}
                  strokeDasharray={dash}
                />
                {e.label ? (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 10}
                    textAnchor="middle"
                    fontFamily="IBM Plex Mono"
                    fontSize={16}
                    fill={VIZ.ink}
                  >
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        {nodes.map((n, i) => {
          const p = stagger(frame, i, 8, 5, 16);
          return (
            <div
              key={n.id}
              className={`absolute flex h-[120px] w-[230px] items-center justify-center border-2 border-ink ${n.highlight ? "bg-yellow" : "bg-white"}`}
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * p})`,
                opacity: p,
                boxShadow: "5px 5px 0 #111",
              }}
            >
              <div className="text-center">
                <div className="text-[40px]">{n.icon}</div>
                <div className="text-[20px] font-semibold">{n.label}</div>
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-1 left-0 flex gap-8 text-[17px] text-muted">
          <span>┄ COMPETE</span>
          <span className="bg-yellow px-2">━ COOPERATE</span>
          <span>— SUPPLY</span>
        </div>
      </div>
    </Frame>
  );
};
