import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";

import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {Source} from "../../../components/Source";
import {countTo, springIn, tween} from "../../../lib/motion";
import {colors} from "../../../style/theme";
import {
  EdgeLabel,
  NodeCard,
  StructuralDiagram,
  STRUCTURAL_CANVAS,
  edgeLabelStyle,
} from "../../../components/viz/structuralShared";

export type SankeyNode = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string;
  column: number;
  order?: number;
  accent?: boolean;
};

export type SankeyLink = {
  from: string;
  to: string;
  value: number;
  label?: string;
  accent?: boolean;
};

export type SankeyDiagramProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  nodes?: SankeyNode[];
  links?: SankeyLink[];
  unit?: string;
  source?: string;
};

const DEFAULT_NODES: SankeyNode[] = [
  {id: "tax", label: "TAXES", subtitle: "Households & firms", icon: "🧾", column: 0, order: 0},
  {id: "fees", label: "FEES", subtitle: "Non-tax revenue", icon: "💳", column: 0, order: 1},
  {id: "gov", label: "GOVERNMENT", subtitle: "Budget pool", icon: "🏛️", column: 1, order: 0, accent: true},
  {id: "pension", label: "PENSIONS", subtitle: "Transfers", icon: "👴", column: 2, order: 0},
  {id: "health", label: "HEALTHCARE", subtitle: "Public services", icon: "🏥", column: 2, order: 1},
  {id: "infra", label: "INFRA", subtitle: "Investment", icon: "🏗️", column: 2, order: 2},
];

const DEFAULT_LINKS: SankeyLink[] = [
  {from: "tax", to: "gov", value: 82, label: "82", accent: true},
  {from: "fees", to: "gov", value: 18, label: "18"},
  {from: "gov", to: "pension", value: 38, label: "38"},
  {from: "gov", to: "health", value: 34, label: "34", accent: true},
  {from: "gov", to: "infra", value: 28, label: "28"},
];

const NODE_HALF_W = 118;

export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  eyebrow = "FUND FLOW",
  title = "Where does the money come from — and where does it go?",
  subtitle = "Ribbon width encodes flow magnitude.",
  nodes = DEFAULT_NODES,
  links = DEFAULT_LINKS,
  unit = "%",
  source = "ILLUSTRATIVE FLOW / DEMO",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {width, height} = STRUCTURAL_CANVAS;
  const columns = [...new Set(nodes.map((n) => n.column))].sort((a, b) => a - b);
  const maxColumn = Math.max(...columns);

  const positions = new Map<string, {x: number; y: number}>();
  columns.forEach((column) => {
    const group = nodes
      .filter((n) => n.column === column)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    group.forEach((node, index) => {
      const x = 155 + (column / Math.max(1, maxColumn)) * (width - 310);
      const y = ((index + 1) / (group.length + 1)) * height;
      positions.set(node.id, {x, y});
    });
  });

  const maxValue = Math.max(...links.map((l) => l.value), 1);

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <StructuralDiagram>
        <svg className="absolute inset-0 overflow-visible" width={width} height={height}>
          {links.map((link, index) => {
            const from = positions.get(link.from);
            const to = positions.get(link.to);
            if (!from || !to) return null;
            const p = tween(frame, 15 + index * 7, 28);
            const c1x = from.x + (to.x - from.x) * 0.42;
            const c2x = from.x + (to.x - from.x) * 0.58;
            const d = `M ${from.x + NODE_HALF_W} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x - NODE_HALF_W} ${to.y}`;
            const ribbon = 10 + (link.value / maxValue) * 56;
            return (
              <g key={`${link.from}-${link.to}-${index}`}>
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={link.accent ? colors.yellow : colors.ink}
                  strokeOpacity={link.accent ? 0.75 : 0.16}
                  strokeWidth={ribbon}
                  strokeLinecap="butt"
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={colors.ink}
                  strokeOpacity={0.8}
                  strokeWidth={2}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
              </g>
            );
          })}
        </svg>

        {nodes.map((node, index) => {
          const pos = positions.get(node.id)!;
          const p = springIn({frame, fps, delay: index * 5, damping: 16, stiffness: 130});
          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                transform: `translate(-50%, -50%) scale(${0.92 + p * 0.08})`,
                opacity: p,
                zIndex: 2,
              }}
            >
              <NodeCard
                label={node.label}
                subtitle={node.subtitle}
                icon={node.icon}
                accent={node.accent}
                width={236}
                compact
              />
            </div>
          );
        })}

        {links.map((link, index) => {
          const from = positions.get(link.from);
          const to = positions.get(link.to);
          if (!from || !to) return null;
          const p = tween(frame, 32 + index * 7, 12);
          const value = countTo(frame, link.value, 20 + index * 7, 25);
          // 同起点多条边：按目标 y 错开标签，避免叠在同一点
          const siblings = links.filter((l) => l.from === link.from);
          const sibIndex = siblings.findIndex(
            (l) => l.from === link.from && l.to === link.to && l.value === link.value,
          );
          const stagger =
            siblings.length > 1
              ? (sibIndex - (siblings.length - 1) / 2) * 26
              : 0;
          const t = 0.52;
          const left = from.x + (to.x - from.x) * t;
          const top = from.y + (to.y - from.y) * t + stagger;
          return (
            <div
              key={`link-label-${index}`}
              className="absolute"
              style={edgeLabelStyle(left, top, p)}
            >
              <EdgeLabel
                text={`${link.label ?? Math.round(value)}${unit}`}
                accent={link.accent}
                compact
              />
            </div>
          );
        })}
      </StructuralDiagram>

      <Source>{source}</Source>
    </Frame>
  );
};
