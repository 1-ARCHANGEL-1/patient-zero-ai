"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { getMockChatResponse } from "@/lib/mockData";
import type {
  AnalysisStage,
  ChatMessage,
  ExposedPersonNode,
  ExposureTreeGraphData,
  TimelineEvent,
  UploadedVideo,
  WatchListEntry,
} from "@/types";

interface InvestigationContextValue {
  videos: UploadedVideo[];
  addVideos: (files: File[]) => void;
  removeVideo: (id: string) => void;

  stage: AnalysisStage;
  isAnalyzing: boolean;
  startAnalysis: () => void;

  messages: ChatMessage[];
  sendMessage: (content: string) => void;

  videoIds: string[];
  videoNames: Record<string, string>;
  videoAnalyses: unknown[];
  timeline: TimelineEvent[] | null;
  watchList: WatchListEntry[] | null;
  exposureSummary: unknown;
  analysisError: string | null;

  graphData: ExposureTreeGraphData | null;
  watchListData: ExposedPersonNode[] | null;

  activeVideoId: string | null;
  activeTimestamp: string | null;
  setActiveVideo: (videoId: string, timestamp?: string) => void;
}

const InvestigationContext = createContext<InvestigationContextValue | null>(null);

const STAGE_SEQUENCE: AnalysisStage[] = [
  "watching",
  "detecting-people",
  "analyzing-movement",
  "finding-interactions",
  "building-graph",
  "generating-watchlist",
  "ready",
];

export function InvestigationProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [videoNames, setVideoNames] = useState<Record<string, string>>({});
  const [videoAnalyses, setVideoAnalyses] = useState<unknown[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[] | null>(null);
  const [watchList, setWatchList] = useState<WatchListEntry[] | null>(null);
  const [exposureSummary, setExposureSummary] = useState<unknown>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<ExposureTreeGraphData | null>(null);
  const watchListData = graphData?.exposedPersons ?? null;
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);

  function addVideos(files: File[]) {
    const newVideos: UploadedVideo[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      progress: 0,
      status: "uploading",
      file,
    }));

    setVideos((prev) => [...prev, ...newVideos]);

    // Cosmetic progress bar only — the real pipeline is kicked off
    // separately by startAnalysis() when the user clicks "Start Analysis".
    newVideos.forEach((video) => simulateUpload(video.id, setVideos));
  }

  function removeVideo(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  async function uploadAndAnalyzeFile(file: File) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error(
          `[startAnalysis] /api/upload failed for "${file.name}" (${res.status}):`,
          body?.error ?? res.statusText
        );
        return null;
      }

      const data: { videoId?: string; analysis?: unknown } = await res.json();
      if (!data.videoId) {
        console.error(`[startAnalysis] /api/upload returned no videoId for "${file.name}"`);
        return null;
      }

      setVideoIds((prev) => [...prev, data.videoId as string]);
      setVideoNames((prev) => ({ ...prev, [data.videoId as string]: file.name }));
      return { videoId: data.videoId, analysis: data.analysis };
    } catch (error) {
      console.error(`[startAnalysis] /api/upload threw for "${file.name}":`, error);
      return null;
    }
  }

  async function startAnalysis() {
    if (isAnalyzing) return;
    const pending = videos.filter((v) => v.file);
    if (pending.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    // Runs on its own fixed schedule so the "Watching surveillance
    // footage...", "Detecting people...", etc. stages stay visible for the
    // full duration of the process, whatever the real pipeline's timing.
    runAnalysisSequence(setStage);

    try {
      const uploaded = await Promise.all(pending.map((v) => uploadAndAnalyzeFile(v.file)));
      const successful = uploaded.filter(
        (u): u is { videoId: string; analysis: unknown } => u !== null
      );

      if (successful.length === 0) {
        throw new Error(
          `None of the ${pending.length} uploaded video(s) could be indexed and analyzed by ` +
            "TwelveLabs. Check the server console for the underlying error."
        );
      }

      // Store the full TwelveLabs analysis so the chat can reference it,
      // even before /api/analyze's OpenAI reasoning step resolves.
      setVideoAnalyses((prev) => [...prev, ...successful.map((s) => s.analysis)]);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoIds: successful.map((s) => s.videoId),
          analyses: successful.map((s) => s.analysis),
        }),
      });

      if (!res.ok) {
        throw new Error(`/api/analyze responded with status ${res.status}`);
      }

      const summary: {
        timeline?: TimelineEvent[];
        watchList?: WatchListEntry[];
      } = await res.json();

      setExposureSummary(summary);
      if (Array.isArray(summary.timeline)) setTimeline(summary.timeline);
      if (Array.isArray(summary.watchList)) setWatchList(summary.watchList);
    } catch (error) {
      console.error("[startAnalysis] pipeline failed:", error);
      setAnalysisError(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setStage("ready");
      setIsAnalyzing(false);
    }
  }

  function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const history = [...messages, userMessage];
    setMessages(history);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: content,
        messages: history,
        videoContext: videoAnalyses.length > 0 ? videoAnalyses : undefined,
      }),
    })
      .then((res) => res.json())
      .then(
        (data: {
          answer?: string;
          type?: string;
          message?: string;
          graphData?: ExposureTreeGraphData;
        }) => {
          if (data.type === "graph" && data.graphData) {
            setGraphData(data.graphData);
            const reply: ChatMessage = {
              id: `msg-${Date.now()}-reply`,
              role: "assistant",
              content: data.message ?? "Exposure graph generated based on investigation.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev) => [...prev, reply]);
            return;
          }

          const reply: ChatMessage = {
            id: `msg-${Date.now()}-reply`,
            role: "assistant",
            content: data.answer ?? getMockChatResponse(content),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, reply]);
        }
      )
      .catch(() => {
        const reply: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: "assistant",
          content: getMockChatResponse(content),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, reply]);
      });
  }

  function setActiveVideo(videoId: string, timestamp?: string) {
    setActiveVideoId(videoId);
    setActiveTimestamp(timestamp ?? null);
  }

  const value = useMemo(
    () => ({
      videos,
      addVideos,
      removeVideo,
      stage,
      isAnalyzing,
      startAnalysis,
      messages,
      sendMessage,
      videoIds,
      videoNames,
      videoAnalyses,
      timeline,
      watchList,
      exposureSummary,
      analysisError,
      graphData,
      watchListData,
      activeVideoId,
      activeTimestamp,
      setActiveVideo,
    }),
    [
      videos,
      stage,
      isAnalyzing,
      messages,
      videoIds,
      videoNames,
      videoAnalyses,
      timeline,
      watchList,
      exposureSummary,
      analysisError,
      graphData,
      watchListData,
      activeVideoId,
      activeTimestamp,
    ]
  );

  return (
    <InvestigationContext.Provider value={value}>{children}</InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const ctx = useContext(InvestigationContext);
  if (!ctx) {
    throw new Error("useInvestigation must be used within an InvestigationProvider");
  }
  return ctx;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function simulateUpload(id: string, setVideos: React.Dispatch<React.SetStateAction<UploadedVideo[]>>) {
  const interval = setInterval(() => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== id || v.status !== "uploading") return v;
        const nextProgress = Math.min(v.progress + 12 + Math.random() * 10, 100);
        if (nextProgress >= 100) {
          return { ...v, progress: 100, status: "done" };
        }
        return { ...v, progress: nextProgress };
      })
    );
  }, 350);

  setTimeout(() => {
    clearInterval(interval);
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, progress: 100, status: "done" } : v))
    );
  }, 3200);
}

function runAnalysisSequence(setStage: React.Dispatch<React.SetStateAction<AnalysisStage>>) {
  STAGE_SEQUENCE.forEach((s, i) => {
    setTimeout(() => setStage(s), i * 900);
  });
}
