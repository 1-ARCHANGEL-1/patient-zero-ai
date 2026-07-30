import type {
  Person,
  GraphNode,
  GraphEdge,
  TimelineEvent,
} from "@/types";

export const people: Person[] = [
  {
    id: "patient-zero",
    name: "Patient Zero",
    role: "Index case",
    isPatientZero: true,
  },
  {
    id: "nurse-sarah",
    name: "Nurse Sarah",
    role: "Nurse",
    risk: "high",
    confidence: 94,
    contactDuration: "8 min 32 sec",
    lastSeen: "Room 203 · 08:14",
  },
  {
    id: "dr-mehta",
    name: "Dr. Mehta",
    role: "Physician",
    risk: "high",
    confidence: 89,
    contactDuration: "4 min 17 sec",
    lastSeen: "Corridor B · 08:22",
  },
  {
    id: "receptionist",
    name: "Receptionist",
    role: "Front desk",
    risk: "medium",
    confidence: 72,
    contactDuration: "1 min 45 sec",
    lastSeen: "Reception · 08:05",
  },
  {
    id: "visitor-a",
    name: "Visitor A",
    role: "Visitor",
    risk: "medium",
    confidence: 68,
    contactDuration: "2 min 10 sec",
    lastSeen: "Waiting Area · 08:09",
  },
  {
    id: "visitor-b",
    name: "Visitor B",
    role: "Visitor",
    risk: "low",
    confidence: 45,
    contactDuration: "0 min 32 sec",
    lastSeen: "Waiting Area · 08:11",
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: "evt-1",
    timestamp: "08:03",
    summary: "Patient enters reception",
    videoId: "cam-reception",
    videoLabel: "Reception Camera",
  },
  {
    id: "evt-2",
    timestamp: "08:05",
    summary: "Speaks with receptionist",
    videoId: "cam-reception",
    videoLabel: "Reception Camera",
  },
  {
    id: "evt-3",
    timestamp: "08:09",
    summary: "Moves to waiting area",
    videoId: "cam-waiting",
    videoLabel: "Waiting Area Camera",
  },
  {
    id: "evt-4",
    timestamp: "08:14",
    summary: "Nurse Sarah approaches",
    videoId: "cam-waiting",
    videoLabel: "Waiting Area Camera",
  },
  {
    id: "evt-5",
    timestamp: "08:22",
    summary: "Meets Dr. Mehta in corridor",
    videoId: "cam-corridor-b",
    videoLabel: "Corridor B Camera",
  },
  {
    id: "evt-6",
    timestamp: "08:31",
    summary: "Patient leaves",
    videoId: "cam-corridor-b",
    videoLabel: "Corridor B Camera",
  },
];

export const graphNodes: GraphNode[] = [
  { id: "patient-zero", label: "Patient Zero", type: "patient-zero" },
  {
    id: "nurse-sarah",
    label: "Nurse Sarah",
    type: "person",
    risk: "high",
    confidence: 94,
    timestamp: "08:14",
  },
  {
    id: "dr-mehta",
    label: "Dr. Mehta",
    type: "person",
    risk: "high",
    confidence: 89,
    timestamp: "08:22",
  },
  {
    id: "receptionist",
    label: "Receptionist",
    type: "person",
    risk: "medium",
    confidence: 72,
    timestamp: "08:05",
  },
  {
    id: "visitor-a",
    label: "Visitor A",
    type: "person",
    risk: "medium",
    confidence: 68,
    timestamp: "08:09",
  },
  {
    id: "visitor-b",
    label: "Visitor B",
    type: "person",
    risk: "low",
    confidence: 45,
    timestamp: "08:11",
  },
  { id: "room-reception", label: "Reception", type: "room" },
  { id: "room-waiting", label: "Waiting Area", type: "room" },
  { id: "room-203", label: "Room 203", type: "room" },
  { id: "room-corridor-b", label: "Corridor B", type: "room" },
];

export const graphEdges: GraphEdge[] = [
  {
    id: "e1",
    source: "patient-zero",
    target: "room-reception",
    relationship: "entered",
  },
  {
    id: "e2",
    source: "patient-zero",
    target: "receptionist",
    relationship: "spoke with",
  },
  {
    id: "e3",
    source: "patient-zero",
    target: "room-waiting",
    relationship: "moved to",
  },
  {
    id: "e4",
    source: "patient-zero",
    target: "nurse-sarah",
    relationship: "approached by",
  },
  {
    id: "e5",
    source: "nurse-sarah",
    target: "room-203",
    relationship: "assessed in",
  },
  {
    id: "e6",
    source: "patient-zero",
    target: "dr-mehta",
    relationship: "met in corridor",
  },
  {
    id: "e7",
    source: "dr-mehta",
    target: "room-corridor-b",
    relationship: "examined in",
  },
  {
    id: "e8",
    source: "patient-zero",
    target: "visitor-a",
    relationship: "shared waiting area",
  },
  {
    id: "e9",
    source: "patient-zero",
    target: "visitor-b",
    relationship: "shared waiting area",
  },
];

export const suggestedQuestions: string[] = [
  "Who interacted with Patient Zero?",
  "Which rooms were visited?",
  "Who should be monitored?",
  "Generate exposure graph",
  "Who entered Room 203 after Patient Zero?",
];

export function getMockChatResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("interact")) {
    return "Patient Zero had direct contact with 5 individuals: the receptionist (08:05), Nurse Sarah (08:14), Dr. Mehta (08:22), and two visitors in the waiting area. Nurse Sarah and Dr. Mehta show the highest exposure confidence.";
  }
  if (q.includes("room")) {
    return "Four rooms were visited during the exposure window: Reception (08:03), Waiting Area (08:09), Room 203 (08:14, Nurse Sarah's assessment), and Corridor B (08:22, Dr. Mehta encounter).";
  }
  if (q.includes("monitor") || q.includes("watch")) {
    return "Based on contact duration and proximity, Nurse Sarah (94% confidence) and Dr. Mehta (89% confidence) should be prioritized for monitoring, followed by the receptionist and Visitor A at medium risk.";
  }
  if (q.includes("graph")) {
    return "Exposure graph generated. Patient Zero is the central node, connected to 5 people across 4 rooms. Open the Exposure Graph page to explore relationships and confidence scores.";
  }
  if (q.includes("203")) {
    return "Nurse Sarah entered Room 203 at 08:14, shortly after Patient Zero's assessment there. No other individuals were detected entering Room 203 during the exposure window.";
  }
  return "Based on the surveillance footage analyzed so far, I've identified 5 individuals with potential exposure to Patient Zero across 4 locations. Ask about specific people, rooms, or timestamps for more detail.";
}
