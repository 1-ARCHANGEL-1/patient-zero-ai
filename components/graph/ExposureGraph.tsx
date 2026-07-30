"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { graphNodes, graphEdges } from "@/lib/mockData";
import { NodeTooltip } from "@/components/graph/NodeTooltip";
import type { RiskFilter } from "@/components/graph/GraphFilters";
import type { GraphNode } from "@/types";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const NODE_COLOR: Record<GraphNode["type"], string> = {
  "patient-zero": "#0A0A0A",
  person: "#9CA3AF",
  room: "#E5E5E5",
};

const RISK_COLOR: Record<NonNullable<GraphNode["risk"]>, string> = {
  high: "#DC2626",
  medium: "#D97706",
  low: "#16A34A",
};

interface ExposureGraphProps {
  filter: RiskFilter;
  width: number;
  height: number;
}

export function ExposureGraph({ filter, width, height }: ExposureGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    const visibleIds = new Set(
      graphNodes
        .filter((n) => filter === "all" || n.type !== "person" || n.risk === filter)
        .map((n) => n.id)
    );

    return {
      nodes: graphNodes.filter((n) => visibleIds.has(n.id)),
      links: graphEdges
        .filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target))
        .map((e) => ({ ...e })),
    };
  }, [filter]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full bg-white"
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      <ForceGraph2D
        width={width}
        height={height}
        graphData={data}
        nodeId="id"
        nodeLabel={() => ""}
        nodeRelSize={5}
        linkColor={() => "#D1D5DB"}
        linkWidth={1}
        linkDirectionalArrowLength={3}
        onNodeHover={(node) => setHoveredNode((node as GraphNode) ?? null)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const n = node as GraphNode & { x: number; y: number };
          const isPatientZero = n.type === "patient-zero";
          const radius = isPatientZero ? 9 : n.type === "room" ? 6 : 7;

          ctx.beginPath();
          if (n.type === "room") {
            ctx.strokeStyle = "#9CA3AF";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(n.x - radius, n.y - radius, radius * 2, radius * 2);
          } else {
            ctx.fillStyle = n.risk ? RISK_COLOR[n.risk] : NODE_COLOR[n.type];
            ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI);
            ctx.fill();
          }

          const label = n.label;
          const fontSize = 11 / globalScale;
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = "#0A0A0A";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(label, n.x, n.y + radius + 3);
        }}
      />

      {hoveredNode && (
        <div
          className="absolute z-10"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
        >
          <NodeTooltip node={hoveredNode} />
        </div>
      )}
    </div>
  );
}
