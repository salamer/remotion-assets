import React from "react";
import {useCurrentFrame} from "remotion";

import {fadeUp} from "../lib/motion";
import {textClasses} from "../style/theme";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export const SceneHeader: React.FC<Props> = ({
  eyebrow,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  return (
    <div>
      {eyebrow && (
        <div
          className={textClasses.eyebrow}
          style={fadeUp(frame, 0)}
        >
          {eyebrow}
        </div>
      )}

      <div
        className={`mt-3 max-w-[1500px] ${textClasses.title}`}
        style={fadeUp(frame, 4)}
      >
        {title}
      </div>

      {subtitle && (
        <div
          className={`mt-4 max-w-[1300px] ${textClasses.subtitle}`}
          style={fadeUp(frame, 10)}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
