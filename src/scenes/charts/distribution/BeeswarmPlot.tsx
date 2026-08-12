import React from "react";
import {useCurrentFrame} from "remotion";
import {Frame} from "../../../components/Frame";
import {SceneHeader} from "../../../components/SceneHeader";
import {palette,reveal} from "../../../lib/motion";

const values=[12,14,17,19,22,23,24,26,27,29,31,31,33,34,35,36,38,39,41,42,44,46,48,52,58,65,71,84];

export const BeeswarmPlot:React.FC=()=>{
 const frame=useCurrentFrame();
 return <Frame><SceneHeader eyebrow="DISTRIBUTION" title="The average hides the shape."/>
 <div className="relative mt-24 h-[430px] border-b-2 border-ink">
  {values.map((v,i)=>{const p=reveal(frame,8+i*1.5,12),row=i%5,y=250-row*42+((i%2)*18);return <div key={i} className="absolute h-[24px] w-[24px] rounded-full border-2 border-ink" style={{left:`${v}%`,top:y,background:v>60?palette.yellow:palette.white,transform:`translate(-50%,-50%) scale(${p})`,opacity:p}}/>})}
  <div className="absolute bottom-[-42px] left-0 text-[18px] text-muted">LOW</div><div className="absolute bottom-[-42px] right-0 text-[18px] text-muted">HIGH</div>
 </div></Frame>
};
