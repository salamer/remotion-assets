import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { stagger } from "../../../lib/chartMotion";

const COHORTS = ["2021", "2022", "2023", "2024", "2025"];
const AGE = ["M0", "M1", "M2", "M3", "M4", "M5"];
const VALUES = [
  [100, 72, 59, 51, 46, 43],
  [100, 76, 64, 57, 53, 49],
  [100, 79, 69, 62, 58, 55],
  [100, 82, 73, 67, 63, 60],
  [100, 85, 77, 72, 68, 65],
];
export const CohortMatrix: React.FC<{
  eyebrow?: string;
  title?: string;
  cohorts?: string[];
  ages?: string[];
  values?: number[][];
}> = ({
  eyebrow = "COHORT",
  title = "Compare retention or behavior by cohort age.",
  cohorts = COHORTS,
  ages = AGE,
  values = VALUES,
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div
        className="mt-14 grid"
        style={{ gridTemplateColumns: `190px repeat(${ages.length},1fr)` }}
      >
        <div />
        {ages.map((a) => (
          <div key={a} className="pb-4 text-center text-[18px] font-semibold">
            {a}
          </div>
        ))}
        {cohorts.map((c, ri) => (
          <React.Fragment key={c}>
            <div className="flex items-center text-[21px] font-semibold">
              {c} COHORT
            </div>
            {ages.map((a, ci) => {
              const v = values[ri]?.[ci];
              const p = stagger(frame, ri * ages.length + ci, 8, 1.2, 10);
              return (
                <div
                  key={`${c}-${a}`}
                  className="m-[4px] flex h-[82px] items-center justify-center border-2 border-ink text-[20px] font-semibold"
                  style={{
                    opacity: v === undefined ? 0.15 : p,
                    background:
                      v === undefined
                        ? "#ECECE7"
                        : `rgba(255,212,59,${0.1 + 0.9 * (v / 100)})`,
                  }}
                >
                  {v === undefined ? "—" : `${v}%`}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </Frame>
  );
};
