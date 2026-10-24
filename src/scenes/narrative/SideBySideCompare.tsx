import React from "react";
import { useCurrentFrame } from "remotion";

import { Frame } from "../../components/Frame";
import { BrutalCard } from "../../components/BrutalCard";
import { fadeUp } from "../../lib/motion";

type Company = {
  icon: string;
  name: string;
  value: string;
  subtitle: string;
};

const companies: Company[] = [
  {
    icon: "🏠",
    name: "AIRBNB",
    value: "$11.1B",
    subtitle: "Revenue",
  },
  {
    icon: "🏨",
    name: "MARRIOTT",
    value: "$25.1B",
    subtitle: "Revenue",
  },
];

const LEGACY_DEFAULT_companies = companies;

export const SideBySideCompare: React.FC<{
  companies?: typeof LEGACY_DEFAULT_companies;
}> = ({ companies = LEGACY_DEFAULT_companies }) => {
  const frame = useCurrentFrame();

  return (
    <Frame>
      <div className="text-[30px] text-muted" style={fadeUp(frame, 0)}>
        REVENUE / FY2025
      </div>

      <div
        className="
          mt-8
          text-[64px]
          font-semibold
          tracking-[-0.05em]
        "
        style={fadeUp(frame, 4)}
      >
        Same travel market.
        <br />
        Very different machines.
      </div>

      <div className="mt-16 grid grid-cols-2 gap-12">
        {companies.map((company, index) => (
          <div key={company.name} style={fadeUp(frame, 12 + index * 8)}>
            <BrutalCard yellow={index === 0} className="p-10">
              <div className="text-[72px]">{company.icon}</div>

              <div
                className="
                mt-5
                text-[30px]
                font-semibold
              "
              >
                {company.name}
              </div>

              <div
                className="
                mt-16
                text-[88px]
                font-semibold
                tracking-[-0.06em]
              "
              >
                {company.value}
              </div>

              <div
                className="
                mt-3
                text-[24px]
                text-muted
              "
              >
                {company.subtitle}
              </div>
            </BrutalCard>
          </div>
        ))}
      </div>
    </Frame>
  );
};
