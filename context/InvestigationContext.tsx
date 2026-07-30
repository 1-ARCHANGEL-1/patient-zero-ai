"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { AnalysisStage, ChatMessage, UploadedVideo } from "@/types";

interface InvestigationContextValue {
  videos: UploadedVideo[];
  addVideos: (files: File[]) => void;
  removeVideo: (id: string) => void;

  stage: AnalysisStage;

  messages: ChatMessage[];
  sendMessage: (content: string) => void;

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);

  function addVideos(files: File[]) {
    const newVideos: UploadedVideo[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      progress: 0,
      status: "uploading",
    }));

    setVideos((prev) => [...prev, ...newVideos]);

    newVideos.forEach((video) => simulateUpload(video.id, setVideos, setStage));
  }

  function removeVideo(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);

    import("@/lib/mockData").then(({ getMockChatResponse }) => {
      const reply: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: "assistant",
        content: getMockChatResponse(content),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, reply]);
      }, 600);
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
      messages,
      sendMessage,
      activeVideoId,
      activeTimestamp,
      setActiveVideo,
    }),
    [videos, stage, messages, activeVideoId, activeTimestamp]
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

function simulateUpload(
  id: string,
  setVideos: React.Dispatch<React.SetStateAction<UploadedVideo[]>>,
  setStage: React.Dispatch<React.SetStateAction<AnalysisStage>>
) {
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
    runAnalysisSequence(setStage);
  }, 3200);
}

function runAnalysisSequence(setStage: React.Dispatch<React.SetStateAction<AnalysisStage>>) {
  STAGE_SEQUENCE.forEach((s, i) => {
    setTimeout(() => setStage(s), i * 900);
  });
}
