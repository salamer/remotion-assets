/**
 * Hierarchy / tree diagram primitives.
 * Shared by OrganizationTree, OwnershipTree, MetricDriverTree, SankeyDiagram.
 */
import React from "react";

import {colors, shadows} from "../../style/theme";

export type TreeNodeBase = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string;
  accent?: boolean;
  muted?: boolean;
  children?: TreeNodeBase[];
};

export type LaidOutTreeNode<T extends TreeNodeBase> = T & {
  x: number;
  y: number;
  depth: number;
  order: number;
  parentId?: string;
};

/** 结构图默认画布 — 预留 SceneHeader + Source，避免底栏/标题挤占 */
export const STRUCTURAL_CANVAS = {
  width: 1660,
  height: 560,
  paddingTop: 48,
  paddingBottom: 48,
  /** 近似半高，贝塞尔从卡片上下边出发，避免穿心 */
  nodeHalfHeight: 50,
} as const;

const leafCount = (node: TreeNodeBase): number => {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + leafCount(child), 0);
};

/**
 * 按叶子宽度分配 x，按深度分配 y。
 * 返回扁平列表；用 parentId 还原边。
 */
export const layoutTree = <T extends TreeNodeBase>(
  root: T,
  width: number,
  height: number,
  top = 60,
  bottom = 50,
): LaidOutTreeNode<T>[] => {
  let maxDepth = 0;
  const measure = (node: TreeNodeBase, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    node.children?.forEach((child) => measure(child, depth + 1));
  };
  measure(root, 0);

  const totalLeaves = leafCount(root);
  const yStep = maxDepth === 0 ? 0 : (height - top - bottom) / maxDepth;
  let order = 0;
  const out: LaidOutTreeNode<T>[] = [];

  const walk = (node: T, depth: number, leafStart: number, parentId?: string) => {
    const count = leafCount(node);
    const leafEnd = leafStart + count;
    const centerLeaf = (leafStart + leafEnd) / 2;
    const x = (centerLeaf / totalLeaves) * width;
    const y = top + depth * yStep;

    out.push({
      ...(node as T),
      x,
      y,
      depth,
      order: order++,
      parentId,
    });

    let cursor = leafStart;
    node.children?.forEach((child) => {
      const childCount = leafCount(child);
      walk(child as T, depth + 1, cursor, node.id);
      cursor += childCount;
    });
  };

  walk(root, 0, 0);
  return out;
};

/** 结构场景默认画布上的 layoutTree 快捷方式 */
export const layoutStructuralTree = <T extends TreeNodeBase>(root: T) =>
  layoutTree(
    root,
    STRUCTURAL_CANVAS.width,
    STRUCTURAL_CANVAS.height,
    STRUCTURAL_CANVAS.paddingTop,
    STRUCTURAL_CANVAS.paddingBottom,
  );

/** 父子节点之间的垂直三次贝塞尔路径 */
export const cubicTreeEdgePath = (
  parent: {x: number; y: number},
  child: {x: number; y: number},
  halfHeight = STRUCTURAL_CANVAS.nodeHalfHeight,
) => {
  const startY = parent.y + halfHeight;
  const endY = child.y - halfHeight;
  const midY = (startY + endY) / 2;
  return `M ${parent.x} ${startY} C ${parent.x} ${midY}, ${child.x} ${midY}, ${child.x} ${endY}`;
};

/**
 * 边标签落在父子卡片之间的空隙中，而不是两圆心中点（中点常压在卡片上）。
 * 几乎垂直的边略微横移，避免贴在粗描边上。
 */
export const edgeCorridorPoint = (
  parent: {x: number; y: number},
  child: {x: number; y: number},
  halfHeight = STRUCTURAL_CANVAS.nodeHalfHeight,
) => {
  const gapTop = parent.y + halfHeight;
  const gapBottom = child.y - halfHeight;
  const y = (gapTop + gapBottom) / 2;
  const dx = child.x - parent.x;
  const x = (parent.x + child.x) / 2 + (Math.abs(dx) < 48 ? (dx >= 0 ? 40 : -40) : 0);
  return {x, y};
};

export const edgeLabelStyle = (
  x: number,
  y: number,
  opacity = 1,
): React.CSSProperties => ({
  left: x,
  top: y,
  transform: "translate(-50%, -50%)",
  opacity,
  zIndex: 6,
  pointerEvents: "none",
});

/** 结构图容器 — 统一尺寸，避免各场景硬编码宽高不一致 */
export const StructuralDiagram: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({children, className = "mt-5"}) => (
  <div
    className={`relative ${className}`}
    style={{width: STRUCTURAL_CANVAS.width, height: STRUCTURAL_CANVAS.height}}
  >
    {children}
  </div>
);

/** 树边 stroke 入场（pathLength=1 + dashoffset） */
export const TreeEdge: React.FC<{
  d: string;
  progress: number;
  accent?: boolean;
  thick?: boolean;
  /** 默认：强调边 0.95，粗边 0.7，普通边 1 */
  opacity?: number;
}> = ({d, progress, accent = false, thick = false, opacity}) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={accent ? colors.yellow : colors.ink}
    strokeWidth={thick ? 10 : 3}
    strokeOpacity={opacity ?? (accent ? 0.95 : thick ? 0.7 : 1)}
    strokeDasharray={1}
    strokeDashoffset={1 - progress}
  />
);

/** 节点绝对定位 + spring 入场样式 */
export const treeNodeStyle = (
  x: number,
  y: number,
  progress: number,
  lift = 24,
): React.CSSProperties => ({
  left: x,
  top: y,
  transform: `translate(-50%, -50%) translateY(${(1 - progress) * lift}px) scale(${0.94 + progress * 0.06})`,
  opacity: progress,
});

export const NodeCard: React.FC<{
  label: string;
  subtitle?: string;
  icon?: string;
  accent?: boolean;
  muted?: boolean;
  width?: number;
  compact?: boolean;
}> = ({
  label,
  subtitle,
  icon,
  accent = false,
  muted = false,
  width = 270,
  compact = false,
}) => {
  return (
    <div
      className={`border-2 border-ink ${
        accent ? "bg-yellow" : muted ? "bg-soft" : "bg-white"
      }`}
      style={{
        width,
        minHeight: compact ? 84 : 104,
        boxShadow: accent ? shadows.brutal : shadows.brutalMd,
        padding: compact ? "12px 14px" : "16px 18px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="flex items-center gap-3">
        {icon ? <div className={compact ? "text-[30px]" : "text-[36px]"}>{icon}</div> : null}
        <div className="min-w-0">
          <div className={`${compact ? "text-[18px]" : "text-[22px]"} font-semibold leading-[1.1]`}>
            {label}
          </div>
          {subtitle ? (
            <div className={`${compact ? "mt-1 text-[14px]" : "mt-1.5 text-[16px]"} text-muted leading-[1.25]`}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const EdgeLabel: React.FC<{
  text: string;
  accent?: boolean;
  compact?: boolean;
}> = ({text, accent = false, compact = false}) => (
  <div
    className={`border-2 border-ink font-semibold ${
      accent ? "bg-yellow" : "bg-white"
    } ${compact ? "px-2 py-0.5 text-[14px]" : "px-3 py-1 text-[15px]"}`}
    style={{boxShadow: shadows.brutalSm, whiteSpace: "nowrap"}}
  >
    {text}
  </div>
);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
