"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Play } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { VideoUpload } from "@/components/upload/VideoUpload";
import { InvestigationChat } from "@/components/chat/InvestigationChat";
import { InvestigationTimeline } from "@/components/timeline/InvestigationTimeline";
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
  const { stage } = useInvestigation();
  const searchParams = useSearchParams();
  const activeVideo = searchParams.get("video");
  const activeTimestamp = searchParams.get("t");

  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-500">
      <Navbar right={<StatusBadge label="Ready" tone="green" />} />

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[280px_1fr_320px]">
        {/* Left panel */}
        <aside className="border-b border-border p-5 lg:border-r lg:border-b-0">
          <VideoUpload />
        </aside>

        {/* Center panel */}
        <main className="flex flex-col gap-8 p-6">
          <InvestigationChat />
          <InvestigationTimeline />
        </main>

        {/* Right panel */}
        <aside className="flex flex-col gap-5 border-t border-border p-5 lg:border-t-0 lg:border-l">
          <div className="flex aspect-video items-center justify-center rounded-[12px] border border-border bg-brand-dark-surface">
            <Play className="size-8 text-white/60" />
          </div>
          {activeVideo && (
            <p className="text-xs text-brand-muted">
              Viewing <span className="font-medium text-brand-black">{activeVideo}</span>
              {activeTimestamp ? ` at ${activeTimestamp}` : ""}
            </p>
          )}

          <div className="rounded-[12px] border border-border bg-white p-4">
            <p className="text-sm font-medium text-brand-black">{STAGE_LABELS[stage]}</p>
            {stage !== "idle" && (
              <>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-surface">
                  <div
                    className="h-full rounded-full bg-brand-red transition-all duration-500"
                    style={{ width: `${STAGE_PROGRESS[stage]}%` }}
                  />
                </div>
                {stage !== "ready" && (
                  <div className="mt-3">
                    <LoadingAnimation />
                  </div>
                )}
              </>
            )}
          </div>
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
