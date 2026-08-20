import React from "react";
import { useCurrentFrame } from "remotion";

import { fadeUp } from "../lib/motion";
import { spacing, textClasses } from "../style/theme";

export const Source: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();

  return (
    <div
      className={`absolute text-muted ${textClasses.source}`}
      style={{
        ...fadeUp(frame, 45),
        bottom: spacing.sourceBottom,
        left: spacing.framePadding,
      }}
    >
      SOURCE / {children}
    </div>
  );
};
