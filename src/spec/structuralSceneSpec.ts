/**
 * Diagram / framework scene specs for prop-driven structural scenes.
 */
import type {OrganizationTreeProps} from "../scenes/diagrams/hierarchy/OrganizationTree";
import type {OwnershipTreeProps} from "../scenes/diagrams/hierarchy/OwnershipTree";
import type {SankeyDiagramProps} from "../scenes/diagrams/flow/SankeyDiagram";
import type {ValueChainDiagramProps} from "../scenes/diagrams/flow/ValueChainDiagram";
import type {MetricDriverTreeProps} from "../scenes/frameworks/planning/MetricDriverTree";
import type {CausalGraphProps} from "../scenes/diagrams/relationships/CausalGraph";
import type {CapitalStackDiagramProps} from "../scenes/diagrams/finance/CapitalStackDiagram";
import type {BalanceSheetDiagramProps} from "../scenes/diagrams/finance/BalanceSheetDiagram";

export type OrganizationTreeScene = {type: "organization-tree"} & OrganizationTreeProps;
export type OwnershipTreeScene = {type: "ownership-tree"} & OwnershipTreeProps;
export type SankeyDiagramScene = {type: "sankey-diagram"} & SankeyDiagramProps;
export type ValueChainDiagramScene = {type: "value-chain-diagram"} & ValueChainDiagramProps;
export type MetricDriverTreeScene = {type: "metric-driver-tree"} & MetricDriverTreeProps;
export type CausalGraphScene = {type: "causal-graph"} & CausalGraphProps;
export type CapitalStackDiagramScene = {type: "capital-stack-diagram"} & CapitalStackDiagramProps;
export type BalanceSheetDiagramScene = {type: "balance-sheet-diagram"} & BalanceSheetDiagramProps;

export type DiagramSceneSpec =
  | OrganizationTreeScene
  | OwnershipTreeScene
  | SankeyDiagramScene
  | ValueChainDiagramScene
  | MetricDriverTreeScene
  | CausalGraphScene
  | CapitalStackDiagramScene
  | BalanceSheetDiagramScene;

/** @deprecated Use DiagramSceneSpec */
export type StructuralScene = DiagramSceneSpec;
