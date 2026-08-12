import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";
import {niceMax} from "../../../components/viz/chartPrimitives";

type Row = {label: string; actual: number; benchmark: number};
const DEFAULT: Row[] = [
  {label: "Revenue", actual: 118, benchmark: 100},
  {label: "Gross Profit", actual: 91, benchmark: 100},
  {label: "EBIT", actual: 126, benchmark: 100},
  {label: "Free Cash Flow", actual: 142, benchmark: 100},
];

export const VarianceComparisonChart: React.FC<{
  eyebrow?: string;
  title?: string;
  data?: Row[];
  actualLabel?: string;
  benchmarkLabel?: string;
}> = ({
  eyebrow = "ACTUAL VS BENCHMARK",
  title = "Make the variance impossible to miss.",
  data = DEFAULT,
  actualLabel = "ACTUAL",
  benchmarkLabel = "PLAN",
}) => {
  const frame = useCurrentFrame();
  const max = niceMax(Math.max(...data.flatMap((d)=>[d.actual,d.benchmark]))*1.1);
  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />
      <div className="mt-16 space-y-9">
        {data.map((d,i)=>{
          const p=stagger(frame,i,8,7,18);
          const delta=d.actual-d.benchmark;
          const actualW=(d.actual/max)*100*p;
          const targetX=(d.benchmark/max)*100;
          return <div key={d.label} className="grid grid-cols-[260px_1fr_150px] items-center gap-6">
            <div className="text-[23px] font-semibold">{d.label}</div>
            <div className="relative h-[54px] border-2 border-ink bg-white">
              <div className="h-full bg-yellow" style={{width:`${actualW}%`}}/>
              <div className="absolute top-[-10px] h-[70px] w-[4px] bg-ink" style={{left:`${targetX}%`}}/>
              <span className="absolute -top-[34px] text-[16px] text-muted" style={{left:`${targetX}%`,transform:"translateX(-50%)"}}>{benchmarkLabel} {d.benchmark}</span>
            </div>
            <div className={`border-2 border-ink px-4 py-3 text-center text-[23px] font-semibold ${delta>=0?"bg-yellow":"bg-white"}`} style={{opacity:p}}>{delta>=0?"+":""}{delta}</div>
          </div>
        })}
      </div>
      <div className="mt-10 text-[18px] text-muted">BAR = {actualLabel} · MARKER = {benchmarkLabel}</div>
    </Frame>
  );
};
