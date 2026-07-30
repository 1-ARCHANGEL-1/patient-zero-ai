"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { ExposedPersonCard } from "@/components/watchlist/ExposedPersonCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockExposureTreeGraph } from "@/lib/mockData";
import type { ExposedPersonNode, ExposureTreeGraphData } from "@/types";

const SECTIONS: {
  risk: ExposedPersonNode["riskLevel"];
  label: string;
  headerClass: string;
  badgeLabel: string;
}[] = [
  {
    risk: "high",
    label: "Quarantine",
    headerClass: "text-risk-high",
    badgeLabel: "Quarantine Required",
  },
  {
    risk: "medium",
    label: "Monitor",
    headerClass: "text-risk-medium",
    badgeLabel: "Under Monitoring",
  },
  {
    risk: "low",
    label: "Out of Danger",
    headerClass: "text-risk-low",
    badgeLabel: "Out of Danger Zone",
  },
];

export default function WatchListPage() {
  const [graphData, setGraphData] = useState<ExposureTreeGraphData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/graph");
        const data = await res.json();
        if (data) {
          setGraphData(data);
          return;
        }
      } catch {
        // Neo4j/network unreachable — fall through to localStorage below.
      }

      const stored = window.localStorage.getItem("patientZeroGraphData");
      if (stored) {
        try {
          setGraphData(JSON.parse(stored));
          return;
        } catch {
          // fall through to mock data below
        }
      }

      setGraphData(mockExposureTreeGraph);
    }

    load();
  }, []);

  if (!graphData) return null;

  const persons = graphData.exposedPersons;
  const highCount = persons.filter((p) => p.riskLevel === "high").length;
  const mediumCount = persons.filter((p) => p.riskLevel === "medium").length;
  const lowCount = persons.filter((p) => p.riskLevel === "low").length;

  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-500">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-brand-black">Watch List</h1>
            <p className="mt-1.5 text-sm text-brand-muted">
              Individuals identified for monitoring based on exposure analysis
            </p>
          </div>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}>
            Back to Investigation
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryStat label="Total identified" value={persons.length} />
          <SummaryStat label="High risk" value={highCount} valueClass="text-risk-high" />
          <SummaryStat label="Medium risk" value={mediumCount} valueClass="text-risk-medium" />
          <SummaryStat label="Low risk" value={lowCount} valueClass="text-risk-low" />
        </div>

        <div className="mt-10 flex flex-col gap-10">
          {SECTIONS.map((section) => {
            const entries = persons
              .filter((p) => p.riskLevel === section.risk)
              .sort((a, b) => b.timeNearPatientZero - a.timeNearPatientZero);
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
                    <ExposedPersonCard
                      key={person.id}
                      person={person}
                      badgeLabel={section.badgeLabel}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[12px] border border-border bg-white p-4">
      <p className={`text-2xl font-semibold ${valueClass ?? "text-brand-black"}`}>{value}</p>
      <p className="mt-0.5 text-xs text-brand-muted">{label}</p>
    </div>
  );
}
