"use client";

import { motion } from "framer-motion";
import { useSimulationStore } from "@/lib/store";
import type { AppPhase } from "@/types/universe";

const PHASES: { key: AppPhase; label: string }[] = [
  { key: "universes", label: "Universes" },
  { key: "debate", label: "Debate" },
  { key: "news", label: "News" },
  { key: "reveal", label: "Reveal" },
];

export function PhaseNav() {
  const { phase, simulation, setPhase } = useSimulationStore();

  if (!simulation || phase === "landing" || phase === "generating") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-1.5 rounded-full glass-strong"
    >
      {PHASES.map((p) => (
        <motion.button
          key={p.key}
          onClick={() => setPhase(p.key)}
          className={`px-4 py-1.5 rounded-full text-xs tracking-wider transition-all ${
            phase === p.key
              ? "bg-cyan/10 text-cyan"
              : "text-white/30 hover:text-white/60"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {p.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
