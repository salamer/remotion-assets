/**
 * Chart motion helpers — stagger / clamp / path draw progress.
 */
import {tween} from "./motion";

export {tween, springIn, countTo} from "./motion";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** List items enter staggered by index */
export const stagger = (
  frame: number,
  index: number,
  start = 8,
  gap = 5,
  duration = 14,
) => tween(frame, start + index * gap, duration);
