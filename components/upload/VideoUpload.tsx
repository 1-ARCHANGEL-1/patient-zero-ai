"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useInvestigation } from "@/context/InvestigationContext";
import { VideoCard } from "@/components/upload/VideoCard";
import { Button } from "@/components/ui/button";

export function VideoUpload() {
  const { videos, addVideos, removeVideo, isAnalyzing, startAnalysis, freshInvestigationNotice } =
    useInvestigation();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    addVideos(Array.from(fileList));
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-brand-black">Surveillance Videos</h2>

      {freshInvestigationNotice && (
        <p className="rounded-[8px] border border-border bg-brand-surface px-3 py-2 text-xs text-brand-muted">
          Starting fresh investigation
        </p>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed px-4 py-8 text-center transition-colors ${
          isDragging ? "border-brand-red bg-red-50/40" : "border-border bg-brand-surface"
        }`}
      >
        <UploadCloud className="size-6 text-brand-muted" />
        <p className="text-sm font-medium text-brand-black">Drop videos here</p>
        <p className="text-xs text-brand-muted">or click to browse</p>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {videos.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onRemove={removeVideo} />
          ))}
        </div>
      )}

      {videos.length > 0 && (
        <Button
          type="button"
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="h-10 w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Start Analysis"
          )}
        </Button>
      )}
    </div>
  );
}
