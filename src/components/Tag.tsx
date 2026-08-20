import React from "react";

type Props = {
  children: React.ReactNode;
  yellow?: boolean;
};

export const Tag: React.FC<Props> = ({ children, yellow = false }) => {
  return (
    <span
      className={`
        inline-block
        border-2 border-ink
        px-4 py-2
        text-[22px]
        font-semibold
        ${yellow ? "bg-yellow" : "bg-white"}
      `}
    >
      {children}
    </span>
  );
};
