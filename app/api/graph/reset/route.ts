import { NextResponse } from "next/server";
import { clearExposureGraph } from "@/services/neo4j";

export async function POST() {
  try {
    // clearExposureGraph never throws (it catches internally) — a Neo4j
    // outage should never block resetting the local investigation state.
    await clearExposureGraph();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/graph/reset] clearExposureGraph failed:", error);
    return NextResponse.json({ success: false });
  }
}
