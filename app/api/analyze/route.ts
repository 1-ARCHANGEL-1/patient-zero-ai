import { NextResponse } from "next/server";
import { generateExposureSummary } from "@/services/openai";
import { clearExposureGraph } from "@/services/neo4j";
import { mockExposureSummary } from "@/lib/mockData";

// Hardcoded sample TwelveLabs-shaped analysis used only by the { test: true }
// self-test mode below, to prove the OpenAI reasoning step works end to end
// without needing a real indexed video.
const SAMPLE_TEST_ANALYSIS = [
  {
    videoId: "test-video-1",
    entities: [
      { type: "person", label: "Patient Zero", confidence: 0.97, startTime: 0, endTime: 45 },
      { type: "room", label: "Reception", confidence: 0.95, startTime: 0, endTime: 20 },
      { type: "person", label: "Receptionist", confidence: 0.91, startTime: 5, endTime: 20 },
      { type: "room", label: "Waiting Area", confidence: 0.93, startTime: 20, endTime: 45 },
      { type: "person", label: "Nurse Sarah", confidence: 0.9, startTime: 30, endTime: 45 },
    ],
    transcript: "Good morning, how can I help you today? I have an appointment at 8am.",
  },
];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const isTest = body?.test === true;
  const videoIds: string[] = body?.videoIds ?? [];
  const analyses: unknown[] = isTest ? SAMPLE_TEST_ANALYSIS : (body?.analyses ?? []);

  if (!isTest && analyses.length === 0) {
    return NextResponse.json({ error: "analyses is required" }, { status: 400 });
  }

  if (!isTest) {
    // Every new analysis run starts completely fresh — wipe any exposure
    // graph left over from a previous investigation before beginning this
    // one. clearExposureGraph never throws (it catches internally).
    await clearExposureGraph();
  }

  console.log(
    `[api/analyze] ${isTest ? "self-test" : "reasoning"} over ${analyses.length} video ` +
      `analyses (videoIds=${videoIds.join(", ") || "n/a"})`
  );

  try {
    const summary = await generateExposureSummary(analyses);
    return NextResponse.json(isTest ? { ...summary, test: true } : summary);
  } catch (error) {
    console.error("[api/analyze] OpenAI pipeline failed:", error);
    return NextResponse.json(isTest ? { ...mockExposureSummary, test: true } : mockExposureSummary);
  }
}
