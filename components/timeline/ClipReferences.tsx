"use client";

import { useInvestigation } from "@/context/InvestigationContext";
import type { TimelineEvent } from "@/types";

interface Clip {
  videoId: string;
  label: string;
  events: TimelineEvent[];
}

function groupByVideo(timeline: TimelineEvent[], videoNames: Record<string, string>): Clip[] {
  const byVideo = new Map<string, Clip>();

  for (const event of timeline) {
    const existing = byVideo.get(event.videoId);
    if (existing) {
      existing.events.push(event);
    } else {
      byVideo.set(event.videoId, {
        videoId: event.videoId,
        label: videoNames[event.videoId] ?? event.videoLabel,
        events: [event],
      });
    }
  }

  return Array.from(byVideo.values());
}

export function ClipReferences() {
  const { timeline, videoNames } = useInvestigation();

  if (!timeline || timeline.length === 0) return null;

  const clips = groupByVideo(timeline, videoNames);

  return (
    <div className="rounded-[12px] border border-border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-brand-black">Clips</h2>
      <div className="flex flex-col gap-3">
        {clips.map((clip) => (
          <div key={clip.videoId} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
            <p className="truncate text-sm font-medium text-brand-black">{clip.label}</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {clip.events.map((event) => (
                <li key={event.id} className="text-xs text-brand-muted">
                  <span className="font-medium text-brand-black">{event.timestamp}</span>{" "}
                  {event.summary}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
