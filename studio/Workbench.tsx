import React, { useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { FinanceEpisode } from "../src/program/Episode";
import { dimensions, type Episode, type Scene } from "../src/program/schema";
import { brandSchema, type Brand } from "../src/brand/schema";
import { presets, presetLabels, resolveBrand } from "../src/brand/presets";
import { templateCatalog } from "../src/program/catalog";
import {
  durationInFrames,
  compileTimeline,
  retimeScenes,
} from "../src/program/timeline";
import { parseEpisode, validateEpisode } from "../src/program/validate";
import rawSample from "../examples/episode.json";
import rawGallery from "../examples/template-gallery.json";

const sample = parseEpisode(rawSample),
  gallery = parseEpisode(rawGallery);
const STORAGE = "finance-motion-v2";
function restore() {
  try {
    return parseEpisode(JSON.parse(localStorage.getItem(STORAGE) || "null"));
  } catch {
    return sample;
  }
}
function download(name: string, value: unknown) {
  const a = document.createElement("a");
  const u = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
function uniqueScene(scene: Scene, scenes: Scene[]) {
  let n = 1;
  while (scenes.some((x) => x.id === `${scene.type}-${n}`)) n++;
  return { ...scene, id: `${scene.type}-${n}` };
}

export const Workbench: React.FC = () => {
  const [episode, setEpisode] = useState<Episode>(restore);
  const [index, setIndex] = useState(0);
  const [whole, setWhole] = useState(false);
  const [tab, setTab] = useState<"brand" | "data" | "templates">("brand");
  const [editor, setEditor] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const player = useRef<PlayerRef>(null);
  const file = useRef<HTMLInputElement>(null);
  const active = episode.scenes[Math.min(index, episode.scenes.length - 1)];
  const tokens = resolveBrand(episode.brand);
  const preview = React.useMemo(
    () =>
      whole
        ? episode
        : { ...episode, scenes: [active], captions: [], audio: undefined },
    [episode, active, whole],
  );
  const issues = validateEpisode(episode).issues;
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(episode));
    } catch {
      setMessage("浏览器空间不足，请导出 JSON 保存。");
    }
  }, [episode]);
  useEffect(() => {
    if (tab === "data") setEditor(JSON.stringify(episode, null, 2));
  }, [tab, episode]);
  useEffect(() => {
    player.current?.seekTo(Math.min(50, durationInFrames(preview) - 1));
  }, [active.id, whole, preview]);
  const brand = (patch: Partial<Brand>) =>
    setEpisode((e) => ({
      ...e,
      brand: brandSchema.parse({ ...e.brand, ...patch }),
    }));
  const color = (key: string, value: string) =>
    brand({
      overrides: {
        ...episode.brand.overrides,
        colors: { ...episode.brand.overrides?.colors, [key]: value },
      },
    });
  const importFile = async (f: File) => {
    try {
      if (f.size > 2_000_000) throw new Error("文件超过 2 MB");
      const raw = JSON.parse(await f.text());
      if (raw.preset) {
        brand(brandSchema.parse(raw));
        setMessage("品牌样式已导入");
      } else {
        const next = parseEpisode(raw.episode || raw);
        setEpisode(next);
        setIndex(0);
        setMessage("分镜已导入");
      }
    } catch (err) {
      setMessage(String(err));
    }
  };
  const move = (delta: number) => {
    const next = index + delta;
    if (next < 0 || next >= episode.scenes.length) return;
    setEpisode((e) => {
      const scenes = [...e.scenes];
      [scenes[index], scenes[next]] = [scenes[next], scenes[index]];
      return retimeScenes(e, scenes);
    });
    setIndex(next);
    setMessage(
      episode.audio?.voiceover
        ? "字幕已随分镜调整；请重新核对旁白音轨，音频未自动剪辑。"
        : "字幕已随分镜调整。",
    );
  };
  const add = (type: Scene["type"]) => {
    const s = gallery.scenes.find((x) => x.type === type);
    if (!s) return;
    const next = uniqueScene(s, episode.scenes);
    setEpisode((e) => ({
      ...e,
      scenes: [...e.scenes, next],
      sources: e.sources.some((x) => x.id === "demo")
        ? e.sources
        : [...e.sources, ...gallery.sources],
    }));
    setIndex(episode.scenes.length);
    setMessage("已添加示例场景；发布前请替换演示数据与来源。");
  };
  const apply = () => {
    try {
      setEpisode(parseEpisode(JSON.parse(editor)));
      setIndex(0);
      setMessage("数据校验通过");
    } catch (err) {
      setMessage(String(err));
    }
  };
  const exportEpisode = () => {
    if (issues.some((x) => x.level === "error")) {
      setMessage("请先修复校验错误。");
      return;
    }
    download("episode.json", episode);
    setMessage("已导出 episode.json；使用 pnpm render 渲染视频。");
  };
  const sceneTitle = templateCatalog.find((x) => x.type === active.type)?.name;
  return (
    <div className="wb">
      <header className="wb-top">
        <a className="wb-logo" href="#">
          <span className="wb-mark">▥</span> finance<span>motion</span>
          <small>STUDIO / 02</small>
        </a>
        <div className="wb-actions">
          <span className="wb-local">● 本地自动保存</span>
          <button onClick={() => file.current?.click()}>导入 JSON</button>
          <button className="wb-primary" onClick={exportEpisode}>
            导出分镜 <span>↗</span>
          </button>
          <input
            ref={file}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </header>
      <div className="wb-heading">
        <div>
          <div className="wb-eyebrow">YOUR FINANCIAL STORY, IN MOTION</div>
          <h1>把数据，讲成故事。</h1>
          <p>分镜、图表与频道样式，在同一个工作台里。</p>
        </div>
        <div className="wb-stats">
          <span>
            <b>{episode.scenes.length}</b> 个分镜
          </span>
          <span>
            <b>{Math.round(durationInFrames(episode) / episode.fps)}</b> 秒
          </span>
          <span>
            <b>8</b> 种品牌预设
          </span>
        </div>
      </div>
      <main className="wb-main">
        <aside className="wb-sidebar">
          <div className="wb-panel-head">
            <strong>节目分镜</strong>
            <button
              className="wb-icon"
              onClick={() => setTab("templates")}
              title="添加场景"
            >
              ＋
            </button>
          </div>
          <div className="wb-scenes">
            {episode.scenes.map((s, i) => (
              <button
                key={s.id}
                className={`wb-scene ${i === index ? "active" : ""}`}
                onClick={() => {
                  setIndex(i);
                  setWhole(false);
                }}
              >
                <span className="wb-scene-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{s.title.replace(/\n/g, " ")}</strong>
                  <small>
                    {templateCatalog.find((x) => x.type === s.type)?.name} ·{" "}
                    {s.duration}s
                  </small>
                </span>
                <span className="wb-scene-dot">{i === index ? "●" : "·"}</span>
              </button>
            ))}
          </div>
          <div className="wb-scene-actions">
            <button onClick={() => move(-1)} disabled={index === 0}>
              ↑
            </button>
            <button
              onClick={() => move(1)}
              disabled={index === episode.scenes.length - 1}
            >
              ↓
            </button>
            <button
              onClick={() => {
                const s = uniqueScene(active, episode.scenes);
                setEpisode((e) =>
                  retimeScenes(
                    e,
                    [
                      ...e.scenes.slice(0, index + 1),
                      s,
                      ...e.scenes.slice(index + 1),
                    ],
                    { [s.id]: active.id },
                  ),
                );
                setIndex(index + 1);
                setMessage(
                  "已复制分镜与对应字幕；如使用旁白音轨，请同步调整音频。",
                );
              }}
            >
              复制
            </button>
            <button
              disabled={episode.scenes.length === 1}
              onClick={() => {
                setEpisode((e) =>
                  retimeScenes(
                    e,
                    e.scenes.filter((_, i) => i !== index),
                  ),
                );
                setIndex(Math.max(0, index - 1));
                setMessage(
                  "已删除分镜并调整字幕；如使用旁白音轨，请同步调整音频。",
                );
              }}
            >
              删除
            </button>
          </div>
        </aside>
        <section className="wb-center">
          <div className="wb-preview-toolbar">
            <div className="wb-segment">
              {(["landscape", "portrait", "square"] as const).map((f, i) => (
                <button
                  key={f}
                  className={episode.format === f ? "selected" : ""}
                  onClick={() => setEpisode((e) => ({ ...e, format: f }))}
                >
                  {["16:9", "9:16", "1:1"][i]}
                </button>
              ))}
            </div>
            <button className="wb-text-button" onClick={() => setWhole(!whole)}>
              {whole ? "整片预览 ✓" : "当前分镜"} ↔
            </button>
          </div>
          <div className="wb-stage">
            <div className={`wb-player ${episode.format}`}>
              <Player
                ref={player}
                component={FinanceEpisode}
                inputProps={{ episode: preview }}
                durationInFrames={durationInFrames(preview)}
                compositionWidth={dimensions[episode.format].width}
                compositionHeight={dimensions[episode.format].height}
                fps={episode.fps}
                controls
                loop
                showVolumeControls
                style={{ width: "100%" }}
                errorFallback={({ error }) => (
                  <div className="wb-player-error">{error.message}</div>
                )}
              />
            </div>
          </div>
          <div className="wb-current">
            <div>
              <span className="wb-eyebrow">
                SCENE {String(index + 1).padStart(2, "0")} / {sceneTitle}
              </span>
              <h2>{active.title.replace(/\n/g, " ")}</h2>
            </div>
            <label>
              时长{" "}
              <input
                type="number"
                min={2}
                max={120}
                step={0.5}
                value={active.duration}
                onChange={(ev) => {
                  const value = Number(ev.target.value);
                  if (value >= 2 && value <= 120)
                    setEpisode((e) =>
                      retimeScenes(
                        e,
                        e.scenes.map((s, i) =>
                          i === index ? { ...s, duration: value } : s,
                        ),
                      ),
                    );
                  setMessage("字幕已按分镜时长调整；导出前请与最终旁白核对。");
                }}
              />{" "}
              秒
            </label>
          </div>
          <div className="wb-strip">
            {compileTimeline(episode).map(({ scene, from }, i) => (
              <button
                key={scene.id}
                style={{ flex: scene.duration }}
                className={i === index ? "active" : ""}
                title={`${(from / episode.fps).toFixed(1)}s · ${scene.title}`}
                onClick={() => {
                  setIndex(i);
                  setWhole(false);
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <div className="wb-info">
            <span>
              ◈ {presetLabels[episode.brand.preset]} · {episode.fps} fps ·{" "}
              {dimensions[episode.format].width} ×{" "}
              {dimensions[episode.format].height}
            </span>
            <span>
              {episode.isDemo ? "演示内容 / 发布前替换数据" : "来源校验已启用"}
            </span>
          </div>
          {(message || issues.length > 0) && (
            <div className="wb-feedback" role="status">
              {message && <pre>{message}</pre>}
              {issues.slice(0, 5).map((i, k) => (
                <p key={k}>
                  {i.level === "error" ? "×" : "△"} {i.path}: {i.message}
                </p>
              ))}
            </div>
          )}
        </section>
        <aside className="wb-inspector">
          <div className="wb-tabs">
            {(["brand", "data", "templates"] as const).map((v, i) => (
              <button
                key={v}
                className={tab === v ? "active" : ""}
                onClick={() => setTab(v)}
              >
                {["频道样式", "分镜数据", "模板库"][i]}
              </button>
            ))}
          </div>
          {tab === "brand" && (
            <div className="wb-settings">
              <label className="wb-label">
                频道名称
                <input
                  value={episode.brand.name}
                  maxLength={30}
                  onChange={(e) => {
                    if (e.target.value) brand({ name: e.target.value });
                  }}
                />
              </label>
              <div className="wb-label">
                品牌预设 <span>统一应用到整片</span>
              </div>
              <div className="wb-themes">
                {Object.entries(presets).map(([key, p]) => (
                  <button
                    key={key}
                    className={`wb-theme ${key === episode.brand.preset ? "active" : ""}`}
                    onClick={() =>
                      brand({
                        preset: key as Brand["preset"],
                        overrides: undefined,
                      })
                    }
                  >
                    <span
                      className="wb-swatch"
                      style={{
                        background: p.colors.background,
                        color: p.colors.foreground,
                      }}
                    >
                      <b
                        style={{
                          fontFamily:
                            p.typography.font === "serif"
                              ? "Georgia"
                              : "inherit",
                        }}
                      >
                        Aa
                      </b>
                      <i style={{ background: p.colors.accent }} />
                    </span>
                    <span>{presetLabels[key as Brand["preset"]]}</span>
                  </button>
                ))}
              </div>
              <div className="wb-label">自定义颜色</div>
              <div className="wb-colors">
                {(
                  [
                    "accent",
                    "background",
                    "foreground",
                    "surface",
                    "muted",
                  ] as const
                ).map((key, i) => (
                  <label key={key}>
                    <span>
                      {["强调色", "背景", "主文字", "卡片", "次要文字"][i]}
                    </span>
                    <input
                      type="color"
                      value={tokens.colors[key]}
                      onChange={(e) => color(key, e.target.value)}
                    />
                    <code>{tokens.colors[key]}</code>
                  </label>
                ))}
              </div>
              <label className="wb-label">
                字体
                <select
                  value={tokens.typography.font}
                  onChange={(e) =>
                    brand({
                      overrides: {
                        ...episode.brand.overrides,
                        typography: {
                          ...episode.brand.overrides?.typography,
                          font: e.target.value as "sans" | "serif" | "mono",
                        },
                      },
                    })
                  }
                >
                  <option value="sans">无衬线 · 清晰现代</option>
                  <option value="serif">衬线 · 财经周刊</option>
                  <option value="mono">等宽 · 市场终端</option>
                </select>
              </label>
              <label className="wb-label">
                圆角 <span>{tokens.shape.radius}px</span>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={tokens.shape.radius}
                  onChange={(e) =>
                    brand({
                      overrides: {
                        ...episode.brand.overrides,
                        shape: {
                          ...episode.brand.overrides?.shape,
                          radius: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </label>
              <label className="wb-label">
                动效节奏
                <select
                  value={tokens.motion}
                  onChange={(e) =>
                    brand({
                      overrides: {
                        ...episode.brand.overrides,
                        motion: e.target.value as typeof tokens.motion,
                      },
                    })
                  }
                >
                  <option value="calm">沉稳</option>
                  <option value="editorial">编辑节奏</option>
                  <option value="energetic">轻快</option>
                  <option value="none">静态</option>
                </select>
              </label>
              <label className="wb-label">
                涨跌颜色
                <select
                  value={episode.brand.marketColors}
                  onChange={(e) =>
                    brand({
                      marketColors: e.target.value as Brand["marketColors"],
                    })
                  }
                >
                  <option value="international">绿涨 / 红跌</option>
                  <option value="china">红涨 / 绿跌</option>
                </select>
              </label>
              <button
                className="wb-wide"
                onClick={() => download("brand.json", episode.brand)}
              >
                导出频道样式 ↓
              </button>
              <p className="wb-hint">
                样式由统一 tokens 驱动。完整字体、边框、图表序列色与留白可在
                JSON 的 brand.overrides 中编辑。
              </p>
            </div>
          )}
          {tab === "data" && (
            <div className="wb-settings">
              <p className="wb-hint">
                粘贴 AI 生成的 Episode
                JSON。点击应用会检查数据结构、来源、字幕时序与财务勾稽。
              </p>
              <textarea
                aria-label="Episode JSON"
                className="wb-editor"
                value={editor}
                onChange={(e) => setEditor(e.target.value)}
                spellCheck={false}
              />
              <button className="wb-primary wb-wide" onClick={apply}>
                校验并应用
              </button>
              <button
                className="wb-wide"
                onClick={() => {
                  setEpisode(sample);
                  setIndex(0);
                  setMessage("已恢复演示节目");
                }}
              >
                载入演示节目
              </button>
            </div>
          )}
          {tab === "templates" && (
            <div className="wb-settings">
              <input
                placeholder="搜索图表、财报、片头…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <p className="wb-hint">
                24 种数据驱动模板。原组件可通过 legacy 场景与 Composition ID
                引用。
              </p>
              {templateCatalog
                .filter(
                  (x) =>
                    x.type !== "legacy" &&
                    `${x.name}${x.group}${x.use}`.includes(search),
                )
                .map((a, i) => (
                  <button
                    className="wb-template"
                    key={a.type}
                    onClick={() => add(a.type)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{a.name}</strong>
                      <small>{a.use}</small>
                    </div>
                    <b>＋</b>
                  </button>
                ))}
            </div>
          )}
        </aside>
      </main>
      <footer className="wb-footer">
        <span>FINANCE MOTION</span>
        <span>数据有来源，样式有秩序，故事有节奏。</span>
        <span>Remotion production system · v2.0</span>
      </footer>
    </div>
  );
};
