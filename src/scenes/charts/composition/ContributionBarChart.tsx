import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";

type Item={label:string;value:number;icon?:string};
const DEFAULT:Item[]=[
  {label:"PRICE",value:3.8,icon:"🏷️"},
  {label:"VOLUME",value:2.4,icon:"📦"},
  {label:"FX",value:-1.1,icon:"💱"},
  {label:"MIX",value:1.6,icon:"🧩"},
  {label:"CHURN",value:-0.8,icon:"↘"},
];

export const ContributionBarChart:React.FC<{eyebrow?:string;title?:string;items?:Item[];suffix?:string}> =({eyebrow="CONTRIBUTION",title="What actually drove the change?",items=DEFAULT,suffix="pt"})=>{
  const frame=useCurrentFrame();
  const maxAbs=Math.max(...items.map(i=>Math.abs(i.value)),1);
  return <Frame>
    <SceneHeader eyebrow={eyebrow} title={title}/>
    <div className="relative mt-16 h-[610px]">
      <div className="absolute left-1/2 top-0 h-full w-[3px] bg-ink"/>
      <div className="space-y-7">
        {items.map((item,i)=>{
          const p=stagger(frame,i,8,6,18);
          const w=(Math.abs(item.value)/maxAbs)*46*p;
          const positive=item.value>=0;
          return <div key={item.label} className="grid grid-cols-[1fr_210px_1fr] items-center gap-5">
            <div className="flex justify-end">{!positive&&<div className="h-[58px] border-2 border-ink bg-white" style={{width:`${w}%`}}/>}</div>
            <div className="text-center text-[22px] font-semibold">{item.icon} {item.label}<div className="text-[18px] text-muted">{item.value>0?"+":""}{item.value}{suffix}</div></div>
            <div>{positive&&<div className="h-[58px] border-2 border-ink bg-yellow" style={{width:`${w}%`}}/>}</div>
          </div>
        })}
      </div>
      <div className="mt-6 flex justify-center gap-[480px] text-[18px] text-muted"><span>NEGATIVE ←</span><span>→ POSITIVE</span></div>
    </div>
  </Frame>
};
