import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {stagger} from "../../../lib/chartMotion";
import {extent,scale,VIZ} from "../../../components/viz/chartPrimitives";

type Item={label:string;x:number;y:number;size:number;icon?:string;highlight?:boolean};
const DEFAULT:Item[]=[{label:"A",x:82,y:38,size:92,icon:"⚡",highlight:true},{label:"B",x:61,y:59,size:55,icon:"☁️"},{label:"C",x:42,y:72,size:44,icon:"🧠"},{label:"D",x:36,y:31,size:70,icon:"📦"},{label:"E",x:73,y:78,size:31,icon:"💻"}];
export const BubbleChart:React.FC<{eyebrow?:string;title?:string;items?:Item[];xLabel?:string;yLabel?:string}> =({eyebrow="3 VARIABLES",title="Position is X/Y. Bubble size is the third variable.",items=DEFAULT,xLabel="GROWTH →",yLabel="MARGIN →"})=>{
 const frame=useCurrentFrame(); const width=1680,height=600,left=80,right=50,top=35,bottom=70; const [xmin,xmax]=extent(items.map(i=>i.x)),[ymin,ymax]=extent(items.map(i=>i.y)),[smin,smax]=extent(items.map(i=>i.size));
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="relative mt-8"><svg width={width} height={height}><line x1={left} x2={left} y1={top} y2={height-bottom} stroke={VIZ.ink} strokeWidth={2}/><line x1={left} x2={width-right} y1={height-bottom} y2={height-bottom} stroke={VIZ.ink} strokeWidth={2}/>{items.map((it,i)=>{const p=stagger(frame,i,8,5,16);const cx=scale(it.x,xmin,xmax,left+60,width-right-60),cy=scale(it.y,ymin,ymax,height-bottom-50,top+50),r=scale(it.size,smin,smax,32,82)*p;return <g key={it.label} opacity={p}><circle cx={cx} cy={cy} r={r} fill={it.highlight?VIZ.yellow:VIZ.white} stroke={VIZ.ink} strokeWidth={3}/><text x={cx} y={cy+7} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fontWeight={600}>{it.icon} {it.label}</text></g>})}<text x={width/2} y={height-20} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.muted}>{xLabel}</text><text x={24} y={height/2} transform={`rotate(-90 24 ${height/2})`} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.muted}>{yLabel}</text></svg></div></Frame>
};
