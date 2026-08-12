import React from "react";
import {Img, interpolate, useCurrentFrame} from "remotion";

import {
  getImageSrc,
  type ImageCategory,
} from "../../assets";
import {Frame} from "../../components/Frame";
import {SceneHeader} from "../../components/SceneHeader";

type Props = {
  /**
   * 图片引用：注册表 key（配合 category）或 public 相对路径
   * 例：`world` + category `maps`，或 `images/maps/world.png`
   */
  src?: string;
  category?: ImageCategory;
  /** @deprecated 使用 src */
  publicPath?: string;
  /** 无图片时显示的 emoji 占位 */
  emoji?: string;
  x?: number;
  y?: number;
  label?: string;
};

export const MapCallout: React.FC<Props> = ({
  src,
  category = "maps",
  publicPath,
  emoji = "🌍",
  x = 76,
  y = 43,
  label = "TOKYO",
}) => {
  const frame = useCurrentFrame();
  const imageRef = src ?? publicPath;

  const p = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Frame>
      <SceneHeader
        eyebrow="GEOGRAPHY"
        title="The growth is concentrated here."
      />

      <div className="relative mt-10 h-[650px] overflow-hidden border-2 border-ink bg-white">
        {imageRef ? (
          <Img
            src={getImageSrc(imageRef, category)}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[200px]">
            {emoji}
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
              -translate-x-1/2 -translate-y-1/2
              border-[5px] border-ink bg-yellow
            "
          />

          <div
            className="
              mt-3 whitespace-nowrap
              border-2 border-ink bg-yellow
              px-4 py-2 text-[22px] font-semibold
            "
          >
            {label}
          </div>
        </div>
      </div>
    </Frame>
  );
};
