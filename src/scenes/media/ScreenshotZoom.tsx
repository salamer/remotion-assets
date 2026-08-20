import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";

import { getImageSrc, type ImageCategory } from "../../assets";
import { Frame } from "../../components/Frame";
import { SceneHeader } from "../../components/SceneHeader";
import { shadows } from "../../style/theme";

type Props = {
  src?: string;
  category?: ImageCategory;
  /** @deprecated 使用 src */
  publicPath?: string;
  /** 无图片时显示的 emoji 占位 */
  emoji?: string;
  focusX?: number;
  focusY?: number;
};

export const ScreenshotZoom: React.FC<Props> = ({
  src,
  category = "screenshots",
  publicPath,
  emoji = "📊",
  focusX = 65,
  focusY = 55,
}) => {
  const frame = useCurrentFrame();
  const imageRef = src ?? publicPath;

  const scale = interpolate(frame, [20, 70], [1, 2.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Frame>
      <SceneHeader
        eyebrow="ANNUAL REPORT"
        title="The answer is buried in the filing."
      />

      <div
        className="mt-10 h-[650px] overflow-hidden border-2 border-ink bg-white"
        style={{ boxShadow: shadows.brutal }}
      >
        {imageRef ? (
          <Img
            src={getImageSrc(imageRef, category)}
            className="h-full w-full object-contain"
            style={{
              transformOrigin: `${focusX}% ${focusY}%`,
              transform: `scale(${scale})`,
            }}
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-[200px]"
            style={{
              transformOrigin: `${focusX}% ${focusY}%`,
              transform: `scale(${scale})`,
            }}
          >
            {emoji}
          </div>
        )}
      </div>
    </Frame>
  );
};
