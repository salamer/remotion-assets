import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";

type Candle = {
  open: number;
  close: number;
  high: number;
  low: number;
};

const data: Candle[] = [
  {
    open: 100,
    close: 112,
    high: 118,
    low: 95,
  },
  {
    open: 112,
    close: 108,
    high: 121,
    low: 104,
  },
  {
    open: 108,
    close: 125,
    high: 129,
    low: 105,
  },
  {
    open: 125,
    close: 138,
    high: 144,
    low: 121,
  },
  {
    open: 138,
    close: 132,
    high: 146,
    low: 128,
  },
];

const LEGACY_DEFAULT_data = data;

export const CandlestickChart: React.FC<{
  data?: typeof LEGACY_DEFAULT_data;
  title?: string;
  eyebrow?: string;
}> = ({
  data = LEGACY_DEFAULT_data,
  title = "Investors repriced Airbnb through the cycle.",
  eyebrow = "ABNB STOCK",
}) => {
  const frame = useCurrentFrame();

  const minValue = Math.min(...data.map((c) => c.low));
  const maxValue = Math.max(...data.map((c) => c.high));
  const pad = Math.max(1, (maxValue - minValue) * 0.1);
  const min = minValue - pad;
  const max = maxValue + pad;

  const chartHeight = 500;

  const Y = (value: number) =>
    chartHeight - ((value - min) / (max - min)) * chartHeight;

  return (
    <Frame>
      <SceneHeader eyebrow={eyebrow} title={title} />

      <div className="mt-16 flex h-[520px] items-end justify-center gap-20 border-b-2 border-ink">
        {data.map((candle, index) => {
          const p = interpolate(
            frame,
            [10 + index * 7, 24 + index * 7],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );

          const rising = candle.close >= candle.open;

          const top = Y(Math.max(candle.open, candle.close));

          const bottom = Y(Math.min(candle.open, candle.close));

          const bodyHeight = Math.abs(bottom - top);

          return (
            <div
              key={index}
              className="relative h-[500px] w-[60px]"
              style={{
                opacity: p,
              }}
            >
              <div
                className="absolute left-1/2 w-[4px] -translate-x-1/2 bg-ink"
                style={{
                  top: Y(candle.high),
                  height: Y(candle.low) - Y(candle.high),
                }}
              />

              <div
                className={`
                  absolute
                  left-0
                  w-full
                  border-2 border-ink
                  ${rising ? "bg-yellow" : "bg-white"}
                `}
                style={{
                  top,
                  height: Math.max(8, bodyHeight),
                }}
              />
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
