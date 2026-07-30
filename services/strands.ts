/**
 * Strands Agents service — orchestrates the multi-step investigation
 * workflow (TwelveLabs extraction → OpenAI reasoning → Neo4j storage).
 *
 * Docs: https://strandsagents.com
 */

import { z } from "zod";
import { Agent, tool } from "@strands-agents/sdk";
import { OpenAIModel } from "@strands-agents/sdk/models/openai";
import { analyzeVideo } from "@/services/twelvelabs";
import { generateExposureSummary, type ExposureSummary } from "@/services/openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export type WorkflowStage =
  | "watching"
  | "detecting-people"
  | "analyzing-movement"
  | "finding-interactions"
  | "building-graph"
  | "generating-watchlist"
  | "ready";

export interface WorkflowRun {
  investigationId: string;
  stage: WorkflowStage;
}

const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  risk: z.enum(["high", "medium", "low"]).optional(),
  confidence: z.number().optional(),
  contactDuration: z.string().optional(),
  lastSeen: z.string().optional(),
});

const exposureSummarySchema = z.object({
  summary: z.string(),
  timeline: z.array(
    z.object({
      id: z.string(),
      timestamp: z.string(),
      summary: z.string(),
      videoId: z.string(),
      videoLabel: z.string(),
    })
  ),
  watchList: z.array(z.object({ person: personSchema })),
});

const analyzeSurveillanceVideo = tool({
  name: "analyzeSurveillanceVideo",
  description:
    "Runs TwelveLabs Pegasus analysis on an already-indexed surveillance video to extract " +
    "people, rooms, actions, and timestamps.",
  inputSchema: z.object({ videoId: z.string().describe("TwelveLabs video id") }),
  callback: async ({ videoId }) => {
    const analysis = await analyzeVideo(videoId);
    return analysis as unknown as Record<string, unknown>;
  },
});

const generateExposureSummaryTool = tool({
  name: "generateExposureSummary",
  description:
    "Reasons with gpt-4o across combined TwelveLabs video analyses to produce an exposure " +
    "timeline and a risk-tiered watch list.",
  inputSchema: z.object({
    videoAnalyses: z.array(z.unknown()).describe("Array of TwelveLabs video analysis objects"),
  }),
  callback: async ({ videoAnalyses }) => {
    const summary = await generateExposureSummary(videoAnalyses);
    return summary as unknown as Record<string, unknown>;
  },
});

const buildKnowledgeGraph = tool({
  name: "buildKnowledgeGraph",
  description: "Persists the exposure summary into the Neo4j knowledge graph.",
  inputSchema: z.object({ investigationId: z.string() }),
  callback: async ({ investigationId }) => {
    // TODO: wire up services/neo4j.ts (upsertExposureEvent) once Neo4j
    // credentials are configured — this is a placeholder for now.
    console.log(
      `[strands] buildKnowledgeGraph: TODO — persist exposure graph for investigation ${investigationId}`
    );
    return { status: "not_implemented" };
  },
});

function createInvestigationAgent() {
  const model = new OpenAIModel({ api: "chat", modelId: "gpt-4o", apiKey: OPENAI_API_KEY });

  return new Agent({
    model,
    systemPrompt:
      "You are the Patient Zero AI investigation agent. Given a list of TwelveLabs video ids, " +
      "call analyzeSurveillanceVideo for each one, then call generateExposureSummary with the " +
      "combined analyses to produce the final exposure summary. Call buildKnowledgeGraph once " +
      "the summary is ready to persist the results.",
    tools: [analyzeSurveillanceVideo, generateExposureSummaryTool, buildKnowledgeGraph],
    structuredOutputSchema: exposureSummarySchema,
  });
}

export async function runInvestigationWorkflow(
  investigationId: string,
  videoIds: string[]
): Promise<ExposureSummary> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (videoIds.length === 0) {
    throw new Error("strands.runInvestigationWorkflow: no videoIds provided");
  }

  const agent = createInvestigationAgent();
  const result = await agent.invoke(
    `Investigation id: ${investigationId}. Analyze these TwelveLabs video ids and produce the ` +
      `exposure summary: ${videoIds.join(", ")}`
  );

  if (!result.structuredOutput) {
    throw new Error("strands.runInvestigationWorkflow: agent did not return structured output");
  }

  return result.structuredOutput as ExposureSummary;
}
