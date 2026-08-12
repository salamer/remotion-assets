import React from "react";
import {useCurrentFrame} from "remotion";

import {Frame} from "../../components/Frame";
import {fadeUp} from "../../lib/motion";
import {Tag} from "../../components/Tag";

type Props = {
  quote?: string;
  author?: string;
  role?: string;
};

export const QuoteCard: React.FC<Props> = ({
  quote =
    "We believe travel is fundamentally changing.",
  author = "BRIAN CHESKY",
  role = "CEO / AIRBNB",
}) => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <div
        className="mt-8"
        style={fadeUp(frame, 0)}
      >
        <Tag yellow>QUOTE</Tag>
      </div>

      <div
        className="
          mt-24
          max-w-[1550px]
          text-[76px]
          font-semibold
          leading-[1.15]
          tracking-[-0.045em]
        "
        style={fadeUp(frame, 8)}
      >
        “{quote}”
      </div>

      <div
        className="mt-16 border-l-[8px] border-yellow pl-8"
        style={fadeUp(frame, 25)}
      >
        <div className="text-[30px] font-semibold">
          {author}
        </div>

        <div className="mt-2 text-[22px] text-muted">
          {role}
        </div>
      </div>
    </Frame>
  );
};