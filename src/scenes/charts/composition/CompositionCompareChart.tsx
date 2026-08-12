import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";

type Segment = {label: string; value: number};
type Row = {label: string; icon?: string; segments: Segment[]};
const DEFAULT: Row[] = [
  {label: "2020", icon: "◷", segments: [{label:"CORE",value:55},{label:"ADS",value:25},{label:"OTHER",value:20}]},
  {label: "2025", icon: "◆", segments: [{label:"CORE",value:42},{label:"ADS",value:38},{label:"OTHER",value:20}]},
];

export const CompositionCompareChart: React.FC<{
  eyebrow?: string;
  title?: string;
  rows?: Row[];
}> = ({eyebrow="COMPOSITION", title="Compare two mixes, not just two totals.", rows=DEFAULT}) => {
  const frame=useCurrentFrame();
  return <Frame>
    <SceneHeader eyebrow={eyebrow} title={title}/>
    <div className="mt-20 space-y-14">
      {rows.map((row,ri)=>{
        const p=stagger(frame,ri,8,10,20);
        return <div key={row.label}>
          <div className="mb-4 flex items-center gap-4 text-[25px] font-semibold"><span>{row.icon}</span>{row.label}</div>
          <div className="flex h-[120px] overflow-hidden border-2 border-ink bg-white" style={{width:`${p*100}%`}}>
            {row.segments.map((s,si)=>{
              return <div key={s.label} className={`flex items-center justify-center border-r-2 border-ink last:border-r-0 ${si===0?"bg-yellow":si===1?"bg-ink text-white":"bg-soft"}`} style={{width:`${s.value}%`}}>
                <span className="text-[22px] font-semibold">{s.label} / {s.value}%</span>
              </div>
            })}
          </div>
        </div>
      })}
    </div>
  </Frame>
};
