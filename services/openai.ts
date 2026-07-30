/**
 * OpenAI service — reasons across multimodal video analysis results to
 * produce an exposure summary, timeline, watch list, and chat answers.
 *
 * Docs: https://platform.openai.com/docs
 */

import OpenAI from "openai";
import type { ChatMessage, ExposureTreeGraphData, TimelineEvent, WatchListEntry } from "@/types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o";

export interface ExposureSummary {
  timeline: TimelineEvent[];
  watchList: WatchListEntry[];
  summary: string;
}

function getClient() {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey: OPENAI_API_KEY });
}

const EXPOSURE_SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    timeline: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          timestamp: { type: "string" },
          summary: { type: "string" },
          videoId: { type: "string" },
          videoLabel: { type: "string" },
        },
        required: ["id", "timestamp", "summary", "videoId", "videoLabel"],
      },
    },
    watchList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          person: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              role: { type: "string" },
              risk: { type: "string", enum: ["high", "medium", "low"] },
              confidence: { type: "number" },
              contactDuration: { type: "string" },
              lastSeen: { type: "string" },
            },
            required: ["id", "name", "role"],
          },
        },
        required: ["person"],
      },
    },
  },
  required: ["summary", "timeline", "watchList"],
};

export async function generateExposureSummary(
  videoAnalyses: unknown[]
): Promise<ExposureSummary> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an infection-control investigation assistant. Reason across the provided " +
          "multi-video TwelveLabs analysis to reconstruct a timeline of Patient Zero's movements " +
          "and a risk-tiered watch list (high/medium/low) of people who may have been exposed, " +
          "with confidence scores based on contact duration and proximity.",
      },
      {
        role: "user",
        content: JSON.stringify(videoAnalyses),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "exposure_summary", schema: EXPOSURE_SUMMARY_SCHEMA },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("openai.generateExposureSummary: empty response");
  }

  return JSON.parse(content) as ExposureSummary;
}

const EXPOSURE_TREE_GRAPH_SCHEMA = {
  type: "object",
  properties: {
    patientZero: {
      type: "object",
      properties: {
        id: { type: "string" },
        label: { type: "string" },
        description: { type: "string" },
        wearing: { type: "string" },
      },
      required: ["id", "label", "description", "wearing"],
    },
    exposedPersons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          description: { type: "string" },
          wearing: { type: "string" },
          appearances: { type: "number" },
          distanceFromPatientZero: { type: "string", enum: ["close", "medium", "far"] },
          timeNearPatientZero: { type: "number" },
          riskLevel: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: [
          "id",
          "label",
          "description",
          "wearing",
          "appearances",
          "distanceFromPatientZero",
          "timeNearPatientZero",
          "riskLevel",
        ],
      },
    },
  },
  required: ["patientZero", "exposedPersons"],
};

export async function generateExposureTreeGraph(
  messages: ChatMessage[],
  videoContext?: unknown
): Promise<ExposureTreeGraphData> {
  const client = getClient();

  const history = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an infection-control investigation assistant. Using the chat history and the " +
          "surveillance footage analysis provided, identify Patient Zero and every other person " +
          'who was identified as a suspect/contact of interest during the conversation. Label ' +
          'exposed persons "Patient 1", "Patient 2", etc. in order of appearance. For each exposed ' +
          "person extract: a short description (e.g. \"Woman in Blue Jacket\"), what they are " +
          "wearing, how many times they appeared on camera, their estimated distance from Patient " +
          "Zero (close/medium/far based on how they were described), how many seconds they were " +
          "near Patient Zero, and a risk level: HIGH if contact exceeded 10 seconds or they were " +
          "described as close, MEDIUM if contact was 3-10 seconds, LOW if contact was under 3 " +
          "seconds or they were just passing by.",
      },
      {
        role: "user",
        content:
          `Chat history:\n${history}\n\n` +
          (videoContext
            ? `Surveillance footage analysis:\n${JSON.stringify(videoContext)}`
            : "No surveillance footage analysis is available yet."),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "exposure_tree_graph", schema: EXPOSURE_TREE_GRAPH_SCHEMA },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("openai.generateExposureTreeGraph: empty response");
  }

  return JSON.parse(content) as ExposureTreeGraphData;
}

export async function answerInvestigationQuestion(
  question: string,
  context: { messages: ChatMessage[]; videoContext?: unknown; graphContext?: unknown }
): Promise<string> {
  const client = getClient();

  const history = context.messages.map((message) => ({
    role: message.role === "user" ? ("user" as const) : ("assistant" as const),
    content: message.content,
  }));

  const systemPrompt =
    "You are an investigation assistant. " +
    (context.videoContext
      ? `Here is the surveillance footage analysis: ${JSON.stringify(context.videoContext)}. ` +
        "Answer questions based on this data. "
      : "") +
    "Answer concisely using the investigation context and chat history provided." +
    (context.graphContext ? `\n\nGraph context: ${JSON.stringify(context.graphContext)}` : "");

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: question }],
  });

  const answer = completion.choices[0]?.message?.content;
  if (!answer) {
    throw new Error("openai.answerInvestigationQuestion: empty response");
  }

  return answer;
}
