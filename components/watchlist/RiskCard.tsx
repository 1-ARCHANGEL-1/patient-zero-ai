import type { Person } from "@/types";
import { EvidenceButton } from "@/components/watchlist/EvidenceButton";

const AVATAR_BG: Record<NonNullable<Person["risk"]>, string> = {
  high: "bg-risk-high-bg text-risk-high",
  medium: "bg-risk-medium-bg text-risk-medium",
  low: "bg-risk-low-bg text-risk-low",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function RiskCard({ person }: { person: Person }) {
  const risk = person.risk ?? "low";

  return (
    <div className="flex items-center gap-4 rounded-[12px] border border-border bg-white p-4 transition-transform hover:scale-[1.01]">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${AVATAR_BG[risk]}`}
      >
        {initials(person.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-brand-black">{person.name}</p>
          <span className="text-xs font-medium text-brand-muted">{person.confidence}%</span>
        </div>
        <p className="mt-0.5 text-xs text-brand-muted">
          {person.contactDuration} exposure · {person.lastSeen}
        </p>
      </div>

      <EvidenceButton person={person} />
    </div>
  );
}
