import type { GraphNode } from "@/types";

const riskColor: Record<NonNullable<GraphNode["risk"]>, string> = {
  high: "#DC2626",
  medium: "#D97706",
  low: "#16A34A",
};

export function NodeTooltip({ node }: { node: GraphNode }) {
  return (
    <div className="pointer-events-none rounded-[8px] border border-border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-brand-black">{node.label}</p>
      {node.risk && (
        <p className="mt-0.5 font-medium" style={{ color: riskColor[node.risk] }}>
          {node.risk} risk
        </p>
      )}
      {node.confidence !== undefined && (
        <p className="text-brand-muted">Confidence: {node.confidence}%</p>
      )}
      {node.timestamp && <p className="text-brand-muted">Seen: {node.timestamp}</p>}
    </div>
  );
}
