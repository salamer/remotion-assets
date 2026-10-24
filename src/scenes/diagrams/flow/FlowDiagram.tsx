import React from "react";
import { useCurrentFrame } from "remotion";
import { Frame } from "../../../components/Frame";
import { BrutalCard } from "../../../components/BrutalCard";
import { SceneHeader } from "../../../components/SceneHeader";
import { fadeUp } from "../../../lib/motion";
type Node = { icon: string; title: string; subtitle?: string };
const DEFAULT: Node[] = [
  { icon: "01", title: "GUEST", subtitle: "Pays $100" },
  { icon: "02", title: "PLATFORM", subtitle: "Keeps fee" },
  { icon: "03", title: "HOST", subtitle: "Receives remainder" },
];
export const FlowDiagram: React.FC<{
  nodes?: Node[];
  title?: string;
  eyebrow?: string;
  takeaway?: string;
}> = ({
  nodes = DEFAULT,
  title = "The platform sits in the middle.",
  eyebrow = "BUSINESS MODEL",
  takeaway = "NO HOTEL OWNERSHIP REQUIRED",
}) => {
  const frame = useCurrentFrame();
  return (
    <Frame>
      <SceneHeader title={title} eyebrow={eyebrow} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginTop: 140,
        }}
      >
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ fontSize: 42, ...fadeUp(frame, 10 + i * 8) }}>
                →
              </div>
            )}
            <div style={{ flex: 1, ...fadeUp(frame, 10 + i * 8) }}>
              <BrutalCard yellow={i === 1} className="p-8 text-center">
                <div style={{ fontSize: 56 }}>{node.icon}</div>
                <div style={{ fontSize: 32, marginTop: 28, fontWeight: 600 }}>
                  {node.title}
                </div>
                <div style={{ fontSize: 24, marginTop: 20 }}>
                  {node.subtitle}
                </div>
              </BrutalCard>
            </div>
          </React.Fragment>
        ))}
      </div>
      {takeaway && (
        <div
          style={{
            fontSize: 30,
            textAlign: "center",
            marginTop: 70,
            ...fadeUp(frame, 50),
          }}
        >
          {takeaway}
        </div>
      )}
    </Frame>
  );
};
