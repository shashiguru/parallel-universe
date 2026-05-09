"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { CinematicUniverseStage } from "./CinematicUniverseStage";
import { ExplorationPanel } from "./ExplorationPanel";

const PALETTE = [
  { bg: "#00142a", glow: "rgba(0,212,255,0.18)", primary: "#00d4ff" },
  { bg: "#12002a", glow: "rgba(168,85,247,0.16)", primary: "#a855f7" },
  { bg: "#1a0800", glow: "rgba(255,107,53,0.16)", primary: "#ff6b35" },
];

// Tiny nav dot
function NavDot({ active, color, onClick }: { active: boolean; color: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ width: active ? 28 : 8, backgroundColor: active ? color : "rgba(255,255,255,0.15)" }}
      transition={{ duration: 0.35 }}
      style={{ height: 8, borderRadius: 9999, boxShadow: active ? `0 0 10px ${color}` : "none" }}
      whileHover={{ scale: 1.2 }}
    />
  );
}

export function UniversesScreen() {
  const { simulation, universeImages, setPhase, prompt } = useSimulationStore();
  const [active, setActive] = useState(0);
  const [expandedUniverse, setExpandedUniverse] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  useImageGeneration();

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200);
    return () => clearTimeout(t);
  }, []);

  const total = simulation?.universes.length ?? 0;

  const prev = useCallback(() => setActive((a) => (a > 0 ? a - 1 : total - 1)), [total]);
  const next = useCallback(() => setActive((a) => (a < total - 1 ? a + 1 : 0)), [total]);

  // Arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (!simulation) return null;

  const pal = PALETTE[active % PALETTE.length];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── AMBIENT BACKGROUND — shifts with active universe ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse at 50% 30%, ${pal.glow} 0%, transparent 65%)` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      {/* Deep background color bleed */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ backgroundColor: pal.bg }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ opacity: 0.35 }}
      />
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Floating ambient particles that match universe color */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px rounded-full pointer-events-none"
          style={{ left: `${8 + i * 8}%`, top: `${10 + (i % 4) * 20}%` }}
          animate={{
            backgroundColor: pal.primary,
            boxShadow: `0 0 6px ${pal.primary}`,
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        />
      ))}

      {/* ── HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : -20 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center pt-10 pb-4 px-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] tracking-widest uppercase mb-4"
          style={{ color: pal.primary, border: `1px solid ${pal.primary}25` }}>
          <Sparkles size={10} />
          Simulation Complete
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${pal.primary} 100%)` }}
          >
            Parallel Futures Detected
          </span>
        </h1>
        <p className="text-xs text-white/25 max-w-md text-center font-light italic">&ldquo;{prompt}&rdquo;</p>
      </motion.div>

      {/* ── CAROUSEL STAGE ── */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-4 pb-4">
        <div className="w-full max-w-6xl">

          {/* Three panels — active center, side panels faded/blurred */}
          <div className="relative flex items-start justify-center gap-4">

            {simulation.universes.map((universe, i) => {
              const offset = i - active;
              const isActive = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;

              return (
                <motion.div
                  key={i}
                  className="relative"
                  animate={{
                    scale: isActive ? 1 : isAdjacent ? 0.88 : 0.78,
                    opacity: isActive ? 1 : isAdjacent ? 0.45 : 0.2,
                    filter: isActive ? "blur(0px)" : isAdjacent ? "blur(1.5px)" : "blur(4px)",
                    zIndex: isActive ? 20 : isAdjacent ? 10 : 1,
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ width: isActive ? "100%" : "80%", maxWidth: isActive ? 720 : 300, flexShrink: 0 }}
                  onClick={() => !isActive && setActive(i)}
                >
                  {/* Click overlay for inactive panels */}
                  {!isActive && (
                    <div className="absolute inset-0 z-30 cursor-pointer rounded-2xl" />
                  )}

                  <CinematicUniverseStage
                    universe={universe}
                    index={i}
                    image={universeImages[i]}
                    onExpand={() => setExpandedUniverse(i)}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* ── NAV ROW ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between mt-8 px-2"
          >
            {/* Left arrow */}
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.15, x: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
              style={{ border: `1px solid ${pal.primary}30`, color: pal.primary }}
            >
              <ChevronLeft size={18} />
            </motion.button>

            {/* Dots + universe title */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {simulation.universes.map((_, i) => (
                  <NavDot key={i} active={i === active} color={PALETTE[i % PALETTE.length].primary} onClick={() => setActive(i)} />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-[10px] tracking-widest uppercase text-white/30"
                >
                  {simulation.universes[active].title}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Right arrow */}
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.15, x: 3 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
              style={{ border: `1px solid ${pal.primary}30`, color: pal.primary }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>

          {/* ── ENTER DEBATE CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 16 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              onClick={() => setPhase("debate")}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl font-semibold text-sm tracking-wider uppercase"
              style={{
                background: `linear-gradient(135deg, ${pal.primary}20, ${pal.primary}08)`,
                border: `1px solid ${pal.primary}35`,
                color: pal.primary,
              }}
              whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${pal.primary}25` }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={14} />
              Enter AI Debate Chamber
              <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── EXPLORATION DETAIL PANEL ── */}
      <AnimatePresence>
        {expandedUniverse !== null && (
          <ExplorationPanel
            universe={simulation.universes[expandedUniverse]}
            index={expandedUniverse}
            onClose={() => setExpandedUniverse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
