/** 视频全局参数 — 尺寸与 theme.layout 保持一致 */
import {layout} from "./style/theme";

export const VIDEO_WIDTH = layout.width;
export const VIDEO_HEIGHT = layout.height;
export const VIDEO_FPS = 30;
/** 标准场景默认时长（5s @ 30fps）；表达/结构可在 compositions.ts 覆盖 */
export const SCENE_DURATION = 150;
