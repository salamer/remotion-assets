import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {Source} from "../../../components/Source";
import {stagger} from "../../../lib/chartMotion";
import {GridLines, MiniLegend, niceMax, VIZ} from "../../../components/viz/chartPrimitives";

type Row={label:string;a:number;b:number;c?:number};
const DEFAULT:Row[]=[
 {label:"2021",a:42,b:31,c:22},{label:"2022",a:49,b:35,c:25},{label:"2023",a:57,b:41,c:29},{label:"2024",a:63,b:46,c:34},{label:"2025",a:71,b:52,c:38},
];
export const GroupedBarChart:React.FC<{eyebrow?:string;title?:string;data?:Row[];labels?:[string,string,string?];source?:string}> =({eyebrow="GROUPED BARS",title="Compare several series across the same categories.",data=DEFAULT,labels=["A","B","C"],source})=>{
 const frame=useCurrentFrame(); const width=1680,height=600,left=80,right=40,top=30,bottom=70; const chartH=height-top-bottom; const chartW=width-left-right;
 const max=niceMax(Math.max(...data.flatMap(d=>[d.a,d.b,d.c??0]))*1.05); const groupW=chartW/data.length; const barW=Math.min(52,groupW/5);
 return <Frame><div className="flex items-start justify-between gap-10"><SceneHeader eyebrow={eyebrow} title={title}/><div className="mt-4"><MiniLegend items={[{label:labels[0],yellow:true},{label:labels[1]},{label:labels[2]??"",kind:"bar" as const}].filter(x=>x.label)}/></div></div>
  <svg width={width} height={height} className="mt-5"><GridLines width={width} height={height} left={left} right={right} top={top} bottom={bottom}/>
   {data.map((d,i)=>{const p=stagger(frame,i,8,4,18); const center=left+groupW*(i+0.5); const vals=[d.a,d.b,d.c].filter((x):x is number=>x!==undefined); return <g key={d.label}>{vals.map((v,j)=>{const h=v/max*chartH*p; return <rect key={j} x={center+(j-(vals.length-1)/2)*(barW+8)-barW/2} y={top+chartH-h} width={barW} height={h} fill={j===0?VIZ.yellow:j===1?VIZ.white:VIZ.soft} stroke={VIZ.ink} strokeWidth={2}/>})}<text x={center} y={height-25} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.muted}>{d.label}</text></g>})}
  </svg>{source?<Source>{source}</Source>:null}
 </Frame>
};
