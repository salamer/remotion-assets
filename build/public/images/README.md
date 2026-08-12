# 图片资源目录

把静态资源放在 `public/` 下，Remotion 通过 `staticFile()` 加载。

## 目录说明

| 目录 | 用途 | 对应场景 |
|------|------|----------|
| `maps/` | 地图 PNG/SVG | `MapCallout` |
| `screenshots/` | 年报、界面截图 | `ScreenshotZoom` |
| `photos/` | 人物、产品照片 | `ImageCard` |
| `logos/` | 品牌 Logo | `LogoCloud`（未来可接图片） |

## 使用步骤

1. 将文件放入对应子目录，例如 `public/images/maps/world.png`
2. 在 `src/assets/index.ts` 的 `images` 注册表中登记：

```ts
maps: {
  world: "images/maps/world.png",
},
```

3. 在场景中使用：

```tsx
<MapCallout src="world" label="TOKYO" />
```

或直接传路径（无需注册）：

```tsx
<MapCallout src="images/maps/world.png" />
```

## 命名建议

- 小写 + 连字符：`annual-report-2024.png`
- 优先 PNG/WebP；地图可用 SVG
- 视频分辨率 1920×1080，图片宽度建议 ≥ 1920px
