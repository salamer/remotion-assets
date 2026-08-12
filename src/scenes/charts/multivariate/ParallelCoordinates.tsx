import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {tween} from "../../../lib/chartMotion";
import {VIZ} from "../../../components/viz/chartPrimitives";

type Item={label:string;values:number[];highlight?:boolean};
const AXES=["GROWTH","MARGIN","ROIC","MOAT","SCALE"];
const DEFAULT:Item[]=[{label:"A",values:[88,74,81,91,85],highlight:true},{label:"B",values:[62,89,77,66,74]},{label:"C",values:[71,61,58,73,92]},{label:"D",values:[43,72,69,55,48]}];
export const ParallelCoordinates:React.FC<{eyebrow?:string;title?:string;axes?:string[];items?:Item[]}> =({eyebrow="MULTI-METRIC COMPARISON",title="Compare profiles without collapsing everything into one score.",axes=AXES,items=DEFAULT})=>{
 const frame=useCurrentFrame();const width=1680,height=600,left=120,right=120,top=50,bottom=80,chartW=width-left-right,chartH=height-top-bottom,x=(i:number)=>left+i/Math.max(1,axes.length-1)*chartW,y=(v:number)=>top+chartH-(v/100)*chartH;return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><svg width={width} height={height} className="mt-5">{axes.map((a,i)=><g key={a}><line x1={x(i)} x2={x(i)} y1={top} y2={top+chartH} stroke={VIZ.ink} strokeWidth={2} strokeOpacity={.28}/><text x={x(i)} y={height-30} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.ink}>{a}</text><text x={x(i)} y={top-15} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={15} fill={VIZ.muted}>100</text><text x={x(i)} y={top+chartH+22} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={15} fill={VIZ.muted}>0</text></g>)}{items.map((it,ii)=>{const p=tween(frame,8+ii*8,35);const pts=it.values.map((v,i)=>({x:x(i),y:y(v)}));const path=pts.map((q,i)=>`${i?"L":"M"} ${q.x} ${q.y}`).join(" ");return <g key={it.label} opacity={p}><path d={path} fill="none" stroke={it.highlight?VIZ.yellow:VIZ.ink} strokeWidth={it.highlight?10:4} strokeOpacity={it.highlight?1:.45}/><text x={pts.at(-1)!.x+25} y={pts.at(-1)!.y+6} fontFamily="IBM Plex Mono" fontSize={19} fill={VIZ.ink}>{it.label}</text></g>})}</svg></Frame>
};
