import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";
import {extent,scale} from "../../../components/viz/chartPrimitives";

type Item={label:string;value:number;group?:string;highlight?:boolean};
const DEFAULT:Item[]=[{label:"A",value:82,group:"US",highlight:true},{label:"B",value:71,group:"US"},{label:"C",value:66,group:"EU"},{label:"D",value:59,group:"EU"},{label:"E",value:48,group:"ASIA"},{label:"F",value:39,group:"ASIA"}];
export const DotPlot:React.FC<{eyebrow?:string;title?:string;items?:Item[];suffix?:string}> =({eyebrow="DOT PLOT",title="Use dots when the marks should stay visually light.",items=DEFAULT,suffix=""})=>{
 const frame=useCurrentFrame(); const [mn0,mx0]=extent(items.map(i=>i.value)),pad=(mx0-mn0)*.15,mn=mn0-pad,mx=mx0+pad; const width=1320;
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="mt-14 ml-[260px] flex w-[1320px] justify-between text-[17px] text-muted"><span>{mn.toFixed(0)}</span><span>{mx.toFixed(0)}</span></div><div className="mt-3 space-y-6">{items.map((it,i)=>{const p=stagger(frame,i,8,5,16);const x=scale(it.value,mn,mx,0,width);return <div key={it.label} className="grid grid-cols-[230px_1320px_120px] items-center gap-7"><div><span className="text-[22px] font-semibold">{it.label}</span>{it.group?<span className="ml-3 text-[16px] text-muted">{it.group}</span>:null}</div><div className="relative h-[38px]"><div className="absolute top-1/2 h-[2px] w-full bg-soft"/><div className={`absolute top-1/2 h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 border-2 border-ink ${it.highlight?"bg-yellow":"bg-white"}`} style={{left:x,opacity:p,transform:`translate(-50%,-50%) scale(${.8+.2*p})`}}/></div><div className="text-right text-[22px] font-semibold">{it.value}{suffix}</div></div>})}</div></Frame>
};
