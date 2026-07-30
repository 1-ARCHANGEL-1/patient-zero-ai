import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

interface NavbarProps {
  right?: React.ReactNode;
}

export function Navbar({ right }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between border-b border-black/10 bg-brand-dark-surface px-6">
      <Link href="/" className="flex items-center gap-3.5">
        <Logo size={36} centerColor="#FFFFFF" />
        <span className="text-[17px] font-semibold tracking-tight text-white">
          Patient Zero AI
        </span>
      </Link>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </header>
  );
}
