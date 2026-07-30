import { InvestigationProvider } from "@/context/InvestigationContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <InvestigationProvider>{children}</InvestigationProvider>;
}
