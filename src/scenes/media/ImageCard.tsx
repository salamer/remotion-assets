import React from "react";
import {Img, useCurrentFrame} from "remotion";

import {
  getImageSrc,
  type ImageCategory,
} from "../../assets";
import {Frame} from "../../components/Frame";
import {BrutalCard} from "../../components/BrutalCard";
import {SceneHeader} from "../../components/SceneHeader";
import {fadeUp} from "../../lib/motion";

type Props = {
  /** 注册表 key 或 public 相对路径 */
  src?: string;
  category?: ImageCategory;
  /** @deprecated 使用 src */
  publicPath?: string;
  title?: string;
  subtitle?: string;
  emoji?: string;
};

export const ImageCard: React.FC<Props> = ({
  src,
  category = "photos",
  publicPath,
  title = "BRIAN CHESKY",
  subtitle = "Co-founder & CEO / Airbnb",
  emoji = "👤",
}) => {
  const frame = useCurrentFrame();
  const imageRef = src ?? publicPath;

  return (
    <Frame>
      <SceneHeader
        eyebrow="PEOPLE"
        title="The founder still runs the company."
      />

      <div className="mt-14 w-[900px]" style={fadeUp(frame, 12)}>
        <BrutalCard className="overflow-hidden">
          <div className="h-[500px] overflow-hidden bg-soft">
            {imageRef ? (
              <Img
                src={getImageSrc(imageRef, category)}
                className="h-full w-full object-cover"
                style={{
                  transform: `scale(${1.05 - Math.min(frame, 80) / 1600})`,
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[150px]">
                {emoji}
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="text-[32px] font-semibold">{title}</div>

            <div className="mt-2 text-[22px] text-muted">{subtitle}</div>
          </div>
        </BrutalCard>
      </div>
    </Frame>
  );
};
