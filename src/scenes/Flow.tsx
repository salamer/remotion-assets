import React from "react";
import {useCurrentFrame} from "remotion";

import {Frame} from "../components/Frame";
import {BrutalCard} from "../components/BrutalCard";
import {fadeUp} from "../lib/motion";

const Node = ({
  emoji,
  title,
  subtitle,
  yellow = false,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  yellow?: boolean;
}) => {
  return (
    <BrutalCard
      yellow={yellow}
      className="
        w-[380px]
        p-8
        text-center
      "
    >
      <div className="text-[72px]">
        {emoji}
      </div>

      <div className="
        mt-4
        text-[30px]
        font-semibold
      ">
        {title}
      </div>

      <div className="
        mt-2
        text-[22px]
        text-muted
      ">
        {subtitle}
      </div>
    </BrutalCard>
  );
};

export const Flow: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Frame>

      <div style={fadeUp(frame, 0)}>
        <div className="
          text-[28px]
          text-muted
        ">
          BUSINESS MODEL
        </div>

        <div className="
          mt-3
          text-[64px]
          font-semibold
        ">
          Airbnb sits in the middle.
        </div>
      </div>

      <div
        className="
          mt-36
          flex
          items-center
          justify-between
        "
      >

        <div style={fadeUp(frame, 10)}>
          <Node
            emoji="🧳"
            title="GUEST"
            subtitle="Pays $100"
          />
        </div>

        <div
          className="
            text-[70px]
            font-semibold
          "
          style={fadeUp(frame, 20)}
        >
          →
        </div>

        <div style={fadeUp(frame, 25)}>
          <Node
            emoji="🏠"
            title="AIRBNB"
            subtitle="Keeps fee"
            yellow
          />
        </div>

        <div
          className="
            text-[70px]
            font-semibold
          "
          style={fadeUp(frame, 35)}
        >
          →
        </div>

        <div style={fadeUp(frame, 40)}>
          <Node
            emoji="👤"
            title="HOST"
            subtitle="Receives remainder"
          />
        </div>

      </div>

      <div
        className="mt-20 text-center"
        style={fadeUp(frame, 55)}
      >
        <span className="
          bg-yellow
          px-5 py-3
          text-[32px]
          font-semibold
          border-2 border-ink
        ">
          NO HOTEL OWNERSHIP REQUIRED
        </span>
      </div>

    </Frame>
  );
};