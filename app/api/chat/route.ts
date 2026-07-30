import { NextResponse } from "next/server";
import { answerInvestigationQuestion } from "@/services/openai";
import { getMockChatResponse } from "@/lib/mockData";
import type { ChatMessage } from "@/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const question: string | undefined = body?.question;
  const messages: ChatMessage[] = body?.messages ?? [];

  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  try {
    // TODO: swap this out for answerInvestigationQuestion once OpenAI and
    // Neo4j are wired up; falling back to canned mock responses for now.
    const answer = await answerInvestigationQuestion(question, { messages });
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ answer: getMockChatResponse(question) });
  }
}
