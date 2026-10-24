import React from "react";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { Waterfall } from "../../../broadcast/charts";
import { sceneSchema } from "../../../program/schema";

type Step = {
  label: string;
  value: number;
  type: "start" | "end" | "positive" | "negative" | "total" | "delta";
};
const DEFAULT: Step[] = [
  { label: "REVENUE", value: 100, type: "start" },
  { label: "COGS", value: -25, type: "negative" },
  { label: "SALES", value: -15, type: "negative" },
  { label: "R&D", value: -12, type: "negative" },
  { label: "PROFIT", value: 48, type: "end" },
];
export const WaterfallChart: React.FC<{
  data?: Step[];
  title?: string;
  eyebrow?: string;
  unit?: string;
  source?: string;
}> = ({
  data = DEFAULT,
  title = "From $100 of revenue to $48 of profit.",
  eyebrow = "UNIT ECONOMICS",
  unit = "$",
  source,
}) => {
  const scene = sceneSchema.parse({
    id: "legacy-waterfall",
    type: "waterfall",
    title,
    unit,
    data: data.map((d) => ({
      label: d.label,
      value: d.value,
      kind: ["start", "end", "total"].includes(d.type) ? "total" : "delta",
    })),
  });
  if (scene.type !== "waterfall") throw new Error("Invalid waterfall");
  return (
    <Frame>
      <SceneHeader title={title} eyebrow={eyebrow} />
      <div
        style={{
          height: 650,
          marginTop: 42,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Waterfall scene={scene} />
      </div>
      {source && <Source>{source}</Source>}
    </Frame>
  );
};
