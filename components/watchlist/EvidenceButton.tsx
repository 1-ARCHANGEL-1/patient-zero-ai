import Link from "next/link";
import type { Person } from "@/types";

const RISK_TEXT_CLASS: Record<NonNullable<Person["risk"]>, string> = {
  high: "text-risk-high border-risk-high-border hover:bg-risk-high-bg",
  medium: "text-risk-medium border-risk-medium-border hover:bg-risk-medium-bg",
  low: "text-risk-low border-risk-low-border hover:bg-risk-low-bg",
};

export function EvidenceButton({ person }: { person: Person }) {
  const risk = person.risk ?? "low";
  const videoId = (person.lastSeen ?? "").split("·")[0]?.trim().toLowerCase().replace(/\s+/g, "-") || "unknown";
  const timestamp = (person.lastSeen ?? "").split("·")[1]?.trim() ?? "";

  return (
    <Link
      href={`/dashboard?video=${videoId}&t=${timestamp}`}
      className={`inline-flex items-center justify-center rounded-[8px] border bg-white px-3 py-1.5 text-xs font-medium transition-colors ${RISK_TEXT_CLASS[risk]}`}
    >
      View evidence
    </Link>
  );
}
