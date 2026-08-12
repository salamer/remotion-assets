import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../components/Frame";
import {SceneHeader} from "../../components/SceneHeader";
import {BrutalCard} from "../../components/BrutalCard";
import {slideUpStyle} from "../../lib/motion";

type Item={kicker:string;title:string;detail:string;icon?:string};
const d:Item[]=[
{kicker:"01 / GROWTH",title:"Demand is holding.",detail:"Volume remains resilient despite higher prices.",icon:"📈"},
{kicker:"02 / MARGIN",title:"Economics improved.",detail:"Mix and operating leverage lifted profitability.",icon:"💰"},
{kicker:"03 / RISK",title:"Rates are the swing factor.",detail:"The downside case is concentrated in financing costs.",icon:"⚠️"},
];

export const ExecutiveSummary:React.FC<{items?:Item[]}>=({items=d})=>{
 const frame=useCurrentFrame();
 return <Frame><SceneHeader eyebrow="EXECUTIVE SUMMARY" title="Three things matter."/>
 <div className="mt-14 grid grid-cols-3 gap-8">
 {items.map((x,i)=><div key={x.kicker} style={slideUpStyle(frame,10+i*8)}>
  <BrutalCard yellow={i===0} className="h-[500px] p-8">
   <div className="text-[54px]">{x.icon??"●"}</div>
   <div className="mt-8 text-[20px] tracking-[0.08em] text-muted">{x.kicker}</div>
   <div className="mt-4 text-[38px] font-semibold leading-[1.1]">{x.title}</div>
   <div className="mt-8 text-[24px] leading-[1.45] text-muted">{x.detail}</div>
  </BrutalCard>
 </div>)}
 </div></Frame>
};
