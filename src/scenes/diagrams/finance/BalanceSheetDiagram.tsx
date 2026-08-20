import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { SceneHeader } from "../../../components/SceneHeader";
import { Source } from "../../../components/Source";
import { countTo, tween } from "../../../lib/motion";
import { shadows } from "../../../style/theme";

export type BalanceSheetItem = {
  label: string;
  value: number;
  icon?: string;
  accent?: boolean;
};

export type BalanceSheetDiagramProps = {
  eyebrow?: string;
  title?: string;
  assets?: BalanceSheetItem[];
  liabilities?: BalanceSheetItem[];
  equity?: BalanceSheetItem[];
  unit?: string;
  source?: string;
};

const DEFAULT_ASSETS: BalanceSheetItem[] = [
  { label: "CASH", value: 18, icon: "💵" },
  { label: "LOANS", value: 52, icon: "🧾", accent: true },
  { label: "SECURITIES", value: 30, icon: "📊" },
];

const DEFAULT_LIABILITIES: BalanceSheetItem[] = [
  { label: "DEPOSITS", value: 64, icon: "🏦" },
  { label: "DEBT", value: 21, icon: "📄" },
];

const DEFAULT_EQUITY: BalanceSheetItem[] = [
  { label: "EQUITY", value: 15, icon: "📈", accent: true },
];

const StackColumn: React.FC<{
  title: string;
  items: BalanceSheetItem[];
  totalScale: number;
  frame: number;
  delay: number;
  unit: string;
}> = ({ title, items, totalScale, frame, delay, unit }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="flex-1">
      <div className="mb-4 flex items-end justify-between">
        <div className="text-[24px] font-semibold tracking-[0.08em]">
          {title}
        </div>
        <div className="text-[42px] font-semibold tracking-[-0.05em]">
          {unit}
          {Math.round(countTo(frame, total, delay, 30))}
        </div>
      </div>
      <div
        className="flex h-[480px] flex-col justify-end border-2 border-ink bg-white"
        style={{ boxShadow: shadows.brutal }}
      >
        {items.map((item, index) => {
          const p = tween(frame, delay + index * 7, 24);
          const h = (item.value / totalScale) * 100 * p;
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between overflow-hidden border-t-2 border-ink px-7 first:border-t-0 ${item.accent ? "bg-yellow" : index % 2 ? "bg-soft" : "bg-white"}`}
              style={{ height: `${h}%` }}
            >
              {p > 0.45 ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-[38px]">{item.icon ?? "◻️"}</span>
                    <span className="text-[24px] font-semibold">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[30px] font-semibold">
                    {unit}
                    {Math.round(item.value * p)}
                  </span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BalanceSheetDiagram: React.FC<BalanceSheetDiagramProps> = ({
  eyebrow = "BALANCE SHEET",
  title = "Assets must be financed by liabilities and equity.",
  assets = DEFAULT_ASSETS,
  liabilities = DEFAULT_LIABILITIES,
  equity = DEFAULT_EQUITY,
  unit = "$",
  source = "ILLUSTRATIVE BALANCE SHEET",
}) => {
  const frame = useCurrentFrame();
  const assetTotal = assets.reduce((sum, x) => sum + x.value, 0);
  const rhs = [...liabilities, ...equity];
  const rhsTotal = rhs.reduce((sum, x) => sum + x.value, 0);
  const scale = Math.max(assetTotal, rhsTotal, 1);
  const equationP = tween(frame, 5, 18);

  return (
    <Frame>
      <SceneHeader
        eyebrow={eyebrow}
        title={title}
        subtitle="Assets = liabilities + equity."
      />

      <div
        className="mt-5 flex items-center justify-center gap-5"
        style={{ opacity: equationP }}
      >
        <div className="border-2 border-ink bg-yellow px-6 py-3 text-[25px] font-semibold">
          ASSETS
        </div>
        <div className="text-[34px] font-semibold">=</div>
        <div className="border-2 border-ink bg-white px-6 py-3 text-[25px] font-semibold">
          LIABILITIES + EQUITY
        </div>
      </div>

      <div className="mt-6 flex gap-16">
        <StackColumn
          title="ASSETS"
          items={assets}
          totalScale={scale}
          frame={frame}
          delay={14}
          unit={unit}
        />
        <StackColumn
          title="LIABILITIES + EQUITY"
          items={rhs}
          totalScale={scale}
          frame={frame}
          delay={22}
          unit={unit}
        />
      </div>

      <div className="mt-5 flex justify-center">
        <div
          className={`border-2 border-ink px-5 py-2 text-[18px] font-semibold ${Math.abs(assetTotal - rhsTotal) < 0.001 ? "bg-yellow" : "bg-white"}`}
        >
          {Math.abs(assetTotal - rhsTotal) < 0.001
            ? "BALANCED"
            : `CHECK: ${unit}${assetTotal} ≠ ${unit}${rhsTotal}`}
        </div>
      </div>

      <Source>{source}</Source>
    </Frame>
  );
};
