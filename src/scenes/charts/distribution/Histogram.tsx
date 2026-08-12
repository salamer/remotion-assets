import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";
import {niceMax} from "../../../components/viz/chartPrimitives";

type Bin={label:string;count:number};
const DEFAULT:Bin[]=[{label:"0–10",count:4},{label:"10–20",count:9},{label:"20–30",count:18},{label:"30–40",count:31},{label:"40–50",count:39},{label:"50–60",count:28},{label:"60–70",count:17},{label:"70–80",count:8},{label:"80+",count:3}];
export const Histogram:React.FC<{eyebrow?:string;title?:string;bins?:Bin[]}> =({eyebrow="DISTRIBUTION",title="Show the shape of the data, not just the average.",bins=DEFAULT})=>{
 const frame=useCurrentFrame();const max=niceMax(Math.max(...bins.map(b=>b.count))*1.05);return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="mt-16 flex h-[590px] items-end border-b-2 border-ink px-5">{bins.map((b,i)=>{const p=stagger(frame,i,8,3,18);return <div key={b.label} className="flex flex-1 flex-col items-center justify-end"><div className="mb-2 text-[17px] font-semibold">{b.count}</div><div className={`w-full border-2 border-b-0 border-ink ${i===4?"bg-yellow":"bg-white"}`} style={{height:`${b.count/max*500*p}px`}}/><div className="mt-3 text-[16px] text-muted">{b.label}</div></div>})}</div></Frame>
};
