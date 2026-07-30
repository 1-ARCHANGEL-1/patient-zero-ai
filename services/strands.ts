/**
 * Strands Agents service — orchestrates the multi-step investigation
 * workflow (TwelveLabs extraction → OpenAI reasoning → Neo4j storage).
 *
 * Placeholder only for this hackathon build.
 * Docs: https://strandsagents.com
 */

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

export async function runInvestigationWorkflow(
  _investigationId: string,
  _videoIds: string[]
): Promise<WorkflowRun> {
  // TODO: Define a Strands agent workflow that chains twelvelabs.ts ->
  // openai.ts -> neo4j.ts calls and streams stage updates to the client.
  throw new Error("strands.runInvestigationWorkflow: not implemented");
}
