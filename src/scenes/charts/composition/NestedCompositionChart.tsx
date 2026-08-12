import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";

type Child={label:string;value:number};
type Group={label:string;value:number;icon?:string;children:Child[];highlight?:boolean};
const DEFAULT:Group[]=[
  {label:"CONSUMER",value:55,icon:"👤",highlight:true,children:[{label:"SUB",value:32},{label:"ADS",value:23}]},
  {label:"ENTERPRISE",value:30,icon:"🏢",children:[{label:"SEATS",value:20},{label:"API",value:10}]},
  {label:"OTHER",value:15,icon:"•••",children:[{label:"SERVICES",value:9},{label:"OTHER",value:6}]},
];

export const NestedCompositionChart:React.FC<{eyebrow?:string;title?:string;groups?:Group[]}> =({eyebrow="NESTED MIX",title="Show both the major buckets and what sits inside them.",groups=DEFAULT})=>{
  const frame=useCurrentFrame();
  return <Frame>
    <SceneHeader eyebrow={eyebrow} title={title}/>
    <div className="mt-20 space-y-7">
      {groups.map((g,i)=>{
        const p=stagger(frame,i,8,7,18);
        return <div key={g.label} className="grid grid-cols-[250px_1fr] items-center gap-7" style={{opacity:p}}>
          <div><div className="text-[31px]">{g.icon}</div><div className="text-[22px] font-semibold">{g.label}</div><div className="text-[20px] text-muted">{g.value}% total</div></div>
          <div className={`flex h-[100px] border-2 border-ink ${g.highlight?"bg-yellow":"bg-white"}`} style={{width:`${(g.value/Math.max(...groups.map(x=>x.value)))*100}%`}}>
            {g.children.map((c,ci)=><div key={c.label} className={`flex items-center justify-center border-r-2 border-ink last:border-r-0 ${ci%2?"bg-soft":""}`} style={{width:`${(c.value/g.value)*100}%`}}><span className="text-[20px] font-semibold">{c.label}<br/>{c.value}%</span></div>)}
          </div>
        </div>
      })}
    </div>
  </Frame>
};
