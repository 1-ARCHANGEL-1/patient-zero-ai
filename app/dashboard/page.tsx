"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { Button } from "@/components/ui/button";
import { VideoUpload } from "@/components/upload/VideoUpload";
import { InvestigationChat } from "@/components/chat/InvestigationChat";
import { InvestigationTimeline } from "@/components/timeline/InvestigationTimeline";
import { ClipReferences } from "@/components/timeline/ClipReferences";
import { ExposureTreeGraph } from "@/components/graph/ExposureTreeGraph";
import { useInvestigation } from "@/context/InvestigationContext";
import type { AnalysisStage } from "@/types";

const STAGE_LABELS: Record<AnalysisStage, string> = {
  idle: "Ready to investigate",
  watching: "Watching surveillance footage...",
  "detecting-people": "Detecting people...",
  "analyzing-movement": "Analyzing movement...",
  "finding-interactions": "Finding interactions...",
  "building-graph": "Building exposure graph...",
  "generating-watchlist": "Generating watch list...",
  ready: "Investigation ready",
};

const STAGE_PROGRESS: Record<AnalysisStage, number> = {
  idle: 0,
  watching: 15,
  "detecting-people": 30,
  "analyzing-movement": 48,
  "finding-interactions": 64,
  "building-graph": 80,
  "generating-watchlist": 92,
  ready: 100,
};

function DashboardContent() {
  const { stage, analysisError, graphData, videos, setActiveVideo } = useInvestigation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeVideo = searchParams.get("video");
  const activeTimestamp = searchParams.get("t");

  function handleGenerateWatchList() {
    if (!graphData) return;
    window.localStorage.setItem("patientZeroGraphData", JSON.stringify(graphData));
    router.push("/watchlist");
  }

  async function handleResetInvestigation() {
    try {
      await fetch("/api/graph/reset", { method: "POST" });
    } catch {
      // still proceed with the local reset below even if this fails
    }
    window.localStorage.removeItem("patientZeroGraphData");
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-500">
      <Navbar
        right={
          <button
            type="button"
            onClick={handleResetInvestigation}
            className="rounded-[8px] px-2.5 py-1 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            Reset Investigation
          </button>
        }
      />

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[280px_1fr_320px]">
        {/* Left panel */}
        <aside className="border-b border-b-border p-6 lg:border-r lg:border-r-[#D1D5DB] lg:border-b-0">
          <VideoUpload />
        </aside>

        {/* Center panel */}
        <main className="flex flex-col gap-8 p-8">
          <InvestigationChat />
          <InvestigationTimeline />

          {graphData && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-500">
              <h2 className="text-sm font-semibold text-brand-black">Exposure Graph</h2>
              <ExposureTreeGraph data={graphData} />
              <Button
                type="button"
                onClick={handleGenerateWatchList}
                size="lg"
                className="h-11 w-full text-[15px]"
              >
                Generate Watch List
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          )}
        </main>

        {/* Right panel */}
        <aside className="flex flex-col gap-5 border-t border-t-border p-5 lg:border-t-0 lg:border-l lg:border-l-[#D1D5DB]">
          <div className="flex aspect-video items-center justify-center rounded-[12px] border border-border bg-brand-dark-surface">
            <Play className="size-8 text-white/60" />
          </div>
          {activeVideo && (
            <p className="text-xs text-brand-muted">
              Viewing <span className="font-medium text-brand-black">{activeVideo}</span>
              {activeTimestamp ? ` at ${activeTimestamp}` : ""}
            </p>
          )}

          {videos.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-brand-black">Clips</h2>
              <div className="flex flex-col gap-2">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActiveVideo(video.id)}
                    className="flex items-center gap-2.5 rounded-[8px] border border-border bg-white px-3 py-2 text-left transition-colors hover:border-brand-red"
                  >
                    <Play className="size-3.5 shrink-0 text-brand-red" />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-brand-black">
                      {video.name}
                    </span>
                    <span className="shrink-0 text-xs text-brand-muted">{video.sizeLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage !== "idle" && stage !== "ready" && (
            <div className="rounded-[12px] border border-border bg-white p-4">
              <p className="text-sm font-medium text-brand-black">{STAGE_LABELS[stage]}</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-surface">
                <div
                  className="h-full rounded-full bg-brand-red transition-all duration-500"
                  style={{ width: `${STAGE_PROGRESS[stage]}%` }}
                />
              </div>
              <div className="mt-3">
                <LoadingAnimation />
              </div>
            </div>
          )}

          {stage === "ready" && (
            <p className="text-xs font-medium text-risk-low">Analysis complete</p>
          )}

          {analysisError && (
            <div className="rounded-[12px] border border-risk-high-border bg-risk-high-bg p-3 text-xs text-risk-high">
              {analysisError}
            </div>
          )}

          <ClipReferences />
        </aside>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
