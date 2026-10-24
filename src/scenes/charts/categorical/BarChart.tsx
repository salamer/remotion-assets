import React from "react";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { Bars } from "../../../broadcast/charts";
import { sceneSchema } from "../../../program/schema";
const DEFAULT = [
  { year: "2020", value: 3.4 },
  { year: "2021", value: 6 },
  { year: "2022", value: 8.4 },
  { year: "2023", value: 9.9 },
  { year: "2024", value: 11.1 },
];
export const BarChart: React.FC<{
  data?: { year: string; value: number }[];
  title?: string;
  eyebrow?: string;
  unit?: string;
  source?: string;
}> = ({
  data = DEFAULT,
  title = "Revenue almost tripled.",
  eyebrow = "REVENUE",
  unit = "$B",
  source,
}) => {
  const scene = sceneSchema.parse({
    id: "legacy-bar",
    type: "bars",
    title,
    unit,
    orientation: "vertical",
    data: data.map((d, i) => ({
      label: d.year,
      value: d.value,
      highlight: i === data.length - 1,
    })),
  });
  if (scene.type !== "bars") throw new Error("Invalid bars");
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
        <Bars scene={scene} />
      </div>
      {source && <Source>{source}</Source>}
    </Frame>
  );
};
