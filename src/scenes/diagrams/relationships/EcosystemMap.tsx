import React from "react";
import {useCurrentFrame,useVideoConfig} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {springIn,stagger} from "../../../lib/chartMotion";
import {VIZ} from "../../../components/viz/chartPrimitives";

type Node={label:string;icon?:string;role?:string};
const DEFAULT:Node[]=[
  {label:"CUSTOMERS",icon:"👤",role:"Demand"},
  {label:"SUPPLIERS",icon:"🏭",role:"Inputs"},
  {label:"PARTNERS",icon:"🤝",role:"Distribution"},
  {label:"DEVELOPERS",icon:"💻",role:"Complementors"},
  {label:"CAPITAL",icon:"💰",role:"Funding"},
];

export const EcosystemMap:React.FC<{eyebrow?:string;title?:string;hub?:Node;nodes?:Node[]}> =({eyebrow="ECOSYSTEM",title="One platform coordinates many sides of the market.",hub={label:"PLATFORM",icon:"⚙️",role:"Coordinator"},nodes=DEFAULT})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const cx=840,cy=330,r=290;
  const hubP=springIn({frame,fps,delay:4});
  return <Frame>
    <SceneHeader eyebrow={eyebrow} title={title}/>
    <div className="relative mt-8 h-[650px]">
      <svg className="absolute inset-0" width={1680} height={650}>
        {nodes.map((n,i)=>{
          const a=(-Math.PI/2)+(i/nodes.length)*Math.PI*2;
          const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
          const p=stagger(frame,i,18,5,18);
          return <g key={n.label} opacity={p}>
            <line x1={cx} y1={cy} x2={cx+(x-cx)*p} y2={cy+(y-cy)*p} stroke={i===2?VIZ.yellow:VIZ.ink} strokeWidth={i===2?18:4} strokeOpacity={i===2?0.9:0.55}/>
          </g>
        })}
      </svg>
      <div className="absolute flex h-[180px] w-[260px] items-center justify-center border-2 border-ink bg-yellow" style={{left:cx,top:cy,transform:`translate(-50%,-50%) scale(${0.85+0.15*hubP})`,boxShadow:"7px 7px 0 #111"}}>
        <div className="text-center"><div className="text-[58px]">{hub.icon}</div><div className="text-[27px] font-semibold">{hub.label}</div><div className="text-[18px]">{hub.role}</div></div>
      </div>
      {nodes.map((n,i)=>{
        const a=(-Math.PI/2)+(i/nodes.length)*Math.PI*2;
        const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
        const p=stagger(frame,i,14,5,18);
        return <div key={n.label} className="absolute flex h-[130px] w-[220px] items-center justify-center border-2 border-ink bg-white" style={{left:x,top:y,transform:`translate(-50%,-50%) scale(${0.88+0.12*p})`,opacity:p,boxShadow:"5px 5px 0 #111"}}>
          <div className="text-center"><div className="text-[40px]">{n.icon}</div><div className="text-[21px] font-semibold">{n.label}</div><div className="text-[16px] text-muted">{n.role}</div></div>
        </div>
      })}
    </div>
  </Frame>
};
