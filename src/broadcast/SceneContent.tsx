import React from "react";
import { Img, OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { readableAccent } from "../brand/contrast";
import { useBrand } from "../brand/BrandProvider";
import type { Episode, Scene } from "../program/schema";
import {
  Panel,
  Reveal,
  Delta,
  MetricValue,
  useNarrow,
  useSceneMotion,
  formatValue,
} from "./primitives";
import { Bars, Trend, Waterfall, Donut } from "./charts";

export const SceneContent: React.FC<{ scene: Scene; episode: Episode }> = ({
  scene: s,
  episode: e,
}) => {
  const { tokens: t } = useBrand();
  const n = useNarrow();
  const { width, height } = useVideoConfig();
  const portrait = height > width * 1.2;
  const square = n && !portrait;
  const progress = useSceneMotion();
  const c = t.colors;
  const accentInk = readableAccent(c.accent, c.background, c.foreground);
  const body = {
    fontSize: n ? 28 : 31,
    lineHeight: 1.65,
    whiteSpace: "pre-line" as const,
  };
  const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: portrait ? "1fr" : "1fr 1fr",
    gap: 24,
  };
  switch (s.type) {
    case "opener":
      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Reveal>
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.16em",
                color: c.muted,
                marginBottom: 36,
              }}
            >
              {s.episode || "FINANCIAL STORIES"} /{" "}
              {s.kicker || "看懂数字背后的世界"}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div
              style={{
                fontSize: (n ? 80 : 112) * t.typography.titleScale,
                lineHeight: 1.16,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                whiteSpace: "pre-line",
                maxWidth: n ? "100%" : "88%",
              }}
            >
              {s.title}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              style={{
                width: 140,
                height: 10,
                background: c.accent,
                margin: "36px 0",
              }}
            />
            <div style={{ ...body, color: c.muted, maxWidth: 1100 }}>
              {s.tagline || s.subtitle}
            </div>
          </Reveal>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "end",
              gap: 12,
              opacity: 0.4,
            }}
          >
            {[42, 65, 51, 98, 126, 167].map((v, i) => (
              <div
                key={i}
                style={{
                  height: v * progress(i * 0.06),
                  width: n ? 30 : 54,
                  background: i === 5 ? c.accent : c.line,
                }}
              />
            ))}
          </div>
        </div>
      );
    case "chapter":
      return (
        <Reveal>
          <div
            style={{
              fontSize: n ? 180 : 240,
              lineHeight: 1,
              fontWeight: 700,
              color: accentInk,
              letterSpacing: "-0.08em",
            }}
          >
            {s.number}
          </div>
          <div style={{ height: 2, background: c.line, margin: "32px 0" }} />
          <div style={{ ...body, maxWidth: 1100 }}>
            {s.summary || s.subtitle}
          </div>
        </Reveal>
      );
    case "headline":
      return (
        <div
          style={{
            ...row,
            gridTemplateColumns: n || !s.metric ? "1fr" : "1.4fr 1fr",
            alignItems: "center",
          }}
        >
          <Reveal>
            <span
              style={{
                display: "inline-block",
                background: c.accent,
                color: c.onAccent,
                padding: "12px 20px",
                fontSize: 22,
                letterSpacing: "0.1em",
                marginBottom: 28,
              }}
            >
              {s.label}
            </span>
            <div
              style={{
                fontSize: n ? 44 : 49,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {s.body}
            </div>
          </Reveal>
          {s.metric && (
            <Panel>
              <div style={{ color: c.muted, fontSize: 23, marginBottom: 24 }}>
                {s.metric.label}
              </div>
              <MetricValue metric={s.metric} size={120} locale={e.locale} />
              {s.metric.change !== undefined && (
                <div style={{ marginTop: 28 }}>
                  <Delta value={s.metric.change} label={s.metric.changeLabel} />
                </div>
              )}
            </Panel>
          )}
        </div>
      );
    case "hero":
      return (
        <Reveal>
          <div style={{ fontSize: 28, color: c.muted, marginBottom: 34 }}>
            {s.metric.label}
          </div>
          <MetricValue
            metric={s.metric}
            size={n ? 180 : 236}
            locale={e.locale}
          />
          <div
            style={{
              height: 8,
              width: 140,
              background: c.accent,
              margin: "40px 0",
            }}
          />
          {s.metric.change !== undefined && (
            <Delta value={s.metric.change} label={s.metric.changeLabel} />
          )}
          <div style={{ ...body, color: c.muted, marginTop: 24 }}>
            {s.metric.note}
          </div>
        </Reveal>
      );
    case "kpis":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${n ? 2 : s.items.length <= 3 ? s.items.length : s.items.length === 4 ? 2 : 3},1fr)`,
            gap: 24,
          }}
        >
          {s.items.map((m, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Panel
                accent={i === 0}
                style={{ height: "100%", padding: n ? 26 : 34 }}
              >
                <div style={{ fontSize: 23, opacity: 0.7, marginBottom: 28 }}>
                  {m.label}
                </div>
                <MetricValue metric={m} size={n ? 76 : 98} locale={e.locale} />
                {m.change !== undefined && (
                  <div style={{ marginTop: 25 }}>
                    <Delta
                      value={m.change}
                      label={m.changeLabel}
                      background={i === 0 ? c.accent : undefined}
                    />
                  </div>
                )}
                {m.note && (
                  <div
                    style={{
                      fontSize: 20,
                      marginTop: 20,
                      opacity: 0.75,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.note}
                  </div>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>
      );
    case "bars":
    case "ranking":
      return <Bars scene={s} />;
    case "trend":
      return <Trend scene={s} />;
    case "waterfall":
      return <Waterfall scene={s} />;
    case "donut":
      return <Donut scene={s} />;
    case "table":
      return (
        <div
          style={{
            border: `1px solid ${c.line}`,
            borderRadius: t.shape.radius,
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: n ? 22 : 27,
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ background: c.foreground, color: c.background }}>
                {s.columns.map((v, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: i ? "right" : "left",
                      padding: "24px 22px",
                      fontWeight: 500,
                    }}
                  >
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    background:
                      i === s.highlightRow
                        ? c.accent
                        : i % 2
                          ? c.surface
                          : "transparent",
                    color: i === s.highlightRow ? c.onAccent : c.foreground,
                    opacity: progress(i * 0.05),
                  }}
                >
                  {r.map((v, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "24px 22px",
                        textAlign: j ? "right" : "left",
                        borderBottom: `1px solid ${c.line}`,
                        overflowWrap: "anywhere",
                        fontWeight: i === s.highlightRow ? 700 : 400,
                      }}
                    >
                      {typeof v === "number"
                        ? formatValue(v, Number.isInteger(v) ? 0 : 1, e.locale)
                        : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "quote":
      return (
        <Reveal>
          <div
            style={{
              fontFamily: "Georgia,serif",
              fontSize: 180,
              lineHeight: 0.65,
              color: accentInk,
            }}
          >
            “
          </div>
          <div
            style={{
              fontSize: n ? 44 : 58,
              lineHeight: 1.6,
              fontWeight: 500,
              maxWidth: 1450,
              marginTop: 16,
            }}
          >
            {s.quote}
          </div>
          <div
            style={{
              marginTop: 46,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ width: 56, height: 3, background: c.accent }} />
            <div>
              <div style={{ fontSize: 26, fontWeight: 600 }}>{s.author}</div>
              <div style={{ fontSize: 21, color: c.muted, marginTop: 8 }}>
                {s.role}
              </div>
            </div>
          </div>
        </Reveal>
      );
    case "comparison":
      return (
        <div style={row}>
          {[s.left, s.right].map((a, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <Panel
                style={{
                  height: "100%",
                  borderTop: `6px solid ${i ? c.accent : c.foreground}`,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: c.muted,
                    letterSpacing: "0.1em",
                    marginBottom: 22,
                  }}
                >
                  {a.label}
                </div>
                <div
                  style={{
                    fontSize: n ? 37 : 44,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    marginBottom: 28,
                  }}
                >
                  {a.headline}
                </div>
                {a.points.map((p, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "15px 0",
                      borderTop: `1px solid ${c.line}`,
                      fontSize: n ? 24 : 27,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: c.muted }}>0{j + 1}</span>
                    <span>{p}</span>
                  </div>
                ))}
              </Panel>
            </Reveal>
          ))}
        </div>
      );
    case "timeline":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            gap: n ? 28 : 24,
          }}
        >
          {s.events.map((a, i) => (
            <Reveal key={i} delay={i * 0.13} style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  color: accentInk,
                  marginBottom: 20,
                }}
              >
                {a.date}
              </div>
              <div
                style={{
                  height: 2,
                  background: c.line,
                  position: "relative",
                  marginBottom: 26,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    top: -5,
                    background: c.accent,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: n ? 32 : 30,
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {a.title}
              </div>
              <div
                style={{
                  fontSize: 23,
                  lineHeight: 1.65,
                  color: c.muted,
                  marginTop: 18,
                }}
              >
                {a.body}
              </div>
            </Reveal>
          ))}
        </div>
      );
    case "equation":
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: portrait ? "column" : "row",
              alignItems: "center",
              gap: 24,
            }}
          >
            {s.terms.map((a, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span style={{ fontSize: 48, color: c.muted }}>
                    {s.operators[i - 1]}
                  </span>
                )}
                <Panel
                  accent={i === s.terms.length - 1}
                  style={{
                    flex: 1,
                    width: portrait ? "100%" : undefined,
                    textAlign: "center",
                    padding: "40px 24px",
                  }}
                >
                  <div style={{ fontSize: 24, opacity: 0.7, marginBottom: 20 }}>
                    {a.label}
                  </div>
                  <div style={{ fontSize: square ? 38 : 52, fontWeight: 600 }}>
                    {a.value}
                  </div>
                </Panel>
              </React.Fragment>
            ))}
          </div>
          <div style={{ ...body, color: c.muted, marginTop: 32 }}>
            {s.explanation}
          </div>
        </div>
      );
    case "takeaway":
      return (
        <Reveal>
          <div style={{ display: "flex", gap: 26, alignItems: "start" }}>
            <span style={{ fontSize: 64, color: accentInk }}>↗</span>
            <div
              style={{
                fontSize: n ? 53 : 72,
                fontWeight: 600,
                lineHeight: 1.4,
                whiteSpace: "pre-line",
                maxWidth: 1420,
              }}
            >
              {s.body}
            </div>
          </div>
          {s.action && (
            <Panel
              accent
              style={{
                marginTop: 48,
                fontSize: 28,
                lineHeight: 1.6,
                padding: "28px 34px",
              }}
            >
              {s.action}
            </Panel>
          )}
        </Reveal>
      );
    case "bullets":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {s.items.map((a, i) => (
            <Reveal key={i} delay={i * 0.16}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1fr",
                  gap: 24,
                  borderBottom: `1px solid ${c.line}`,
                  paddingBottom: 24,
                }}
              >
                <span
                  style={{ fontSize: 36, color: accentInk, fontWeight: 600 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div style={{ fontSize: n ? 32 : 37, fontWeight: 600 }}>
                    {a.title}
                  </div>
                  {a.body && (
                    <div
                      style={{
                        fontSize: 25,
                        color: c.muted,
                        lineHeight: 1.55,
                        marginTop: 10,
                      }}
                    >
                      {a.body}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      );
    case "news-grid":
      return (
        <div style={{ ...row }}>
          {s.items.map((a, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Panel style={{ height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 19,
                    color: c.muted,
                    marginBottom: 20,
                  }}
                >
                  <span>{a.category}</span>
                  <span>0{i + 1}</span>
                </div>
                <div
                  style={{
                    fontSize: n ? 31 : 36,
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {a.headline}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    color: c.muted,
                    lineHeight: 1.6,
                    marginTop: 20,
                  }}
                >
                  {a.summary}
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>
      );
    case "earnings":
      return (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 26,
              marginBottom: 30,
            }}
          >
            <strong>{s.company}</strong>
            <span style={{ color: c.muted }}>{s.period}</span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${n ? 2 : s.items.length},1fr)`,
              gap: 24,
            }}
          >
            {s.items.map((m, i) => (
              <Panel key={i} style={{ padding: square ? 20 : 26 }}>
                <div
                  style={{
                    fontSize: 21,
                    color: c.muted,
                    marginBottom: square ? 18 : 26,
                  }}
                >
                  {m.label}
                </div>
                <MetricValue
                  metric={m}
                  size={square ? 62 : n ? 72 : 85}
                  locale={e.locale}
                />
                {m.change !== undefined && (
                  <div style={{ marginTop: 20 }}>
                    <Delta value={m.change} />
                  </div>
                )}
              </Panel>
            ))}
          </div>
          <Panel
            accent
            style={{
              marginTop: square ? 20 : 30,
              fontSize: square ? 23 : 27,
              lineHeight: 1.55,
              padding: square ? 22 : 30,
            }}
          >
            <strong>指引 / </strong>
            {s.guidance}
          </Panel>
        </div>
      );
    case "scenario":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: portrait ? "1fr" : "repeat(3,1fr)",
            gap: 24,
          }}
        >
          {s.scenarios.map((a, i) => (
            <Panel key={i} accent={i === 1}>
              <div style={{ fontSize: 23, opacity: 0.7, marginBottom: 26 }}>
                {a.name}
              </div>
              <div
                style={{
                  fontSize: 79,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                {formatValue(a.value, 1)}
                <span style={{ fontSize: 26, marginLeft: 8 }}>{s.unit}</span>
              </div>
              <div
                style={{
                  height: 2,
                  background: "currentColor",
                  opacity: 0.2,
                  margin: "26px 0",
                }}
              />
              <div style={{ fontSize: 25, lineHeight: 1.6 }}>
                {a.assumption}
              </div>
            </Panel>
          ))}
        </div>
      );
    case "media":
      return (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              background: c.surface,
              border: `1px solid ${c.line}`,
              borderRadius: t.shape.radius,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile(s.asset)}
              style={{ height: "100%", width: "100%", objectFit: s.fit }}
            />
          </div>
          <div style={{ fontSize: 23, color: c.muted }}>{s.caption}</div>
        </div>
      );
    case "presenter":
      return (
        <div
          style={{
            ...row,
            height: "100%",
            gridTemplateColumns: portrait ? "1fr" : "0.9fr 1.1fr",
          }}
        >
          <div
            style={{
              minHeight: 0,
              height: portrait ? 350 : "100%",
              background: c.surface,
              overflow: "hidden",
              borderRadius: t.shape.radius,
            }}
          >
            {s.mediaType === "video" ? (
              <OffthreadVideo
                src={staticFile(s.asset)}
                muted
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            ) : (
              <Img
                src={staticFile(s.asset)}
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 28,
            }}
          >
            {s.points.map((p, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    fontSize: 31,
                    lineHeight: 1.55,
                  }}
                >
                  <span style={{ color: accentInk }}>0{i + 1}</span>
                  <span>{p}</span>
                </div>
              </Reveal>
            ))}
            {s.lowerThird && (
              <div
                style={{
                  marginTop: 16,
                  borderLeft: `6px solid ${c.accent}`,
                  paddingLeft: 20,
                }}
              >
                <strong style={{ fontSize: 26 }}>{s.lowerThird.name}</strong>
                <div style={{ fontSize: 20, color: c.muted, marginTop: 10 }}>
                  {s.lowerThird.role}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    case "sources": {
      const sources = s.sourceIds.length
        ? e.sources.filter((x) => s.sourceIds.includes(x.id))
        : e.sources;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {s.heading && (
            <div style={{ fontSize: 26, color: c.muted }}>{s.heading}</div>
          )}
          {sources.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 18,
                paddingBottom: 18,
                borderBottom: `1px solid ${c.line}`,
              }}
            >
              <span style={{ fontSize: 24, color: c.muted }}>0{i + 1}</span>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600 }}>
                  {a.label}{" "}
                  <span
                    style={{ fontSize: 18, color: c.muted, fontWeight: 400 }}
                  >
                    {a.date}
                  </span>
                </div>
                {a.detail && (
                  <div
                    style={{
                      fontSize: 20,
                      color: c.muted,
                      lineHeight: 1.5,
                      marginTop: 8,
                    }}
                  >
                    {a.detail}
                  </div>
                )}
                {a.url && (
                  <div
                    style={{
                      fontSize: 17,
                      color: c.muted,
                      overflowWrap: "anywhere",
                      marginTop: 6,
                    }}
                  >
                    {a.url}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    case "endcard":
      return (
        <Reveal>
          <div
            style={{
              fontSize: n ? 52 : 76,
              fontWeight: 700,
              lineHeight: 1.35,
              whiteSpace: "pre-line",
              maxWidth: 1300,
            }}
          >
            {s.message}
          </div>
          <div
            style={{
              width: 130,
              height: 8,
              background: c.accent,
              margin: "40px 0",
            }}
          />
          {s.nextTitle && (
            <Panel style={{ maxWidth: 1100 }}>
              <div style={{ fontSize: 19, color: c.muted, marginBottom: 15 }}>
                下一期 / UP NEXT
              </div>
              <div style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.5 }}>
                {s.nextTitle}
              </div>
            </Panel>
          )}
          <div style={{ marginTop: 36, fontSize: 24, color: c.muted }}>
            {s.handle}
          </div>
        </Reveal>
      );
    case "legacy":
      return null;
    default: {
      const unreachable: never = s;
      return unreachable;
    }
  }
};
