/**
 * OpenAI service — reasons across multimodal video analysis results to
 * produce an exposure summary, timeline, watch list, and chat answers.
 *
 * Docs: https://platform.openai.com/docs
 */

import type { ChatMessage, TimelineEvent, WatchListEntry } from "@/types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o";

export interface ExposureSummary {
  timeline: TimelineEvent[];
  watchList: WatchListEntry[];
  summary: string;
}

export async function generateExposureSummary(
  _videoAnalyses: unknown[]
): Promise<ExposureSummary> {
  // TODO: Call gpt-4o with the combined TwelveLabs analysis payload and
  // a structured-output schema to produce timeline + watch list + summary.
  throw new Error("openai.generateExposureSummary: not implemented");
}

export async function answerInvestigationQuestion(
  _question: string,
  _context: { messages: ChatMessage[]; graphContext?: unknown }
): Promise<string> {
  // TODO: Call gpt-4o with chat history plus Neo4j graph context
  // (see services/neo4j.ts) to answer investigator questions.
  throw new Error("openai.answerInvestigationQuestion: not implemented");
}
