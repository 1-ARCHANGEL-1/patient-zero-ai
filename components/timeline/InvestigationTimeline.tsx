import { timeline } from "@/lib/mockData";
import { TimelineEvent } from "@/components/timeline/TimelineEvent";

export function InvestigationTimeline() {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-brand-black">Investigation Timeline</h2>
      <div className="rounded-[12px] border border-border bg-white p-4">
        {timeline.map((event) => (
          <TimelineEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
