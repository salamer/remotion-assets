import {Easing, interpolate} from "remotion";

const easeOut = Easing.out(Easing.cubic);

export const progress = (
  frame: number,
  delay = 0,
  duration = 12,
) =>
  interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

export const fadeUp = (
  frame: number,
  delay = 0,
  distance = 18,
) => {
  const p = progress(frame, delay);

  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
  };
};

export const fadeLeft = (
  frame: number,
  delay = 0,
  distance = 22,
) => {
  const p = progress(frame, delay);

  return {
    opacity: p,
    transform: `translateX(${(1 - p) * distance}px)`,
  };
};

export const grow = (frame: number, delay = 0, duration = 18) => {
  return progress(frame, delay, duration);
};

export const scaleIn = (frame: number, delay = 0) => {
  const p = progress(frame, delay);

  return {
    opacity: p,
    transform: `scale(${0.94 + p * 0.06})`,
  };
};

export const highlight = (
  frame: number,
  delay = 0,
  duration = 20,
) => {
  const p = progress(frame, delay, duration);

  return {
    backgroundSize: `${p * 100}% 100%`,
  };
};
