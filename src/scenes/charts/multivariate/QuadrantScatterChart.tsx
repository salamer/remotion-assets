import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";

type Item={label:string;x:number;y:number;highlight?:boolean};
const DEFAULT:Item[]=[{label:"A",x:82,y:78,highlight:true},{label:"B",x:64,y:58},{label:"C",x:32,y:71},{label:"D",x:27,y:29},{label:"E",x:73,y:34},{label:"F",x:47,y:46}];
export const QuadrantScatterChart:React.FC<{eyebrow?:string;title?:string;items?:Item[];xLabel?:string;yLabel?:string;quadrants?:[string,string,string,string]}> =({eyebrow="2 × 2",title="Turn two metrics into a strategic map.",items=DEFAULT,xLabel="MARKET ATTRACTIVENESS →",yLabel="COMPETITIVE STRENGTH →",quadrants=["DEFEND","INVEST","EXIT","HARVEST"]})=>{
 const frame=useCurrentFrame();
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="relative mt-10 h-[620px] border-2 border-ink bg-white"><div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-ink opacity-25"/><div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-ink opacity-25"/><div className="absolute left-5 top-5 text-[18px] text-muted">{quadrants[0]}</div><div className="absolute right-5 top-5 text-[18px] text-muted">{quadrants[1]}</div><div className="absolute left-5 bottom-5 text-[18px] text-muted">{quadrants[2]}</div><div className="absolute right-5 bottom-5 text-[18px] text-muted">{quadrants[3]}</div>{items.map((it,i)=>{const p=stagger(frame,i,8,5,16);return <div key={it.label} className={`absolute flex h-[70px] min-w-[90px] items-center justify-center border-2 border-ink px-4 text-[20px] font-semibold ${it.highlight?"bg-yellow":"bg-white"}`} style={{left:`${it.x}%`,bottom:`${it.y}%`,transform:`translate(-50%,50%) scale(${.85+.15*p})`,opacity:p,boxShadow:"4px 4px 0 #111"}}>{it.label}</div>})}<div className="absolute -bottom-[42px] left-1/2 -translate-x-1/2 text-[18px] text-muted">{xLabel}</div><div className="absolute -left-[145px] top-1/2 -rotate-90 text-[18px] text-muted">{yLabel}</div></div></Frame>
};
