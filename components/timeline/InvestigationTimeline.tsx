"use client";

import { TimelineEvent } from "@/components/timeline/TimelineEvent";
import { useInvestigation } from "@/context/InvestigationContext";

export function InvestigationTimeline() {
  const { timeline } = useInvestigation();

  return (
    <div>
      <h2 className="mb-4 text-base font-semibold text-brand-black">Investigation Timeline</h2>
      <div className="rounded-[12px] border border-border bg-white p-4">
        {timeline && timeline.length > 0 ? (
          timeline.map((event) => <TimelineEvent key={event.id} event={event} />)
        ) : (
          <p className="py-2 text-sm text-brand-muted">
            No timeline yet — upload surveillance footage and click &quot;Start Analysis&quot; to
            reconstruct the investigation timeline.
          </p>
        )}
      </div>
    </div>
  );
}
