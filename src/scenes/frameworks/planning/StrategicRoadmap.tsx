import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {reveal} from "../../../lib/motion";

const phases=[
{period:"0–6M",title:"FIX",items:["Pricing","Cost base","Retention"],icon:"🔧"},
{period:"6–18M",title:"SCALE",items:["New channels","Automation","International"],icon:"📈"},
{period:"18–36M",title:"EXPAND",items:["New products","M&A","Platform"],icon:"🚀"},
];

export const StrategicRoadmap:React.FC=()=>{
 const frame=useCurrentFrame();
 return <Frame><SceneHeader eyebrow="ROADMAP" title="Sequence the strategy."/>
 <div className="relative mt-20">
  <div className="absolute left-[130px] right-[130px] top-[74px] h-[5px] bg-soft"><div className="h-full bg-ink" style={{width:`${reveal(frame,8,50)*100}%`}}/></div>
  <div className="grid grid-cols-3 gap-12">
   {phases.map((p,i)=>{const r=reveal(frame,12+i*12);return <div key={p.title} style={{opacity:r,transform:`translateY(${(1-r)*18}px)`}}>
    <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center border-2 border-ink bg-yellow text-[36px]">{p.icon}</div>
    <div className="mt-8 border-2 border-ink bg-white p-7" style={{boxShadow:i===1?"6px 6px 0 #111":undefined}}>
     <div className="text-[20px] text-muted">{p.period}</div><div className="mt-2 text-[36px] font-semibold">{p.title}</div>
     <div className="mt-6 space-y-3 text-[22px]">{p.items.map(x=><div key={x}>→ {x}</div>)}</div>
    </div>
   </div>})}
  </div>
 </div></Frame>
};
