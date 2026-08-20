/**
 * Core motion helpers — fade / slide / spring / reveal / count.
 * Deterministic frame-driven animation only (no CSS transitions).
 */
import { Easing, interpolate, spring } from "remotion";
import { animation } from "../style/theme";

export const tween = (
  frame: number,
  start = 0,
  duration = 15,
  easing = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Alias used by former editorial scenes */
export const reveal = tween;

export const progress = (
  frame: number,
  delay = 0,
  duration = animation.entranceFrames,
) => tween(frame, delay, duration);

export const fadeUp = (frame: number, delay = 0, distance = 18) => {
  const p = progress(frame, delay);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

export const fadeLeft = (frame: number, delay = 0, distance = 22) => {
  const p = progress(frame, delay);
  return {
    opacity: p,
    transform: `translateX(${(1 - p) * distance}px)`,
  };
};

export const grow = (
  frame: number,
  delay = 0,
  duration = animation.chartGrowFrames,
) => progress(frame, delay, duration);

export const scaleIn = (frame: number, delay = 0) => {
  const p = progress(frame, delay);
  return {
    opacity: p,
    transform: `scale(${0.94 + p * 0.06})`,
  };
};

export const highlight = (frame: number, delay = 0, duration = 20) => {
  const p = progress(frame, delay, duration);
  return { backgroundSize: `${p * 100}% 100%` };
};

export const springIn = ({
  frame,
  fps,
  delay = 0,
  damping = 17,
  stiffness = 145,
  mass = 0.8,
}: {
  frame: number;
  fps: number;
  delay?: number;
  damping?: number;
  stiffness?: number;
  mass?: number;
}) =>
  spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping, stiffness, mass },
  });

export const floatY = (frame: number, amplitude = 5, period = 110, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amplitude;

export const floatX = (frame: number, amplitude = 4, period = 130, phase = 0) =>
  Math.cos(((frame + phase) / period) * Math.PI * 2) * amplitude;

export const countTo = (
  frame: number,
  value: number,
  start = 0,
  duration = 30,
) => value * tween(frame, start, duration);

export const slideUpStyle = (frame: number, start = 0, distance = 18) => {
  const p = reveal(frame, start);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

export const count = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number,
) =>
  interpolate(frame, [start, start + duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/** Shared ink palette for scenes that previously used editorialViz.palette */
export const palette = {
  paper: "#FAFAF7",
  ink: "#111111",
  yellow: "#FFD43B",
  muted: "#737373",
  soft: "#ECECE7",
  soft2: "#E1E1DB",
  white: "#FFFFFF",
} as const;
