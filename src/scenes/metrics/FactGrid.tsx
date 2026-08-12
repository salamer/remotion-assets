import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../components/Frame";
import {BrutalCard} from "../../components/BrutalCard";
import {Tag} from "../../components/Tag";
import {slideUpStyle} from "../../lib/motion";

const facts=[
["MARKET SIZE","$480B","2025 estimate"],["5Y CAGR","8.4%","2020–2025"],
["TOP 3 SHARE","63%","Highly concentrated"],["LEADER","Company A","Largest by revenue"],
];

export const FactGrid:React.FC=()=>{
 const frame=useCurrentFrame();
 return <Frame>
  <div style={slideUpStyle(frame,0)}><Tag yellow>FACT BOX</Tag></div>
  <div className="mt-8 text-[72px] font-semibold tracking-[-0.05em]">THE MARKET IN 30 SECONDS</div>
  <div className="mt-14 grid grid-cols-2 gap-8">
   {facts.map((f,i)=><div key={f[0]} style={slideUpStyle(frame,10+i*6)}>
    <BrutalCard className="p-8">
     <div className="text-[20px] tracking-[0.08em] text-muted">{f[0]}</div>
     <div className="mt-5 text-[64px] font-semibold tracking-[-0.05em]">{f[1]}</div>
     <div className="mt-3 text-[20px] text-muted">{f[2]}</div>
    </BrutalCard>
   </div>)}
  </div>
 </Frame>
};
