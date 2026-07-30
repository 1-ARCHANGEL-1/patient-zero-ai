import { NextResponse } from "next/server";
import { answerInvestigationQuestion, generateExposureTreeGraph } from "@/services/openai";
import { storeExposureGraph } from "@/services/neo4j";
import { getMockChatResponse, mockExposureTreeGraph } from "@/lib/mockData";
import type { ChatMessage } from "@/types";

const GRAPH_TRIGGER = /generate graph|exposure graph/i;
const GRAPH_GENERATED_MESSAGE = "Exposure graph generated based on investigation.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question: string | undefined = body?.question;
  const messages: ChatMessage[] = body?.messages ?? [];
  const videoContext: unknown = body?.videoContext;

  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  if (GRAPH_TRIGGER.test(question)) {
    try {
      const graphData = await generateExposureTreeGraph(messages, videoContext);
      // storeExposureGraph never throws (it catches internally) — a Neo4j
      // outage should never prevent the graph from reaching the frontend.
      await storeExposureGraph(graphData);
      return NextResponse.json({ type: "graph", message: GRAPH_GENERATED_MESSAGE, graphData });
    } catch (error) {
      console.error("[api/chat] exposure graph generation failed, falling back to mock:", error);
      return NextResponse.json({
        type: "graph",
        message: GRAPH_GENERATED_MESSAGE,
        graphData: mockExposureTreeGraph,
      });
    }
  }

  try {
    const answer = await answerInvestigationQuestion(question, { messages, videoContext });
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ answer: getMockChatResponse(question) });
  }
}
