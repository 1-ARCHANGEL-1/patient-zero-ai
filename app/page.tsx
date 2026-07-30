import Link from "next/link";
import { ArrowRight, Upload, ScanSearch, Waypoints, ListChecks } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Logo } from "@/components/ui/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Upload,
    title: "Upload videos",
    description: "Drop in surveillance footage from every relevant camera.",
  },
  {
    icon: ScanSearch,
    title: "AI investigation",
    description: "Multimodal AI detects people, rooms, and interactions.",
  },
  {
    icon: Waypoints,
    title: "Exposure graph",
    description: "A knowledge graph reconstructs the exposure chain.",
  },
  {
    icon: ListChecks,
    title: "Watch list",
    description: "Get a risk-ranked list of individuals to monitor.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-500">
      <Navbar />

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <Logo size={88} />

        <h1 className="mt-8 text-[56px] font-bold leading-[1.05] tracking-[-0.02em] text-brand-black">
          Patient Zero AI
        </h1>
        <div
          className="mx-auto mt-3 h-[3px] w-[60px] bg-brand-red"
          aria-hidden="true"
        />

        <p className="mt-4 text-xl text-brand-muted">
          Finding exposure before it becomes an outbreak.
        </p>

        <p className="mx-auto mt-6 max-w-[600px] text-base leading-relaxed text-brand-muted">
          Inspired by the Nipah outbreaks in Kerala, India — where infection-control
          teams spent days manually reviewing surveillance footage — Patient Zero AI
          explores how multimodal AI and knowledge graphs can help investigators
          reconstruct exposure chains in minutes, not days.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-[15px]")}
          >
            Start investigation
            <ArrowRight className="ml-1 size-4" />
          </Link>
          <Link
            href="#how-it-works"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-11 px-6 text-[15px]"
            )}
          >
            Learn more
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border bg-brand-surface px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-brand-black">
            How it works
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div
                    className="absolute top-6 left-1/2 hidden h-px w-full bg-border lg:block"
                    style={{ transform: "translateX(50%)" }}
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-border bg-white">
                  <step.icon className="size-5 text-brand-red" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-brand-black">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-brand-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
