"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

interface NavbarProps {
  right?: React.ReactNode;
}

export function Navbar({ right }: NavbarProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  async function handleNewInvestigation() {
    try {
      await fetch("/api/graph/reset", { method: "POST" });
    } catch {
      // still proceed with the local reset below even if this fails
    }
    window.localStorage.removeItem("patientZeroGraphData");
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between border-b border-black/10 bg-brand-dark-surface px-6">
      <Link href="/" className="flex items-center gap-3.5">
        <Logo size={36} centerColor="#FFFFFF" />
        <span className="text-[17px] font-semibold tracking-tight text-white">
          Patient Zero AI
        </span>
      </Link>
      <div className="flex items-center gap-3">
        {isDashboard && (
          <button
            type="button"
            onClick={handleNewInvestigation}
            className="rounded-[8px] px-2.5 py-1 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            New Investigation
          </button>
        )}
        {right}
      </div>
    </header>
  );
}
