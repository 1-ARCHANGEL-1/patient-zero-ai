"use client";

import { people as mockPeople } from "@/lib/mockData";
import { RiskCard } from "@/components/watchlist/RiskCard";
import { useInvestigation } from "@/context/InvestigationContext";
import type { Person, RiskLevel } from "@/types";

const SECTIONS: { risk: RiskLevel; label: string; headerClass: string }[] = [
  { risk: "high", label: "High Risk", headerClass: "text-risk-high" },
  { risk: "medium", label: "Medium Risk", headerClass: "text-risk-medium" },
  { risk: "low", label: "Low Risk", headerClass: "text-risk-low" },
];

export function WatchList() {
  const { watchList } = useInvestigation();

  const monitored: Person[] = watchList
    ? watchList.map((entry) => entry.person).filter((person) => Boolean(person?.risk))
    : mockPeople.filter((person) => person.risk);

  return (
    <div className="flex flex-col gap-10">
      {SECTIONS.map((section) => {
        const entries = monitored.filter((p) => p.risk === section.risk);
        if (entries.length === 0) return null;

        return (
          <div key={section.risk}>
            <div className="mb-4 flex items-center gap-2">
              <h2 className={`text-base font-semibold ${section.headerClass}`}>
                {section.label}
              </h2>
              <span className="rounded-full bg-brand-surface px-2 py-0.5 text-xs font-medium text-brand-muted">
                {entries.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {entries.map((person) => (
                <RiskCard key={person.id} person={person} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
