import Link from "next/link";
import type { TimelineEvent as TimelineEventType } from "@/types";

export function TimelineEvent({ event }: { event: TimelineEventType }) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div className="absolute top-1.5 bottom-0 left-[7px] w-px bg-border last:hidden" />
      <div className="relative z-10 mt-1.5 size-[15px] shrink-0 rounded-full border-2 border-brand-red bg-white" />
      <div className="min-w-0 flex-1 border-l-[3px] border-brand-red py-0.5 pb-1 pl-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tabular-nums text-brand-black">
            {event.timestamp}
          </span>
          <Link
            href={`/dashboard?video=${event.videoId}&t=${event.timestamp}`}
            className="text-xs text-brand-muted underline-offset-2 hover:text-brand-red hover:underline"
          >
            {event.videoLabel}
          </Link>
        </div>
        <p className="mt-0.5 text-sm text-brand-black">{event.summary}</p>
      </div>
    </div>
  );
}
