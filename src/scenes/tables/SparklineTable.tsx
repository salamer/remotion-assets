import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../components/Frame";
import {SceneHeader} from "../../components/SceneHeader";
import {palette,reveal} from "../../lib/motion";

const rows=[
{name:"US",latest:"3.2%",data:[2,3,5,6,4,3,3.2]},
{name:"EU",latest:"1.5%",data:[1,2,3,3,2,1.7,1.5]},
{name:"JP",latest:"1.0%",data:[0.5,0.7,1.2,1.3,1.1,1.0,1.0]},
{name:"CN",latest:"4.8%",data:[6.1,5.8,5.3,5.0,4.7,4.6,4.8]},
];

export const SparklineTable:React.FC=()=>{
 const frame=useCurrentFrame();
 return <Frame><SceneHeader eyebrow="AT A GLANCE" title="Small charts, precise comparisons."/>
 <div className="mt-12 border-2 border-ink bg-white">
 {rows.map((r,i)=>{
  const p=reveal(frame,8+i*7,18),min=Math.min(...r.data),max=Math.max(...r.data);
  const pts=r.data.map((v,j)=>({x:(j/(r.data.length-1))*500,y:90-((v-min)/Math.max(0.001,max-min))*70}));
  const d=pts.map((pt,j)=>`${j===0?"M":"L"} ${pt.x} ${pt.y}`).join(" "),last=pts[pts.length-1];
  return <div key={r.name} className="grid grid-cols-[220px_1fr_220px] items-center border-t-2 first:border-t-0 border-ink px-7 py-5" style={{opacity:p}}>
   <div className="text-[26px] font-semibold">{r.name}</div>
   <svg width={500} height={100}><path d={d} fill="none" stroke={palette.ink} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/><circle cx={last.x} cy={last.y} r={7} fill={palette.yellow} stroke={palette.ink} strokeWidth={2}/></svg>
   <div className="text-right text-[32px] font-semibold">{r.latest}</div>
  </div>
 })}
 </div></Frame>
};
