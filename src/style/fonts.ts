import {loadFont} from "@remotion/fonts";

import {fontPaths} from "../assets";
import {typography} from "./theme";

/**
 * 加载 IBM Plex Mono（Regular + SemiBold）
 * 在 Frame 首次渲染前执行；index.ts 也会提前 import 本文件
 */
export const MONO_FONT = typography.fontFamily;

loadFont({
  family: MONO_FONT,
  url: fontPaths.monoRegular,
  weight: "400",
  format: "woff2",
});

loadFont({
  family: MONO_FONT,
  url: fontPaths.monoSemiBold,
  weight: "600",
  format: "woff2",
});
