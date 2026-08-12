import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {reveal} from "../../../lib/motion";

const rows=[
["80+",3,5],["70–79",6,8],["60–69",10,11],["50–59",12,12],["40–49",11,11],["30–39",9,9],["20–29",7,7],["10–19",6,6],["0–9",5,5]
];

export const PopulationPyramid:React.FC=()=>{
 const frame=useCurrentFrame(),max=12;
 return <Frame><SceneHeader eyebrow="DEMOGRAPHY" title="An aging society has a different shape."/>
 <div className="mt-12">{rows.map((r,i)=>{const p=reveal(frame,8+i*3,18);return <div key={String(r[0])} className="grid grid-cols-[1fr_120px_1fr] items-center gap-4 py-[5px]">
  <div className="flex justify-end"><div className="h-[42px] border-2 border-ink bg-white" style={{width:`${(Number(r[1])/max)*100*p}%`}}/></div>
  <div className="text-center text-[20px] font-semibold">{r[0]}</div>
  <div className="h-[42px] border-2 border-ink bg-yellow" style={{width:`${(Number(r[2])/max)*100*p}%`}}/>
 </div>})}<div className="mt-5 grid grid-cols-[1fr_120px_1fr] text-[18px] text-muted"><div className="text-right">MALE</div><div/><div>FEMALE</div></div></div>
 </Frame>
};
