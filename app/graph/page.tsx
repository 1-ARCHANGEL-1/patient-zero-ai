"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GraphFilters, type RiskFilter } from "@/components/graph/GraphFilters";
import { ExposureGraph } from "@/components/graph/ExposureGraph";

export default function GraphPage() {
  const [filter, setFilter] = useState<RiskFilter>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ width, height });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden animate-in fade-in duration-500">
      <Navbar />
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <GraphFilters value={filter} onChange={setFilter} />
        <div ref={containerRef} className="relative flex-1">
          {size.width > 0 && (
            <ExposureGraph filter={filter} width={size.width} height={size.height} />
          )}
        </div>
      </div>
    </div>
  );
}
