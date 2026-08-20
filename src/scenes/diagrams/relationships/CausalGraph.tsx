import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { springIn, tween } from "../../../lib/motion";
import { colors, shadows } from "../../../style/theme";
import {
  EdgeLabel,
  NodeCard,
  StructuralDiagram,
  STRUCTURAL_CANVAS,
  edgeLabelStyle,
} from "../../../components/viz/structuralShared";

export type CausalNode = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string;
  x: number;
  y: number;
  accent?: boolean;
  direction?: "up" | "down" | "flat";
};

export type CausalLink = {
  from: string;
  to: string;
  sign?: "+" | "−" | "?";
  label?: string;
  bend?: number;
  delay?: boolean;
  accent?: boolean;
};

export type CausalGraphProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  nodes?: CausalNode[];
  links?: CausalLink[];
  source?: string;
};

const DEFAULT_NODES: CausalNode[] = [
  {
    id: "rates",
    label: "INTEREST RATES",
    subtitle: "Policy rate",
    icon: "🏦",
    x: 0.12,
    y: 0.42,
    accent: true,
    direction: "up",
  },
  {
    id: "credit",
    label: "BORROWING",
    subtitle: "Credit demand",
    icon: "💳",
    x: 0.38,
    y: 0.42,
    direction: "down",
  },
  {
    id: "spend",
    label: "SPENDING",
    subtitle: "Households & firms",
    icon: "🛒",
    x: 0.64,
    y: 0.42,
    direction: "down",
  },
  {
    id: "inflation",
    label: "INFLATION",
    subtitle: "Price pressure",
    icon: "📈",
    x: 0.9,
    y: 0.42,
    accent: true,
    direction: "down",
  },
  {
    id: "housing",
    label: "HOUSING",
    subtitle: "Asset prices",
    icon: "🏠",
    x: 0.5,
    y: 0.84,
    direction: "down",
  },
];

const DEFAULT_LINKS: CausalLink[] = [
  {
    from: "rates",
    to: "credit",
    sign: "−",
    label: "financing cost",
    accent: true,
  },
  { from: "credit", to: "spend", sign: "+", label: "credit → demand" },
  {
    from: "spend",
    to: "inflation",
    sign: "+",
    label: "demand pressure",
    accent: true,
  },
  {
    from: "rates",
    to: "housing",
    sign: "−",
    label: "mortgage cost",
    bend: 90,
    delay: true,
  },
  {
    from: "housing",
    to: "spend",
    sign: "+",
    label: "wealth effect",
    bend: -70,
  },
];

const arrow = (direction?: CausalNode["direction"]) => {
  if (direction === "up") return " ↑";
  if (direction === "down") return " ↓";
  if (direction === "flat") return " →";
  return "";
};

const NODE_W = 236;

export const CausalGraph: React.FC<CausalGraphProps> = ({
  eyebrow = "CAUSALITY",
  title = "A rate hike moves through the economy in stages.",
  subtitle = "Signed arrows show direction; dashed = lagged effect.",
  nodes = DEFAULT_NODES,
  links = DEFAULT_LINKS,
  source = "ILLUSTRATIVE CAUSAL MODEL",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height } = STRUCTURAL_CANVAS;
  const positions = new Map(
    nodes.map((n) => [n.id, { x: n.x * width, y: n.y * height }]),
  );

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <StructuralDiagram>
        <svg
          className="absolute inset-0 overflow-visible"
          width={width}
          height={height}
        >
          <defs>
            <marker
              id="causal-arrow"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 12 6 L 0 12 z" fill={colors.ink} />
            </marker>
          </defs>

          {links.map((link, index) => {
            const a = positions.get(link.from);
            const b = positions.get(link.to);
            if (!a || !b) return null;
            const p = tween(frame, 14 + index * 7, 24);
            const bend = link.bend ?? 0;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            const nx = -dy / len;
            const ny = dx / len;
            const c1x = a.x + dx * 0.36 + nx * bend;
            const c1y = a.y + dy * 0.36 + ny * bend;
            const c2x = a.x + dx * 0.64 + nx * bend;
            const c2y = a.y + dy * 0.64 + ny * bend;
            const startX = a.x + Math.sign(dx || 1) * (NODE_W / 2 - 8);
            const endX = b.x - Math.sign(dx || 1) * (NODE_W / 2 - 8);
            const startY =
              Math.abs(dx) < Math.abs(dy) ? a.y + Math.sign(dy || 1) * 42 : a.y;
            const endY =
              Math.abs(dx) < Math.abs(dy) ? b.y - Math.sign(dy || 1) * 42 : b.y;
            const d = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
            return (
              <path
                key={`${link.from}-${link.to}-${index}`}
                d={d}
                pathLength={1}
                fill="none"
                stroke={link.accent ? colors.yellow : colors.ink}
                strokeWidth={link.accent ? 6 : 3}
                strokeDasharray={link.delay ? "10 10" : 1}
                strokeDashoffset={link.delay ? 0 : 1 - p}
                strokeOpacity={0.95}
                markerEnd="url(#causal-arrow)"
              />
            );
          })}
        </svg>

        {nodes.map((node, index) => {
          const pos = positions.get(node.id)!;
          const p = springIn({
            frame,
            fps,
            delay: index * 6,
            damping: 16,
            stiffness: 130,
          });
          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                transform: `translate(-50%, -50%) scale(${0.93 + p * 0.07})`,
                opacity: p,
                zIndex: 2,
              }}
            >
              <NodeCard
                label={`${node.label}${arrow(node.direction)}`}
                subtitle={node.subtitle}
                icon={node.icon}
                accent={node.accent}
                width={NODE_W}
                compact
              />
            </div>
          );
        })}

        {links.map((link, index) => {
          const a = positions.get(link.from);
          const b = positions.get(link.to);
          if (!a || !b) return null;
          const p = tween(frame, 30 + index * 7, 10);
          const bend = link.bend ?? 0;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const nx = -dy / len;
          const ny = dx / len;
          // 标签贴在曲线外侧，避开节点卡片
          const bendSign =
            bend === 0 ? (dy >= 0 ? -1 : 1) : Math.sign(bend) || -1;
          const left =
            (a.x + b.x) / 2 + nx * (Math.abs(bend) * 0.35 + 18) * bendSign;
          const top =
            (a.y + b.y) / 2 +
            ny * (Math.abs(bend) * 0.35 + 18) * bendSign +
            bend * 0.2;
          return (
            <div
              key={`label-${index}`}
              className="absolute flex max-w-[220px] flex-col items-center gap-1"
              style={edgeLabelStyle(left, top, p)}
            >
              {link.sign ? (
                <EdgeLabel text={link.sign} accent={link.accent} compact />
              ) : null}
              {link.label ? (
                <div
                  className="border border-ink bg-paper px-2 py-0.5 text-center text-[13px] leading-[1.2] text-muted"
                  style={{ boxShadow: shadows.brutalSm }}
                >
                  {link.label}
                </div>
              ) : null}
            </div>
          );
        })}
      </StructuralDiagram>

      <Source>{source}</Source>
    </Frame>
  );
};
