import React from "react";
import {useCurrentFrame} from "remotion";
import {fadeUp} from "../lib/motion";

export const Source: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const frame = useCurrentFrame();

  return (
    <div
      className="absolute bottom-[50px] left-[64px] text-[19px] tracking-[0.08em] text-muted"
      style={fadeUp(frame, 45)}
    >
      SOURCE / {children}
    </div>
  );
};