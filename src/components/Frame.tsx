import React from "react";
import { AbsoluteFill } from "remotion";

import { MONO_FONT } from "../style/fonts";
import { gridBackgroundImage, layout, spacing } from "../style/theme";

type Props = {
  children: React.ReactNode;
};

export const Frame: React.FC<Props> = ({ children }) => {
  return (
    <AbsoluteFill
      className="bg-paper text-ink"
      style={{
        fontFamily: MONO_FONT,
        padding: spacing.framePadding,
        backgroundImage: gridBackgroundImage(),
        backgroundSize: `${layout.gridSize}px ${layout.gridSize}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
