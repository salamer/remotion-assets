import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { reveal } from "../../../lib/motion";

export const PictogramChart: React.FC<{
  total?: number;
  highlighted?: number;
  icon?: string;
}> = ({ total = 50, highlighted = 12, icon = "👤" }) => {
  const frame = useCurrentFrame(),
    lit = Math.round(highlighted * reveal(frame, 12, 35));
  return (
    <Frame>
      <SceneHeader
        eyebrow="PEOPLE BEHIND THE NUMBER"
        title={`${highlighted} out of ${total}.`}
      />
      <div className="mt-20 grid grid-cols-10 gap-x-8 gap-y-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="text-center text-[54px]"
            style={{
              opacity: i < lit ? 1 : 0.18,
              transform: `scale(${i < lit ? 1 : 0.9})`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </Frame>
  );
};
