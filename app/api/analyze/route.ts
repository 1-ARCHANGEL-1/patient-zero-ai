import { NextResponse } from "next/server";
import { runInvestigationWorkflow } from "@/services/strands";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const investigationId: string | undefined = body?.investigationId;
  const videoIds: string[] = body?.videoIds ?? [];

  if (!investigationId) {
    return NextResponse.json({ error: "investigationId is required" }, { status: 400 });
  }

  try {
    // TODO: wire this up to the real Strands workflow once TwelveLabs,
    // OpenAI, and Neo4j credentials are configured.
    const run = await runInvestigationWorkflow(investigationId, videoIds);
    return NextResponse.json(run);
  } catch {
    return NextResponse.json(
      { error: "Analyze pipeline is not wired up yet — see services/strands.ts" },
      { status: 501 }
    );
  }
}
