import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";

type Row={label:string;down:number;up:number};
const DEFAULT:Row[]=[{label:"PRICE",down:-18,up:22},{label:"VOLUME",down:-14,up:16},{label:"FX",down:-11,up:9},{label:"WAGES",down:-8,up:7},{label:"TAX",down:-6,up:5}];
export const TornadoChart:React.FC<{eyebrow?:string;title?:string;rows?:Row[];suffix?:string}> =({eyebrow="SENSITIVITY",title="Which assumptions move the answer the most?",rows=DEFAULT,suffix="%"})=>{
 const frame=useCurrentFrame();const max=Math.max(...rows.flatMap(r=>[Math.abs(r.down),Math.abs(r.up)]),1);return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="relative mt-14"><div className="absolute left-1/2 top-0 h-full w-[3px] bg-ink"/><div className="space-y-6">{rows.map((r,i)=>{const p=stagger(frame,i,8,6,18);return <div key={r.label} className="grid grid-cols-[1fr_210px_1fr] items-center gap-4"><div className="flex justify-end"><div className="h-[58px] border-2 border-ink bg-white" style={{width:`${Math.abs(r.down)/max*100*p}%`}}><span className="float-right px-3 py-3 text-[18px]">{r.down}{suffix}</span></div></div><div className="text-center text-[21px] font-semibold">{r.label}</div><div><div className="h-[58px] border-2 border-ink bg-yellow" style={{width:`${Math.abs(r.up)/max*100*p}%`}}><span className="px-3 py-3 text-[18px]">+{r.up}{suffix}</span></div></div></div>})}</div><div className="mt-7 flex justify-center gap-[520px] text-[18px] text-muted"><span>DOWNSIDE ←</span><span>→ UPSIDE</span></div></div></Frame>
};
