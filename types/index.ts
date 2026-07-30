export type RiskLevel = "high" | "medium" | "low";

export interface Person {
  id: string;
  name: string;
  role: string;
  isPatientZero?: boolean;
  risk?: RiskLevel;
  confidence?: number; // 0-100
  contactDuration?: string; // e.g. "8 min 32 sec"
  lastSeen?: string; // e.g. "Room 203 · 08:14"
}

export interface Room {
  id: string;
  name: string;
}

export type GraphNodeType = "patient-zero" | "person" | "room";

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  risk?: RiskLevel;
  confidence?: number;
  timestamp?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  timestamp?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  summary: string;
  videoId: string;
  videoLabel: string;
}

export interface WatchListEntry {
  person: Person;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type UploadStatus = "uploading" | "processing" | "done" | "error";

export interface UploadedVideo {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number; // 0-100
  status: UploadStatus;
  file: File;
}

export type AnalysisStage =
  | "idle"
  | "watching"
  | "detecting-people"
  | "analyzing-movement"
  | "finding-interactions"
  | "building-graph"
  | "generating-watchlist"
  | "ready";

export type ExposureDistance = "close" | "medium" | "far";

export interface PatientZeroNode {
  id: string;
  label: string;
  description: string;
  wearing: string;
}

export interface ExposedPersonNode {
  id: string;
  label: string;
  description: string;
  wearing: string;
  appearances: number;
  distanceFromPatientZero: ExposureDistance;
  timeNearPatientZero: number; // seconds
  riskLevel: RiskLevel;
}

export interface ExposureTreeGraphData {
  patientZero: PatientZeroNode;
  exposedPersons: ExposedPersonNode[];
}
