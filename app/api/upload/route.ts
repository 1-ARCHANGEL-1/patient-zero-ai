import { NextResponse } from "next/server";
import { indexVideo, analyzeVideo } from "@/services/twelvelabs";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  try {
    // indexVideo uploads the file to TwelveLabs and polls (via
    // client.tasks.waitForDone) until indexing status is "ready", so by the
    // time this resolves the video is fully ready to analyze.
    const { videoId } = await indexVideo(file);
    const analysis = await analyzeVideo(videoId);
    return NextResponse.json({ videoId, analysis });
  } catch (error) {
    console.error("[api/upload] TwelveLabs pipeline failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 502 }
    );
  }
}
