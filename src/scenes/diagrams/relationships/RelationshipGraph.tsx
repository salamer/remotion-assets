import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {Frame} from "../../../components/Frame";
import {BrutalCard} from "../../../components/BrutalCard";
import {SceneHeader} from "../../../components/SceneHeader";
import {floatY, springIn, tween} from "../../../lib/motion";
import {colors} from "../../../style/theme";

export type GraphNode = {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  x: number;
  y: number;
  width?: number;
  accent?: boolean;
};

export type GraphLink = {
  from: string;
  to: string;
  label?: string;
  accent?: boolean;
  bend?: number;
};

const DEFAULT_NODES: GraphNode[] = [
  {id: "platform", label: "PLATFORM", sublabel: "Matching + trust", icon: "💻", x: 0.5, y: 0.34, accent: true},
  {id: "users", label: "USERS", sublabel: "Demand", icon: "👤", x: 0.18, y: 0.72},
  {id: "suppliers", label: "SUPPLIERS", sublabel: "Supply", icon: "🏭", x: 0.5, y: 0.75},
  {id: "capital", label: "CAPITAL", sublabel: "Funding", icon: "💰", x: 0.82, y: 0.72},
];

const DEFAULT_LINKS: GraphLink[] = [
  {from: "platform", to: "users", label: "distribution", accent: true, bend: -60},
  {from: "platform", to: "suppliers", label: "orders", bend: 20},
  {from: "platform", to: "capital", label: "returns", bend: -60},
];

export const RelationshipGraph: React.FC<{
  eyebrow?: string;
  title?: string;
  nodes?: GraphNode[];
  links?: GraphLink[];
}> = ({
  eyebrow = "RELATIONSHIP",
  title = "Show the system as relationships, not bullet points.",
  nodes = DEFAULT_NODES,
  links = DEFAULT_LINKS,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const connectorP = tween(frame, 14, 44);

  const graph = {left: 90, top: 220, width: 1740, height: 760};
  const byId = (id: string) => nodes.find((n) => n.id === id);
  const pointFor = (node: GraphNode) => ({
    x: graph.left + node.x * graph.width,
    y: graph.top + node.y * graph.height,
  });

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <svg width="1920" height="1080" className="absolute inset-0">
        {links.map((link, index) => {
          const from = byId(link.from);
          const to = byId(link.to);
          if (!from || !to) return null;
          const a = pointFor(from);
          const b = pointFor(to);
          const mx = (a.x + b.x) / 2;
          const bend = link.bend ?? -70;
          const d = `M ${a.x} ${a.y} Q ${mx} ${(a.y + b.y) / 2 + bend} ${b.x} ${b.y}`;
          const linkP = Math.max(0, Math.min(1, connectorP - index * 0.07));

          return (
            <g key={`${link.from}-${link.to}`}>
              {link.accent ? (
                <path
                  d={d}
                  fill="none"
                  stroke={colors.yellow}
                  strokeOpacity={0.38}
                  strokeWidth={62}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - linkP}
                />
              ) : null}
              <path
                d={d}
                fill="none"
                stroke={colors.ink}
                strokeOpacity={0.72}
                strokeWidth={3}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - linkP}
              />
              {link.label ? (
                <text
                  x={mx}
                  y={(a.y + b.y) / 2 + bend - 12}
                  textAnchor="middle"
                  fontSize={17}
                  fill="#737373"
                  fontFamily="IBM Plex Mono"
                  opacity={linkP}
                >
                  {link.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      {nodes.map((node, index) => {
        const p = springIn({frame, fps, delay: 5 + index * 7, damping: 17, stiffness: 145});
        const pt = pointFor(node);
        const w = node.width ?? 390;
        const y = floatY(frame, node.accent ? 2.5 : 4, 115, index * 22);

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: pt.x - w / 2,
              top: pt.y - 90,
              width: w,
              opacity: p,
              transform: `translateY(${(1 - p) * 30 + y}px) scale(${0.92 + p * 0.08})`,
            }}
          >
            <BrutalCard yellow={node.accent} className="h-[180px] p-7">
              <div className="flex h-full items-center gap-7">
                <div className="text-[58px]">{node.icon}</div>
                <div>
                  <div className="text-[31px] font-semibold tracking-[-0.04em]">{node.label}</div>
                  {node.sublabel ? (
                    <div className="mt-2 text-[19px] text-muted">{node.sublabel}</div>
                  ) : null}
                </div>
              </div>
            </BrutalCard>
          </div>
        );
      })}
    </Frame>
  );
};
