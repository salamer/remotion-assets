import { staticFile } from "remotion";

/**
 * Assets 资源管理
 *
 * 目录结构（均在 public/ 下）：
 *
 *   public/
 *   ├── fonts/                 字体（已由 fonts.ts 加载）
 *   └── images/
 *       ├── maps/              地图 PNG/SVG
 *       ├── screenshots/       年报、界面截图
 *       ├── photos/            人物、产品照片
 *       └── logos/             品牌 logo
 *
 * 使用方式：
 * 1. 把文件放进对应目录
 * 2. 在下方 images 中注册 key
 * 3. 场景里用 src="maps.world" 或 getImageSrc("maps/world.png")
 */

// ---------------------------------------------------------------------------
// 路径常量
// ---------------------------------------------------------------------------

export const assetDirs = {
  fonts: "fonts",
  images: "images",
  maps: "images/maps",
  screenshots: "images/screenshots",
  photos: "images/photos",
  logos: "images/logos",
} as const;

export type ImageCategory = "maps" | "screenshots" | "photos" | "logos";

// ---------------------------------------------------------------------------
// 字体文件（供 style/fonts.ts 使用）
// ---------------------------------------------------------------------------

export const fontPaths = {
  monoRegular: staticFile(`${assetDirs.fonts}/IBMPlexMono-Regular.woff2`),
  monoSemiBold: staticFile(`${assetDirs.fonts}/IBMPlexMono-SemiBold.woff2`),
} as const;

// ---------------------------------------------------------------------------
// 图片注册表 — 添加资源时在此登记
// ---------------------------------------------------------------------------

/**
 * 按分类注册图片。key 为简短标识，值为 public 下的相对路径（不含 public/）
 *
 * 示例：
 *   maps: { world: "images/maps/world.png" }
 *   使用时：getImageSrc("world", "maps")
 */
export const images: Record<ImageCategory, Record<string, string>> = {
  maps: {
    // world: "images/maps/world.png",
  },
  screenshots: {
    // annualReport: "images/screenshots/annual-report.png",
  },
  photos: {
    // chesky: "images/photos/brian-chesky.jpg",
  },
  logos: {
    // airbnb: "images/logos/airbnb.svg",
  },
};

// ---------------------------------------------------------------------------
// 解析函数
// ---------------------------------------------------------------------------

/**
 * 将资源引用解析为 Remotion staticFile URL
 *
 * @param ref - 注册表 key，或相对于 public/ 的路径（如 images/maps/world.png）
 * @param category - 若提供，优先在 images[category] 中查找 key
 */
export function getImageSrc(ref: string, category?: ImageCategory): string {
  if (category) {
    const registered = images[category][ref];
    if (registered) {
      return staticFile(registered);
    }
  }

  // 已是完整 public 相对路径
  if (ref.includes("/")) {
    return staticFile(ref);
  }

  // 默认当作 images/ 下的文件名
  return staticFile(`${assetDirs.images}/${ref}`);
}

/** 任意 public 相对路径 → staticFile URL */
export function assetUrl(publicPath: string): string {
  return staticFile(publicPath);
}
