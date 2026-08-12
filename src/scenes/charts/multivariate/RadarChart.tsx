import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {tween} from "../../../lib/chartMotion";
import {VIZ} from "../../../components/viz/chartPrimitives";

const AXES=["GROWTH","MARGIN","SCALE","MOAT","CAPITAL","GLOBAL"];
const A=[88,72,91,78,65,86];
const B=[61,84,74,66,88,57];
const pts=(vals:number[],cx:number,cy:number,r:number)=>vals.map((v,i)=>{const a=-Math.PI/2+i/vals.length*Math.PI*2;const rr=r*v/100;return {x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr}});
export const RadarChart:React.FC<{eyebrow?:string;title?:string;axes?:string[];a?:number[];b?:number[];aLabel?:string;bLabel?:string}> =({eyebrow="MULTI-DIMENSION",title="Use sparingly: a quick strategic profile, not precision analysis.",axes=AXES,a=A,b=B,aLabel="A",bLabel="B"})=>{
 const frame=useCurrentFrame();const pa=tween(frame,10,35),pb=tween(frame,22,35),cx=840,cy=320,r=250;const ap=pts(a.map(v=>v*pa),cx,cy,r),bp=pts(b.map(v=>v*pb),cx,cy,r);const poly=(p:{x:number;y:number}[])=>p.map(q=>`${q.x},${q.y}`).join(" ");
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><svg width={1680} height={650} className="mt-1">{[.25,.5,.75,1].map(level=>{const p=axes.map((_,i)=>{const a=-Math.PI/2+i/axes.length*Math.PI*2;return `${cx+Math.cos(a)*r*level},${cy+Math.sin(a)*r*level}`}).join(" ");return <polygon key={level} points={p} fill="none" stroke={VIZ.ink} strokeOpacity={.16} strokeWidth={2}/>})}{axes.map((ax,i)=>{const a=-Math.PI/2+i/axes.length*Math.PI*2;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,lx=cx+Math.cos(a)*(r+58),ly=cy+Math.sin(a)*(r+58);return <g key={ax}><line x1={cx} y1={cy} x2={x} y2={y} stroke={VIZ.ink} strokeOpacity={.12} strokeWidth={2}/><text x={lx} y={ly} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.ink}>{ax}</text></g>})}<polygon points={poly(ap)} fill={VIZ.yellow} fillOpacity={.45} stroke={VIZ.ink} strokeWidth={5}/><polygon points={poly(bp)} fill={VIZ.white} fillOpacity={.2} stroke={VIZ.muted} strokeWidth={4} strokeDasharray="12 8"/><text x={1280} y={100} fontFamily="IBM Plex Mono" fontSize={20} fill={VIZ.ink}>■ {aLabel}</text><text x={1280} y={140} fontFamily="IBM Plex Mono" fontSize={20} fill={VIZ.muted}>□ {bLabel}</text></svg></Frame>
};
