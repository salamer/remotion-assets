import React from "react";
import {useCurrentFrame} from "remotion";
import {fadeUp} from "../lib/motion";

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
          className="text-[26px] tracking-[0.12em] text-muted"
          style={fadeUp(frame, 0)}
        >
          {eyebrow}
        </div>
      )}

      <div
        className="mt-3 max-w-[1500px] text-[62px] font-semibold leading-[1.05] tracking-[-0.05em]"
        style={fadeUp(frame, 4)}
      >
        {title}
      </div>

      {subtitle && (
        <div
          className="mt-4 max-w-[1300px] text-[26px] leading-[1.4] text-muted"
          style={fadeUp(frame, 10)}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};