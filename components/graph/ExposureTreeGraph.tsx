"use client";

import { useState } from "react";
import { User, X } from "lucide-react";
import type { ExposedPersonNode, ExposureTreeGraphData } from "@/types";

const RISK_COLOR: Record<ExposedPersonNode["riskLevel"], string> = {
  high: "#DC2626",
  medium: "#D97706",
  low: "#16A34A",
};

const STEM_WIDTH: Record<ExposedPersonNode["riskLevel"], string> = {
  high: "3px",
  medium: "2px",
  low: "1px",
};

interface ExposureTreeGraphProps {
  data: ExposureTreeGraphData;
}

export function ExposureTreeGraph({ data }: ExposureTreeGraphProps) {
  const [selected, setSelected] = useState<ExposedPersonNode | null>(null);

  return (
    <div className="rounded-[12px] border border-border bg-white px-6 py-10">
      <div className="flex flex-col items-center">
        {/* Patient Zero node */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-black text-white">
            <User className="size-7" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-brand-black">Patient Zero</p>
            <p className="text-xs text-brand-muted">{data.patientZero.description}</p>
          </div>
        </div>

        {data.exposedPersons.length > 0 && (
          <>
            <div className="h-8 w-px bg-border" />

            <div className="flex w-full flex-wrap justify-center gap-x-8 gap-y-10 border-t border-border pt-0">
              {data.exposedPersons.map((person) => (
                <div key={person.id} className="flex flex-col items-center">
                  <div
                    className="h-8"
                    style={{ width: STEM_WIDTH[person.riskLevel], backgroundColor: RISK_COLOR[person.riskLevel] }}
                  />
                  <button
                    type="button"
                    onClick={() => setSelected(person)}
                    className="flex flex-col items-center gap-2 pt-2 transition-transform hover:scale-[1.03]"
                  >
                    <div
                      className="flex size-14 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: RISK_COLOR[person.riskLevel] }}
                    >
                      <User className="size-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-brand-black">{person.label}</p>
                      <p className="max-w-[120px] truncate text-xs text-brand-muted">
                        {person.description}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-[12px] border border-border bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: RISK_COLOR[selected.riskLevel] }}
                >
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-black">{selected.label}</p>
                  <p className="text-xs text-brand-muted">{selected.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="shrink-0 text-brand-muted transition-colors hover:text-brand-black"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm">
              <DetailRow label="Wearing" value={selected.wearing} />
              <DetailRow label="Appearances" value={`${selected.appearances}`} />
              <DetailRow
                label="Distance from Patient Zero"
                value={capitalize(selected.distanceFromPatientZero)}
              />
              <DetailRow
                label="Time near Patient Zero"
                value={`${selected.timeNearPatientZero} seconds`}
              />
            </div>

            <span
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                color: RISK_COLOR[selected.riskLevel],
                borderColor: RISK_COLOR[selected.riskLevel],
                backgroundColor: `${RISK_COLOR[selected.riskLevel]}14`,
              }}
            >
              {selected.riskLevel.toUpperCase()} RISK
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-brand-muted">{label}</span>
      <span className="text-right font-medium text-brand-black">{value}</span>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
