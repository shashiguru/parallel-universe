"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/lib/store";
import type { AppPhase } from "@/types/universe";

const PHASE_ORDER: AppPhase[] = [
  "landing",
  "generating",
  "universes",
  "debate",
  "news",
  "reveal",
];

export function useKeyboardShortcuts() {
  const { phase, simulation, setPhase } = useSimulationStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!simulation) return;

      const currentIdx = PHASE_ORDER.indexOf(phase);

      if (e.key === "ArrowRight" && currentIdx < PHASE_ORDER.length - 1) {
        const next = PHASE_ORDER[currentIdx + 1];
        if (next !== "generating") setPhase(next);
      }

      if (e.key === "ArrowLeft" && currentIdx > 0) {
        const prev = PHASE_ORDER[currentIdx - 1];
        if (prev !== "generating") setPhase(prev);
      }

      if (e.key === "Escape") {
        setPhase("universes");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, simulation, setPhase]);
}
