import { NextResponse } from "next/server";
import { getExposureGraph } from "@/services/neo4j";
import { graphNodes, graphEdges } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const investigationId = searchParams.get("investigationId") ?? "demo";

  try {
    // TODO: swap this out for getExposureGraph once Neo4j is wired up;
    // falling back to mock graph data for now.
    const graph = await getExposureGraph(investigationId);
    return NextResponse.json(graph);
  } catch {
    return NextResponse.json({ nodes: graphNodes, edges: graphEdges });
  }
}
