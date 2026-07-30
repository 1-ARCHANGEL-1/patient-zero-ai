"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ExposureTreeGraph } from "@/components/graph/ExposureTreeGraph";
import { mockExposureTreeGraph } from "@/lib/mockData";
import type { ExposureTreeGraphData } from "@/types";

export default function GraphPage() {
  const [graphData, setGraphData] = useState<ExposureTreeGraphData | null | undefined>(undefined);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/graph");
        const data = await res.json();
        setGraphData(data);
      } catch {
        setGraphData(mockExposureTreeGraph);
      }
    }

    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col animate-in fade-in duration-500">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-8">
        {graphData === undefined ? null : graphData ? (
          <div className="w-full max-w-4xl animate-in fade-in duration-500">
            <ExposureTreeGraph data={graphData} />
          </div>
        ) : (
          <p className="text-sm text-brand-muted">
            Run an investigation first to generate the exposure graph.
          </p>
        )}
      </div>
    </div>
  );
}
