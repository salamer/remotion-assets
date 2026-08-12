import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {tween} from "../../../lib/chartMotion";
import {extent, GridLines, scale, smoothPath, VIZ} from "../../../components/viz/chartPrimitives";

type Point={label:string;low:number;mid:number;high:number};
const DEFAULT:Point[]=[{label:"2025",low:92,mid:100,high:108},{label:"2026",low:88,mid:104,high:118},{label:"2027",low:84,mid:110,high:132},{label:"2028",low:80,mid:118,high:148},{label:"2029",low:76,mid:126,high:166}];
export const RangeBandChart:React.FC<{eyebrow?:string;title?:string;data?:Point[]}> =({eyebrow="RANGE / UNCERTAINTY",title="A forecast is a range, not a single line.",data=DEFAULT})=>{
 const frame=useCurrentFrame(),p=tween(frame,10,55); const width=1680,height=600,left=80,right=50,top=40,bottom=75,chartW=width-left-right,chartH=height-top-bottom; const [mn0,mx0]=extent(data.flatMap(d=>[d.low,d.mid,d.high])); const pad=(mx0-mn0)*.08,mn=mn0-pad,mx=mx0+pad; const x=(i:number)=>left+i/Math.max(1,data.length-1)*chartW,y=(v:number)=>scale(v,mn,mx,top+chartH,top); const low=data.map((d,i)=>({x:x(i),y:y(d.low)})),mid=data.map((d,i)=>({x:x(i),y:y(d.mid)})),high=data.map((d,i)=>({x:x(i),y:y(d.high)})); const band=[...high,...low.slice().reverse()].map(q=>`${q.x},${q.y}`).join(" ");
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><svg width={width} height={height} className="mt-8"><defs><clipPath id="range-reveal"><rect x={left} y={0} width={chartW*p} height={height}/></clipPath></defs><GridLines width={width} height={height} left={left} right={right} top={top} bottom={bottom}/><g clipPath="url(#range-reveal)"><polygon points={band} fill={VIZ.yellow} fillOpacity={.35}/><path d={smoothPath(low)} fill="none" stroke={VIZ.muted} strokeWidth={3} strokeDasharray="10 8"/><path d={smoothPath(high)} fill="none" stroke={VIZ.muted} strokeWidth={3} strokeDasharray="10 8"/><path d={smoothPath(mid)} fill="none" stroke={VIZ.ink} strokeWidth={8}/></g>{data.map((d,i)=><text key={d.label} x={x(i)} y={height-28} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.muted}>{d.label}</text>)}</svg></Frame>
};
