/**
 * Neo4j service — stores and queries people, locations, interactions, and
 * exposure events as a graph for the Exposure Graph page and chat context.
 *
 * Docs: https://neo4j.com/docs/javascript-manual/current/
 */

import type { GraphEdge, GraphNode } from "@/types";

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

export interface ExposureGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export async function upsertExposureEvent(_event: {
  personId: string;
  roomId: string;
  timestamp: string;
  videoId: string;
}): Promise<void> {
  // TODO: MERGE Person/Room/Interaction nodes and relationships using the
  // official neo4j-driver, keyed by investigation/session id.
  throw new Error("neo4j.upsertExposureEvent: not implemented");
}

export async function getExposureGraph(_investigationId: string): Promise<ExposureGraphData> {
  // TODO: Query the graph for all people, rooms, and interactions linked
  // to the given investigation, and shape it into GraphNode/GraphEdge form.
  throw new Error("neo4j.getExposureGraph: not implemented");
}

export async function findExposurePath(
  _fromPersonId: string,
  _toPersonId: string
): Promise<GraphEdge[]> {
  // TODO: Run a shortestPath / variable-length relationship query between
  // two people to explain how exposure could have propagated.
  throw new Error("neo4j.findExposurePath: not implemented");
}
