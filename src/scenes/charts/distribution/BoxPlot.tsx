import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";
import {extent,scale,VIZ} from "../../../components/viz/chartPrimitives";

type Box={label:string;min:number;q1:number;median:number;q3:number;max:number;highlight?:boolean};
const DEFAULT:Box[]=[{label:"US",min:22,q1:41,median:57,q3:72,max:94,highlight:true},{label:"EU",min:18,q1:35,median:49,q3:61,max:81},{label:"JP",min:15,q1:31,median:44,q3:55,max:73},{label:"KR",min:17,q1:37,median:51,q3:65,max:88}];
export const BoxPlot:React.FC<{eyebrow?:string;title?:string;boxes?:Box[]}> =({eyebrow="DISTRIBUTION COMPARISON",title="Compare medians, spreads and tails.",boxes=DEFAULT})=>{
 const frame=useCurrentFrame();const [mn0,mx0]=extent(boxes.flatMap(b=>[b.min,b.max])),pad=(mx0-mn0)*.08,mn=mn0-pad,mx=mx0+pad,width=1320;return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="mt-16 space-y-12">{boxes.map((b,i)=>{const p=stagger(frame,i,8,6,18);const X=(v:number)=>scale(v,mn,mx,0,width);return <div key={b.label} className="grid grid-cols-[200px_1320px] items-center gap-8"><div className="text-[23px] font-semibold">{b.label}</div><div className="relative h-[72px]" style={{opacity:p}}><div className="absolute top-1/2 h-[4px] bg-ink" style={{left:X(b.min),width:(X(b.max)-X(b.min))*p}}/><div className="absolute top-[15px] h-[42px] border-2 border-ink" style={{left:X(b.q1),width:(X(b.q3)-X(b.q1))*p,background:b.highlight?VIZ.yellow:VIZ.white}}/><div className="absolute top-[10px] h-[52px] w-[4px] bg-ink" style={{left:X(b.median)}}/><div className="absolute top-[22px] h-[28px] w-[4px] bg-ink" style={{left:X(b.min)}}/><div className="absolute top-[22px] h-[28px] w-[4px] bg-ink" style={{left:X(b.max)}}/></div></div>})}</div></Frame>
};
