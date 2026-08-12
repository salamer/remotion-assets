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

/** KPI 拆解树：边上的 relation（× ÷ + −）表示数学关系，不是汇报线 */
export type DriverNode = TreeNodeBase & {
  value?: string;
  relation?: "+" | "−" | "×" | "÷" | "drives" | string;
  children?: DriverNode[];
};

export type MetricDriverTreeProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  root?: DriverNode;
  source?: string;
};

const DEFAULT_ROOT: DriverNode = {
  id: "revenue",
  label: "REVENUE",
  subtitle: "$11.1B",
  icon: "💰",
  accent: true,
  children: [
    {
      id: "users",
      label: "ACTIVE USERS",
      subtitle: "220M",
      icon: "👥",
      relation: "×",
      children: [
        {id: "traffic", label: "TRAFFIC", subtitle: "Visitors", icon: "🌐", relation: "×"},
        {id: "conversion", label: "CONVERSION", subtitle: "Visit → paid", icon: "🎯", relation: "×"},
      ],
    },
    {
      id: "arpu",
      label: "ARPU",
      subtitle: "$50.5",
      icon: "🧾",
      relation: "×",
      children: [
        {id: "price", label: "PRICE", subtitle: "Per transaction", icon: "🏷️", relation: "×", accent: true},
        {id: "frequency", label: "FREQUENCY", subtitle: "Transactions / user", icon: "🔁", relation: "×"},
      ],
    },
  ],
};

export const MetricDriverTree: React.FC<MetricDriverTreeProps> = ({
  eyebrow = "DRIVER TREE",
  title = "What actually drives the headline number?",
  subtitle = "Decompose a KPI into multiplicative drivers.",
  root = DEFAULT_ROOT,
  source = "ILLUSTRATIVE KPI DECOMPOSITION",
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
              const p = tween(frame, 12 + node.depth * 9 + node.order * 2, 18);
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
            delay: node.depth * 8 + node.order * 2,
            damping: 16,
            stiffness: 130,
          });
          return (
            <div key={node.id} className="absolute" style={treeNodeStyle(node.x, node.y, p, 20)}>
              <NodeCard
                label={node.label}
                subtitle={
                  node.value ? `${node.subtitle ?? ""} · ${node.value}` : node.subtitle
                }
                icon={node.icon}
                accent={node.accent}
                muted={node.depth >= 2 && !node.accent}
                compact={node.depth >= 2}
                width={node.depth >= 2 ? 220 : 250}
              />
            </div>
          );
        })}

        {nodes
          .filter((node) => node.parentId && node.relation)
          .map((node) => {
            const parent = byId.get(node.parentId!);
            if (!parent) return null;
            const p = tween(frame, 26 + node.order * 3, 10);
            const point = edgeCorridorPoint(parent, node);
            return (
              <div
                key={`relation-${node.id}`}
                className="absolute"
                style={edgeLabelStyle(point.x, point.y, p)}
              >
                <EdgeLabel text={node.relation!} accent={node.accent} compact />
              </div>
            );
          })}
      </StructuralDiagram>

      <Source>{source}</Source>
    </Frame>
  );
};
