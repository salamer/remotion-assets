# Charts

数据 → 坐标 / 长度 / 面积 / 位置。先看轮廓选子类。

## 子类线框速览

```text
categorical/          竖条 / 横条 / 排名
   ██  ██  █
   ██  ██  ██
  ────────────

time-series/          折线 / 面积 / 蜡烛
   ·──·──●──·

comparison/           哑铃 / 斜率 / 小 multiples
   ○────●

composition/          环 / 堆叠 / 树图 / 瀑布
   ╭──╮    ████│▓▓│░░

distribution/         直方 / 箱线 / 散点 / 热力
   █████    · ·●·

uncertainty/          预测扇 / 范围带
   ░░╱──╲░░

multivariate/         平行坐标 / 雷达 / 象限
      ╱╲
     ●──●
```

## 子目录

| 目录            | 何时进                 | README                                             |
| --------------- | ---------------------- | -------------------------------------------------- |
| `categorical/`  | 类别大小、排名、情景条 | [categorical/README.md](./categorical/README.md)   |
| `time-series/`  | 随时间变化             | [time-series/README.md](./time-series/README.md)   |
| `comparison/`   | 两点 / 两期对照        | [comparison/README.md](./comparison/README.md)     |
| `composition/`  | 部分占整体             | [composition/README.md](./composition/README.md)   |
| `distribution/` | 分布形状 / 密度        | [distribution/README.md](./distribution/README.md) |
| `uncertainty/`  | 预测区间               | [uncertainty/README.md](./uncertainty/README.md)   |
| `multivariate/` | 多维定量画像           | [multivariate/README.md](./multivariate/README.md) |

定性 2×2 战略矩阵不在这里 → `frameworks/strategy/`。
