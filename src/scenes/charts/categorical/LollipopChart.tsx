import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";
import {niceMax} from "../../../components/viz/chartPrimitives";

type Item={label:string;value:number;icon?:string;highlight?:boolean};
const DEFAULT:Item[]=[{label:"US",value:48,icon:"🇺🇸",highlight:true},{label:"CHINA",value:31,icon:"🇨🇳"},{label:"EU",value:26,icon:"🇪🇺"},{label:"JAPAN",value:12,icon:"🇯🇵"},{label:"KOREA",value:9,icon:"🇰🇷"}];
export const LollipopChart:React.FC<{eyebrow?:string;title?:string;items?:Item[];suffix?:string}> =({eyebrow="RANKING",title="A lighter alternative to bars.",items=DEFAULT,suffix="%"})=>{
 const frame=useCurrentFrame(); const max=niceMax(Math.max(...items.map(i=>i.value))*1.05);
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="mt-14 space-y-7">{items.map((item,i)=>{const p=stagger(frame,i,8,6,18);const w=item.value/max*100*p;return <div key={item.label} className="grid grid-cols-[230px_1fr_110px] items-center gap-6"><div className="text-[23px] font-semibold">{item.icon} {item.label}</div><div className="relative h-[42px]"><div className="absolute top-1/2 h-[4px] -translate-y-1/2 bg-ink" style={{width:`${w}%`}}/><div className={`absolute top-1/2 h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 border-2 border-ink ${item.highlight?"bg-yellow":"bg-white"}`} style={{left:`${w}%`}}/></div><div className="text-right text-[25px] font-semibold">{item.value}{suffix}</div></div>})}</div></Frame>
};
