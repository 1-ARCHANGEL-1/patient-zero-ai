import { User } from "lucide-react";
import type { ExposedPersonNode } from "@/types";

const AVATAR_BG: Record<ExposedPersonNode["riskLevel"], string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
};

const BADGE_CLASS: Record<ExposedPersonNode["riskLevel"], string> = {
  high: "bg-risk-high-bg text-risk-high border-risk-high-border",
  medium: "bg-risk-medium-bg text-risk-medium border-risk-medium-border",
  low: "bg-risk-low-bg text-risk-low border-risk-low-border",
};

interface ExposedPersonCardProps {
  person: ExposedPersonNode;
  badgeLabel: string;
}

export function ExposedPersonCard({ person, badgeLabel }: ExposedPersonCardProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-border bg-white p-4 transition-transform hover:scale-[1.01]">
      <div
        className={`flex size-14 shrink-0 items-center justify-center rounded-full text-white ${AVATAR_BG[person.riskLevel]}`}
      >
        <User className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-sm font-semibold text-brand-black">{person.label}</p>
          <span className="text-xs text-brand-muted">{person.description}</span>
        </div>
        <p className="mt-1 text-xs text-brand-muted">
          Wearing: <span className="text-brand-black">{person.wearing}</span>
        </p>
        <p className="mt-0.5 text-xs text-brand-muted">
          {person.timeNearPatientZero}s near Patient Zero · {person.appearances} appearance
          {person.appearances === 1 ? "" : "s"} · {capitalize(person.distanceFromPatientZero)} distance
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${BADGE_CLASS[person.riskLevel]}`}
      >
        {badgeLabel}
      </span>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
