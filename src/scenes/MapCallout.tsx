import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import {Frame} from "../components/Frame";
import {SceneHeader} from "../components/SceneHeader";

type Props = {
  publicPath?: string;
  x?: number;
  y?: number;
  label?: string;
};

export const MapCallout: React.FC<Props> = ({
  publicPath,
  x = 76,
  y = 43,
  label = "TOKYO",
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(
    frame,
    [20, 35],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Frame>
      <SceneHeader
        eyebrow="GEOGRAPHY"
        title="The growth is concentrated here."
      />

      <div className="relative mt-10 h-[650px] overflow-hidden border-2 border-ink bg-white">

        {publicPath ? (
          <Img
            src={staticFile(publicPath)}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="
            flex h-full items-center justify-center
            text-[32px] text-muted
          ">
            MAP SVG / PNG
          </div>
        )}

        <div
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            opacity: p,
          }}
        >
          <div
            className="
              h-[32px] w-[32px]
              -translate-x-1/2
              -translate-y-1/2
              border-[5px] border-ink
              bg-yellow
            "
          />

          <div className="
            mt-3
            whitespace-nowrap
            border-2 border-ink
            bg-yellow
            px-4 py-2
            text-[22px]
            font-semibold
          ">
            {label}
          </div>
        </div>

      </div>
    </Frame>
  );
};