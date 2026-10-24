import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { templateCatalog } from "../src/program/catalog";

const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ".");
const program = ts.createProgram(parsed.fileNames, parsed.options),
  checker = program.getTypeChecker();
type Schema = {
  type?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: boolean | Schema;
  items?: Schema;
  anyOf?: Schema[];
  enum?: unknown[];
  minItems?: number;
  maxItems?: number;
};
function schema(t: ts.Type, depth = 0): Schema {
  if (depth > 12) return {};
  if (t.isUnion()) {
    const parts = t.types.filter((x) => !(x.flags & ts.TypeFlags.Undefined));
    if (parts.length === 1) return schema(parts[0], depth + 1);
    return { anyOf: parts.map((x) => schema(x, depth + 1)) };
  }
  if (t.isStringLiteral() || t.isNumberLiteral()) return { enum: [t.value] };
  if (t.flags & ts.TypeFlags.String) return { type: "string" };
  if (t.flags & ts.TypeFlags.Number) return { type: "number" };
  if (t.flags & ts.TypeFlags.BooleanLike) return { type: "boolean" };
  if (t.flags & ts.TypeFlags.Null) return { type: "null" };
  if (checker.isArrayType(t) || checker.isTupleType(t))
    return {
      type: "array",
      items: schema(
        checker.getIndexTypeOfType(t, ts.IndexKind.Number)!,
        depth + 1,
      ),
      minItems: 1,
      maxItems: 500,
    };
  if (t.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return {};
  const properties: Record<string, Schema> = {},
    required: string[] = [];
  for (const property of t.getProperties()) {
    const decl = property.valueDeclaration || property.declarations?.[0];
    if (!decl) continue;
    if (property.name.startsWith("__")) continue;
    properties[property.name] = schema(
      checker.getTypeOfSymbolAtLocation(property, decl),
      depth + 1,
    );
    if (!(property.flags & ts.SymbolFlags.Optional))
      required.push(property.name);
  }
  const index = t.getStringIndexType();
  return {
    type: "object",
    properties,
    ...(required.length ? { required } : {}),
    additionalProperties: index ? schema(index, depth + 1) : false,
  };
}
const sf = program.getSourceFile("src/showcase/compositions.ts")!;
const entries: {
  id: string;
  component: string;
  source: string;
  dataDriven: boolean;
  propsSchema: Schema;
}[] = [];
function visit(node: ts.Node) {
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(sf) === "withProps" &&
    node.arguments.length >= 2 &&
    ts.isStringLiteral(node.arguments[0])
  ) {
    const [id, component] = node.arguments;
    const type = checker.getTypeAtLocation(component),
      signature = type.getCallSignatures()[0];
    const parameter = signature?.getParameters()[0];
    const decl = parameter?.valueDeclaration || parameter?.declarations?.[0];
    const props =
      parameter && decl
        ? schema(checker.getTypeOfSymbolAtLocation(parameter, decl))
        : ({
            type: "object",
            properties: {},
            additionalProperties: false,
          } as Schema);
    const symbol = checker.getSymbolAtLocation(component);
    const target =
      symbol && symbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(symbol)
        : symbol;
    const source = target?.declarations?.[0]?.getSourceFile().fileName || "";
    entries.push({
      id: (id as ts.StringLiteral).text,
      component: component.getText(sf),
      source: path.relative(process.cwd(), path.resolve(source)),
      dataDriven: Object.keys(props.properties || {}).length > 0,
      propsSchema: props,
    });
  }
  ts.forEachChild(node, visit);
}
visit(sf);
fs.mkdirSync("schemas", { recursive: true });
fs.writeFileSync(
  "schemas/legacy-catalog.json",
  JSON.stringify(entries, null, 2) + "\n",
);
fs.writeFileSync(
  "schemas/template-catalog.json",
  JSON.stringify(templateCatalog, null, 2) + "\n",
);
const rows = entries
  .map(
    (x) =>
      `| ${x.id} | ${Object.keys(x.propsSchema.properties || {}).join(", ") || "无"} | [源文件](../${x.source}) |`,
  )
  .join("\n");
fs.writeFileSync(
  "docs/LEGACY-CATALOG.md",
  `# 原组件目录（自动生成）\n\n共 ${entries.length} 个 Composition。JSON props 按原组件接口校验；请同时检查布局适用范围。原示例仍包含演示文案，生产时须显式提供数据与标题。仅支持 16:9。\n\n| Composition ID | 可传入参数 | 实现 |\n| --- | --- | --- |\n${rows}\n`,
);
console.log(
  `Catalog: ${templateCatalog.length - 1} native templates + ${entries.length} legacy compositions`,
);
