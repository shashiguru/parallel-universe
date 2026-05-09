"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { UniverseCard } from "./UniverseCard";
import { ExplorationPanel } from "./ExplorationPanel";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { fadeInUp } from "@/animations/variants";

export function UniversesScreen() {
  const { simulation, universeImages, setPhase, prompt } = useSimulationStore();
  const [selectedUniverse, setSelectedUniverse] = useState<number | null>(null);
  useImageGeneration();

  if (!simulation) return null;

  return (
    <div className="relative min-h-screen py-20 px-6 overflow-hidden">
      <GlowOrb color="rgba(0, 212, 255, 0.08)" size={600} x="20%" y="30%" />
      <GlowOrb color="rgba(168, 85, 247, 0.06)" size={500} x="80%" y="70%" delay={2} />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs tracking-widest uppercase text-cyan">
              <Sparkles size={12} />
              Simulation Complete
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{
              background: "linear-gradient(135deg, #ffffff, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Parallel Futures Detected
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/30 text-sm max-w-lg mx-auto">
            &ldquo;{prompt}&rdquo;
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {simulation.universes.map((universe, i) => (
            <UniverseCard
              key={i}
              universe={universe}
              index={i}
              image={universeImages[i]}
              onClick={() => setSelectedUniverse(i)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center gap-4"
        >
          <motion.button
            onClick={() => setPhase("debate")}
            className="px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wider uppercase overflow-hidden glass gradient-border"
            style={{ color: "#00d4ff" }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,212,255,0.2)" }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center gap-2">
              Enter AI Debate Chamber
              <ArrowRight size={16} />
            </span>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedUniverse !== null && (
          <ExplorationPanel
            universe={simulation.universes[selectedUniverse]}
            index={selectedUniverse}
            onClose={() => setSelectedUniverse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
