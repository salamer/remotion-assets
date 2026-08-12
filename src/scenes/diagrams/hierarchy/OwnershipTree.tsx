import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";

import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {Source} from "../../../components/Source";
import {springIn, tween} from "../../../lib/motion";
import {
  StructuralDiagram,
  TreeEdge,
  cubicTreeEdgePath,
  edgeCorridorPoint,
  edgeLabelStyle,
  EdgeLabel,
  layoutStructuralTree,
  NodeCard,
  treeNodeStyle,
} from "../../../components/viz/structuralShared";
import type {TreeNodeBase} from "../../../components/viz/structuralShared";

/** 股权树：边上的 % 属于 ownership edge，不是子公司名称的一部分 */
export type OwnershipNode = TreeNodeBase & {
  ownershipPct?: number;
  relationLabel?: string;
  children?: OwnershipNode[];
};

export type OwnershipTreeProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  root?: OwnershipNode;
  source?: string;
};

const DEFAULT_ROOT: OwnershipNode = {
  id: "holdco",
  label: "HOLDING CO.",
  subtitle: "Control layer",
  icon: "🏢",
  accent: true,
  children: [
    {
      id: "software",
      label: "SOFTWARE CO.",
      subtitle: "Core operating asset",
      icon: "💻",
      ownershipPct: 72,
      children: [
        {id: "cloud", label: "CLOUD", subtitle: "Infrastructure", icon: "☁️", ownershipPct: 100},
        {id: "ai", label: "AI LAB", subtitle: "Strategic subsidiary", icon: "🤖", ownershipPct: 80, accent: true},
      ],
    },
    {
      id: "finance",
      label: "FINANCE CO.",
      subtitle: "Payments & credit",
      icon: "🏦",
      ownershipPct: 51,
    },
    {
      id: "associate",
      label: "ASSOCIATE",
      subtitle: "Minority investment",
      icon: "🤝",
      ownershipPct: 28,
      muted: true,
    },
  ],
};

export const OwnershipTree: React.FC<OwnershipTreeProps> = ({
  eyebrow = "OWNERSHIP",
  title = "Who owns whom — and who actually controls the group?",
  subtitle = "Edge % = ownership stake, not company name.",
  root = DEFAULT_ROOT,
  source = "CORPORATE FILINGS / DEMO",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nodes = layoutStructuralTree(root);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <StructuralDiagram>
        <svg className="absolute inset-0 overflow-visible" width="100%" height="100%">
          {nodes
            .filter((node) => node.parentId)
            .map((node) => {
              const parent = byId.get(node.parentId!);
              if (!parent) return null;
              const controlled = (node.ownershipPct ?? 0) >= 50;
              const p = tween(frame, 12 + node.order * 4, 20);
              return (
                <TreeEdge
                  key={`${parent.id}-${node.id}`}
                  d={cubicTreeEdgePath(parent, node)}
                  progress={p}
                  accent={controlled}
                  thick={controlled}
                  opacity={controlled ? 0.95 : 0.7}
                />
              );
            })}
        </svg>

        {nodes.map((node) => {
          const p = springIn({frame, fps, delay: node.order * 4, damping: 16, stiffness: 130});
          return (
            <div key={node.id} className="absolute" style={treeNodeStyle(node.x, node.y, p, 22)}>
              <NodeCard
                label={node.label}
                subtitle={node.subtitle}
                icon={node.icon}
                accent={node.accent}
                muted={node.muted}
                compact={node.depth >= 2}
                width={node.depth >= 2 ? 210 : 250}
              />
            </div>
          );
        })}

        {/* 标签后画，压在卡片之上，落在空隙中 */}
        {nodes
          .filter((node) => node.parentId)
          .map((node) => {
            const parent = byId.get(node.parentId!);
            if (!parent) return null;
            const p = tween(frame, 24 + node.order * 4, 12);
            const point = edgeCorridorPoint(parent, node);
            const text =
              node.relationLabel ??
              (node.ownershipPct == null ? "OWNERSHIP" : `${node.ownershipPct}%`);
            return (
              <div
                key={`label-${node.id}`}
                className="absolute"
                style={edgeLabelStyle(point.x, point.y, p)}
              >
                <EdgeLabel text={text} accent={(node.ownershipPct ?? 0) >= 50} compact />
              </div>
            );
          })}
      </StructuralDiagram>

      <Source>{source}</Source>
    </Frame>
  );
};
