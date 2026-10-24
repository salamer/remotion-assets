import fs from "node:fs";
import { z } from "zod";
import { episodeSchema } from "../src/program/schema";
import { brandSchema } from "../src/brand/schema";
fs.mkdirSync("schemas", { recursive: true });
for (const [name, schema] of [
  ["episode", episodeSchema],
  ["brand", brandSchema],
] as const) {
  fs.writeFileSync(
    `schemas/${name}.schema.json`,
    JSON.stringify(
      z.toJSONSchema(schema, { target: "draft-7", io: "input" }),
      null,
      2,
    ) + "\n",
  );
}
console.log("Generated episode and brand JSON Schemas");
