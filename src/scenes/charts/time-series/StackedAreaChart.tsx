import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {tween} from "../../../lib/chartMotion";
import {VIZ} from "../../../components/viz/chartPrimitives";

type Row={label:string;a:number;b:number;c:number};
const DEFAULT:Row[]=[{label:"2021",a:30,b:20,c:10},{label:"2022",a:35,b:24,c:12},{label:"2023",a:41,b:28,c:15},{label:"2024",a:45,b:34,c:20},{label:"2025",a:51,b:40,c:26}];
const polygon=(tops:{x:number;y:number}[],bottoms:{x:number;y:number}[])=>[...tops,...bottoms.slice().reverse()].map(p=>`${p.x},${p.y}`).join(" ");
export const StackedAreaChart:React.FC<{eyebrow?:string;title?:string;data?:Row[];labels?:[string,string,string]}> =({eyebrow="STACKED AREA",title="Show growth and mix at the same time.",data=DEFAULT,labels=["CORE","NEW","OTHER"]})=>{
 const frame=useCurrentFrame(),p=tween(frame,10,55); const width=1680,height=600,left=80,right=50,top=40,bottom=75,chartW=width-left-right,chartH=height-top-bottom; const totals=data.map(d=>d.a+d.b+d.c),max=Math.max(...totals)*1.08; const x=(i:number)=>left+i/Math.max(1,data.length-1)*chartW,y=(v:number)=>top+chartH-v/max*chartH;
 const base=data.map((_,i)=>({x:x(i),y:y(0)})); const aTop=data.map((d,i)=>({x:x(i),y:y(d.a)})); const bTop=data.map((d,i)=>({x:x(i),y:y(d.a+d.b)})); const cTop=data.map((d,i)=>({x:x(i),y:y(d.a+d.b+d.c)}));
 return <Frame><SceneHeader eyebrow={eyebrow} title={title}/><div className="mt-3 flex gap-5 text-[18px]"><span className="bg-yellow px-3 py-2 border-2 border-ink">{labels[0]}</span><span className="bg-ink text-white px-3 py-2 border-2 border-ink">{labels[1]}</span><span className="bg-soft px-3 py-2 border-2 border-ink">{labels[2]}</span></div><svg width={width} height={height} className="mt-3"><defs><clipPath id="stacked-reveal"><rect x={left} y={0} width={chartW*p} height={height}/></clipPath></defs><g clipPath="url(#stacked-reveal)"><polygon points={polygon(aTop,base)} fill={VIZ.yellow} stroke={VIZ.ink} strokeWidth={2}/><polygon points={polygon(bTop,aTop)} fill={VIZ.ink}/><polygon points={polygon(cTop,bTop)} fill={VIZ.soft} stroke={VIZ.ink} strokeWidth={2}/></g>{data.map((d,i)=><text key={d.label} x={x(i)} y={height-28} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={18} fill={VIZ.muted}>{d.label}</text>)}</svg></Frame>
};
