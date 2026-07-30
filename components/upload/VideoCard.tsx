import { FileVideo, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { UploadedVideo } from "@/types";

interface VideoCardProps {
  video: UploadedVideo;
  onRemove: (id: string) => void;
}

export function VideoCard({ video, onRemove }: VideoCardProps) {
  return (
    <div className="rounded-[12px] border border-border bg-white p-3 transition-transform hover:scale-[1.01]">
      <div className="flex items-start gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-surface">
          <FileVideo className="size-4 text-brand-muted" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-brand-black">{video.name}</p>
          <p className="text-xs text-brand-muted">{video.sizeLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(video.id)}
          className="shrink-0 rounded-md p-1 text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-black"
          aria-label={`Remove ${video.name}`}
        >
          <X className="size-4" />
        </button>
      </div>

      {video.status !== "done" ? (
        <div className="mt-2.5">
          <Progress value={video.progress} className="h-1.5" />
        </div>
      ) : (
        <p className="mt-2 text-xs font-medium text-risk-low">Ready</p>
      )}
    </div>
  );
}
