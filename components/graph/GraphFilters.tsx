"use client";

import type { RiskLevel } from "@/types";

export type RiskFilter = "all" | RiskLevel;

interface GraphFiltersProps {
  value: RiskFilter;
  onChange: (value: RiskFilter) => void;
}

const filters: { value: RiskFilter; label: string; dot?: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High Risk", dot: "#DC2626" },
  { value: "medium", label: "Medium Risk", dot: "#D97706" },
  { value: "low", label: "Low Risk", dot: "#16A34A" },
];

export function GraphFilters({ value, onChange }: GraphFiltersProps) {
  return (
    <aside className="flex w-full flex-col gap-8 border-b border-border p-5 lg:w-[240px] lg:border-r lg:border-b-0">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-brand-black">Filters</h2>
        <div className="flex flex-col gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange(f.value)}
              className={`flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 text-left text-sm transition-colors ${
                value === f.value
                  ? "bg-brand-surface text-brand-black font-medium"
                  : "text-brand-muted hover:bg-brand-surface/60"
              }`}
            >
              {f.dot && (
                <span className="size-2 rounded-full" style={{ backgroundColor: f.dot }} />
              )}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-brand-black">Legend</h2>
        <div className="flex flex-col gap-2 text-sm text-brand-muted">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-brand-black" />
            Patient Zero
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-gray-400" />
            Person
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm border-2 border-gray-400" />
            Room
          </div>
          <div className="flex items-center gap-2">
            <span className="h-px w-3 bg-gray-400" />
            Interaction
          </div>
        </div>
      </div>
    </aside>
  );
}
