import React from "react";

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
        boxShadow: "6px 6px 0 #111111",
      }}
    >
      {children}
    </div>
  );
};