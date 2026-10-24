import React from "react";
import { useFonts } from "../style/fonts";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { BrandProvider, useBrand } from "../brand/BrandProvider";
import { SceneContent } from "../broadcast/SceneContent";
import { SceneFrame, signed, useSceneMotion } from "../broadcast/primitives";
import type { Episode as EpisodeData, Scene } from "./schema";
import { parseEpisode } from "./validate";
import { compileTimeline, captionAt } from "./timeline";
import { ALL_SHOWCASE_COMPOSITIONS } from "../showcase/compositions";

const SceneLayer: React.FC<{
  scene: Scene;
  episode: EpisodeData;
  index: number;
}> = ({ scene, episode, index }) => {
  const p = useSceneMotion()(0, 0.35);
  const { width } = useVideoConfig();
  const motion =
    scene.transition === "cut"
      ? {}
      : {
          opacity: p,
          transform:
            scene.transition === "slide"
              ? `translateX(${(1 - p) * width * 0.035}px)`
              : undefined,
        };
  if (scene.type === "legacy") {
    const entry = ALL_SHOWCASE_COMPOSITIONS.find(
      (x) => x.id === scene.component,
    );
    if (!entry) throw new Error(`Unknown legacy component: ${scene.component}`);
    const Component = entry.component;
    return (
      <AbsoluteFill style={motion}>
        <>
          <Component {...scene.props} />
        </>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={motion}>
      <>
        <SceneFrame
          scene={scene}
          episode={episode}
          index={index}
          hero={scene.type === "opener"}
        >
          <SceneContent scene={scene} episode={episode} />
        </SceneFrame>
      </>
    </AbsoluteFill>
  );
};

const BroadcastOverlays: React.FC<{ episode: EpisodeData }> = ({
  episode: e,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const { tokens: t, brand } = useBrand();
  const c = t.colors;
  const caption = captionAt(e, frame);
  const ticker = e.ticker || [];
  const tickerWidths = ticker.map((item) =>
    Math.max(
      360,
      [
        item.label,
        item.value,
        item.change !== undefined ? signed(item.change) : "",
      ].join(" ").length *
        22 +
        80,
    ),
  );
  const period = tickerWidths.reduce((n, w) => n + w, 0);
  const copies = period ? Math.ceil(width / period) + 2 : 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 4,
          width: `${((frame + 1) / durationInFrames) * 100}%`,
          background: c.accent,
          zIndex: 10,
        }}
      />
      {brand.logo && (
        <Img
          src={staticFile(brand.logo)}
          style={{
            position: "absolute",
            right: 72,
            top: 123,
            width: 110,
            height: 45,
            objectFit: "contain",
            opacity: 0.8,
          }}
        />
      )}
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: e.ticker?.length ? 85 : 35,
            left: "8%",
            width: "84%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: c.foreground,
              color: c.background,
              padding: "12px 24px",
              fontSize: 28,
              lineHeight: 1.5,
              textAlign: "center",
              whiteSpace: "pre-line",
              borderRadius: 8,
              maxWidth: "100%",
            }}
          >
            {caption.text}
          </div>
        </div>
      )}
      {ticker.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            height: 62,
            left: 0,
            right: 0,
            background: c.surface,
            borderTop: `1px solid ${c.line}`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              transform: `translateX(-${((frame / e.fps) * 45) % period}px)`,
            }}
          >
            {Array.from({ length: copies }, (_, copy) =>
              ticker.map((item, i) => (
                <span
                  key={`${copy}-${i}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0 28px",
                    gap: 18,
                    flex: `0 0 ${tickerWidths[i]}px`,
                    fontSize: 21,
                    borderRight: `1px solid ${c.line}`,
                  }}
                >
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                  {item.change !== undefined && (
                    <span
                      style={{
                        color:
                          item.change > 0
                            ? c.positive
                            : item.change < 0
                              ? c.negative
                              : c.muted,
                      }}
                    >
                      {signed(item.change)}
                    </span>
                  )}
                </span>
              )),
            )}
          </div>
        </div>
      )}
    </>
  );
};

export type EpisodeProps = { episode: EpisodeData };
export const FinanceEpisode: React.FC<EpisodeProps> = ({ episode: input }) => {
  useFonts();
  const episode = React.useMemo(() => parseEpisode(input), [input]);
  return (
    <BrandProvider brand={episode.brand}>
      {compileTimeline(episode).map(({ scene, from, durationInFrames }, i) => (
        <Sequence
          key={scene.id}
          name={scene.title}
          from={from}
          durationInFrames={durationInFrames}
        >
          <SceneLayer scene={scene} episode={episode} index={i} />
        </Sequence>
      ))}
      <BroadcastOverlays episode={episode} />
      {episode.audio?.voiceover && (
        <Audio
          src={staticFile(episode.audio.voiceover)}
          volume={() => episode.audio!.voiceVolume}
        />
      )}
      {episode.audio?.music && (
        <Audio
          src={staticFile(episode.audio.music)}
          loop
          volume={(frame) => {
            const total = compileTimeline(episode).reduce(
              (n, s) => n + s.durationInFrames,
              0,
            );
            const fade = Math.min(
              1,
              frame / episode.fps,
              (total - frame) / episode.fps,
            );
            return episode.audio!.musicVolume * Math.max(0, fade);
          }}
        />
      )}
    </BrandProvider>
  );
};
