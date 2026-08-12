import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";

type Stage={label:string;icon?:string;players:string[];margin?:string;highlight?:boolean};
const DEFAULT:Stage[]=[
 {label:"INPUTS",icon:"⛏️",players:["A","B","C"],margin:"8%"},
 {label:"EQUIPMENT",icon:"⚙️",players:["D","E"],margin:"31%",highlight:true},
 {label:"MANUFACTURING",icon:"🏭",players:["F","G"],margin:"22%"},
 {label:"DISTRIBUTION",icon:"🚚",players:["H","I","J"],margin:"12%"},
 {label:"CUSTOMER",icon:"🛒",players:["END MARKET"],margin:"—"},
];

export const ValueChainMap:React.FC<{eyebrow?:string;title?:string;stages?:Stage[]}> =({eyebrow="VALUE CHAIN",title="Map where competition happens and where the profit pool sits.",stages=DEFAULT})=>{
 const frame=useCurrentFrame();
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/>
  <div className="mt-24 flex items-stretch gap-5">
   {stages.map((s,i)=>{const p=stagger(frame,i,8,6,18);return <React.Fragment key={s.label}>
    <div className={`flex min-h-[390px] flex-1 flex-col border-2 border-ink p-6 ${s.highlight?"bg-yellow":"bg-white"}`} style={{opacity:p,transform:`translateY(${(1-p)*20}px)`,boxShadow:"5px 5px 0 #111"}}>
      <div className="text-[50px]">{s.icon}</div><div className="mt-4 text-[22px] font-semibold">{s.label}</div><div className="mt-8 space-y-3">{s.players.map(x=><div key={x} className="border-2 border-ink bg-paper px-4 py-3 text-[18px] font-semibold">{x}</div>)}</div><div className="mt-auto pt-7 text-[18px] text-muted">MARGIN</div><div className="text-[38px] font-semibold">{s.margin}</div>
    </div>
    {i<stages.length-1?<div className="flex items-center text-[44px] font-semibold" style={{opacity:p}}>→</div>:null}
   </React.Fragment>})}
  </div>
 </Frame>
};
