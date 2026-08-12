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
  layoutStructuralTree,
  NodeCard,
  treeNodeStyle,
} from "../../../components/viz/structuralShared";
import type {TreeNodeBase} from "../../../components/viz/structuralShared";

/** 汇报线树：parent → child = 管理关系（不是股权） */
export type OrganizationNode = TreeNodeBase & {
  headcount?: string;
  children?: OrganizationNode[];
};

export type OrganizationTreeProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  root?: OrganizationNode;
  source?: string;
};

const DEFAULT_ROOT: OrganizationNode = {
  id: "ceo",
  label: "CEO",
  subtitle: "Strategy & capital allocation",
  icon: "👤",
  accent: true,
  children: [
    {
      id: "finance",
      label: "FINANCE",
      subtitle: "CFO · Treasury · FP&A",
      icon: "💰",
      children: [
        {id: "treasury", label: "TREASURY", subtitle: "Liquidity", icon: "🏦"},
        {id: "fpna", label: "FP&A", subtitle: "Planning", icon: "📊"},
      ],
    },
    {
      id: "product",
      label: "PRODUCT & TECH",
      subtitle: "CTO · Product",
      icon: "💻",
      children: [
        {id: "ai", label: "AI", subtitle: "Models & agents", icon: "🤖", accent: true},
        {id: "infra", label: "INFRA", subtitle: "Cloud & platform", icon: "⚙️"},
      ],
    },
    {
      id: "ops",
      label: "OPERATIONS",
      subtitle: "COO · Sales · Support",
      icon: "🏭",
      children: [
        {id: "sales", label: "SALES", subtitle: "Distribution", icon: "🤝"},
        {id: "support", label: "SUPPORT", subtitle: "Service", icon: "🎧"},
      ],
    },
  ],
};

export const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  eyebrow = "ORGANIZATION",
  title = "Who reports to whom?",
  subtitle = "Reporting lines across divisions and business units.",
  root = DEFAULT_ROOT,
  source = "COMPANY ORGANIZATION / DEMO",
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
              const p = tween(frame, 10 + node.depth * 10 + node.order * 2, 18);
              return (
                <TreeEdge
                  key={`${parent.id}-${node.id}`}
                  d={cubicTreeEdgePath(parent, node)}
                  progress={p}
                />
              );
            })}
        </svg>

        {nodes.map((node) => {
          const p = springIn({
            frame,
            fps,
            delay: node.depth * 10 + node.order * 2,
            damping: 16,
            stiffness: 130,
          });
          return (
            <div key={node.id} className="absolute" style={treeNodeStyle(node.x, node.y, p, 24)}>
              <NodeCard
                label={node.label}
                subtitle={
                  node.headcount
                    ? `${node.subtitle ?? ""} · ${node.headcount}`
                    : node.subtitle
                }
                icon={node.icon}
                accent={node.accent}
                muted={node.muted}
                compact={node.depth >= 2}
                width={node.depth >= 2 ? 210 : 250}
              />
            </div>
          );
        })}
      </StructuralDiagram>

      <Source>{source}</Source>
    </Frame>
  );
};
