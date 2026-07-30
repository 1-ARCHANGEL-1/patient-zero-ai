import { NextResponse } from "next/server";
import { getExposureGraph, storeExposureGraph } from "@/services/neo4j";
import { mockExposureTreeGraph } from "@/lib/mockData";

export async function GET() {
  try {
    const graph = await getExposureGraph();
    if (!graph) {
      return NextResponse.json(null);
    }
    return NextResponse.json(graph);
  } catch (error) {
    console.error("[api/graph] Neo4j query failed, falling back to mock data:", error);
    return NextResponse.json(mockExposureTreeGraph);
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const graphData = body?.graphData;

  if (!graphData) {
    return NextResponse.json({ error: "graphData is required" }, { status: 400 });
  }

  try {
    await storeExposureGraph(graphData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/graph] storeExposureGraph failed (continuing without it):", error);
    return NextResponse.json({ success: false });
  }
}
