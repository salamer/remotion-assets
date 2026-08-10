import React from "react";
import {AbsoluteFill} from "remotion";
import {MONO_FONT} from "../fonts";

type Props = {
  children: React.ReactNode;
};

export const Frame: React.FC<Props> = ({
  children,
}) => {
  return (
    <AbsoluteFill
      className="bg-paper text-ink"
      style={{
        fontFamily: MONO_FONT,
        padding: 64,

        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.025) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(0,0,0,0.025) 1px,
            transparent 1px
          )
        `,

        backgroundSize: "48px 48px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};