import React from "react";

import {shadows} from "../style/theme";

type Props = {
  children: React.ReactNode;
  yellow?: boolean;
  className?: string;
};

export const BrutalCard: React.FC<Props> = ({
  children,
  yellow = false,
  className = "",
}) => {
  return (
    <div
      className={`
        border-2 border-ink
        ${yellow ? "bg-yellow" : "bg-white"}
        ${className}
      `}
      style={{
        boxShadow: shadows.brutal,
      }}
    >
      {children}
    </div>
  );
};
