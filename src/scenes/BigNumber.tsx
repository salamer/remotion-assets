import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {BrutalCard} from "../components/BrutalCard";
import {fadeUp} from "../lib/motion";

type Props = {
  company?: string;
  label?: string;
  value?: number;
  suffix?: string;
  growth?: number;
};

export const BigNumber: React.FC<Props> = ({
  company = "AIRBNB",
  label = "FY2025 REVENUE",
  value = 11.1,
  suffix = "B",
  growth = 12,
}) => {
  const frame = useCurrentFrame();

  const number = interpolate(
    frame,
    [10, 50],
    [0, value],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Frame>
      <div className="flex h-full flex-col justify-between">

        <div
          className="flex justify-between"
          style={fadeUp(frame, 0)}
        >
          <div className="text-[28px] font-semibold">
            {company}
          </div>

          <div className="
            border-2 border-ink
            bg-yellow
            px-5 py-2
            text-[22px]
            font-semibold
          ">
            2025
          </div>
        </div>

        <div>
          <div
            className="
              mb-4
              text-[28px]
              tracking-[0.12em]
              text-muted
            "
            style={fadeUp(frame, 5)}
          >
            {label}
          </div>

          <div
            className="
              text-[150px]
              font-semibold
              leading-none
              tracking-[-0.07em]
            "
            style={fadeUp(frame, 8)}
          >
            ${number.toFixed(1)}
            <span className="text-[80px]">
              {suffix}
            </span>
          </div>

          <div
            className="mt-8 flex items-center gap-5"
            style={fadeUp(frame, 28)}
          >
            <BrutalCard yellow>
              <div className="
                px-6 py-4
                text-[36px]
                font-semibold
              ">
                ▲ +{growth}%
              </div>
            </BrutalCard>

            <div className="text-[26px] text-muted">
              year over year
            </div>
          </div>
        </div>

        <div
          className="text-[22px] text-muted"
          style={fadeUp(frame, 40)}
        >
          SOURCE / COMPANY FILINGS
        </div>

      </div>
    </Frame>
  );
};