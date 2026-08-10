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
  focusX?: number;
  focusY?: number;
};

export const ScreenshotZoom: React.FC<Props> = ({
  publicPath,
  focusX = 65,
  focusY = 55,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [20, 70],
    [1, 2.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Frame>
      <SceneHeader
        eyebrow="ANNUAL REPORT"
        title="The answer is buried in the filing."
      />

      <div
        className="
          mt-10
          h-[650px]
          overflow-hidden
          border-2 border-ink
          bg-white
        "
        style={{
          boxShadow: "6px 6px 0 #111",
        }}
      >

        {publicPath ? (
          <Img
            src={staticFile(publicPath)}
            className="h-full w-full object-contain"
            style={{
              transformOrigin:
                `${focusX}% ${focusY}%`,
              transform:
                `scale(${scale})`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[32px] text-muted">
            DROP SCREENSHOT INTO PUBLIC/
          </div>
        )}

      </div>
    </Frame>
  );
};