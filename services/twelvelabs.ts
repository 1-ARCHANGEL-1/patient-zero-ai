/**
 * TwelveLabs service — extracts people, objects, rooms, actions, speech,
 * OCR, and timestamps from surveillance video footage.
 *
 * Docs: https://docs.twelvelabs.io
 */

import { TwelveLabs } from "twelvelabs-js";

const TWELVELABS_API_KEY = process.env.TWELVELABS_API_KEY;
const TWELVELABS_INDEX_ID = process.env.TWELVELABS_INDEX_ID;

export interface VideoIndexResult {
  videoId: string;
  indexId: string;
}

export interface DetectedEntity {
  type: "person" | "object" | "room";
  label: string;
  confidence: number;
  startTime: number;
  endTime: number;
}

export interface VideoAnalysis {
  videoId: string;
  entities: DetectedEntity[];
  transcript?: string;
  ocrText?: string[];
}

function getClient() {
  if (!TWELVELABS_API_KEY) {
    throw new Error("TWELVELABS_API_KEY is not set");
  }
  return new TwelveLabs({ apiKey: TWELVELABS_API_KEY });
}

export async function indexVideo(file: File | Blob): Promise<VideoIndexResult> {
  if (!TWELVELABS_INDEX_ID) {
    throw new Error("TWELVELABS_INDEX_ID is not set");
  }

  const client = getClient();
  const task = await client.tasks.create({
    indexId: TWELVELABS_INDEX_ID,
    videoFile: file as File,
  });

  if (!task.id) {
    throw new Error("twelvelabs.indexVideo: task creation did not return an id");
  }

  const completed = await client.tasks.waitForDone(task.id, { sleepInterval: 5 });

  if (completed.status !== "ready" || !completed.videoId) {
    throw new Error(`twelvelabs.indexVideo: indexing finished with status "${completed.status}"`);
  }

  return { videoId: completed.videoId, indexId: TWELVELABS_INDEX_ID };
}

const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    entities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["person", "object", "room"] },
          label: { type: "string" },
          confidence: { type: "number" },
          startTime: { type: "number" },
          endTime: { type: "number" },
        },
        required: ["type", "label", "confidence", "startTime", "endTime"],
      },
    },
    transcript: { type: "string" },
  },
  required: ["entities"],
};

export async function analyzeVideo(videoId: string): Promise<VideoAnalysis> {
  const client = getClient();

  const response = await client.analyze({
    videoId,
    prompt:
      "Identify every person, notable object, and room/location visible in this surveillance " +
      "video, along with the actions taking place and the approximate start/end timestamps " +
      "(in seconds) for each. Include a transcript of any spoken audio if present.",
    responseFormat: { type: "json_schema", jsonSchema: ANALYSIS_SCHEMA },
  });

  if (!response.data) {
    throw new Error("twelvelabs.analyzeVideo: empty response from Pegasus");
  }

  const parsed = JSON.parse(response.data) as {
    entities?: DetectedEntity[];
    transcript?: string;
  };

  return {
    videoId,
    entities: parsed.entities ?? [],
    transcript: parsed.transcript,
  };
}

export async function searchAcrossVideos(
  query: string,
  videoIds: string[]
): Promise<DetectedEntity[]> {
  if (!TWELVELABS_INDEX_ID) {
    throw new Error("TWELVELABS_INDEX_ID is not set");
  }

  const client = getClient();
  const results = await client.search.create({
    indexId: TWELVELABS_INDEX_ID,
    queryText: query,
    searchOptions: ["visual", "audio", "transcription"],
    filter: videoIds.length > 0 ? JSON.stringify({ id: videoIds }) : undefined,
  });

  return (results.data ?? []).map((item) => ({
    type: "person",
    label: item.transcription ?? item.videoId ?? "match",
    confidence: item.rank ? Math.max(0, 1 - (item.rank - 1) / 10) : 0.5,
    startTime: item.start ?? 0,
    endTime: item.end ?? 0,
  }));
}
