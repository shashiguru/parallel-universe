"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSimulationStore } from "@/lib/store";
import { LandingScreen } from "@/components/landing/LandingScreen";
import { GenerationScreen } from "@/components/generation/GenerationScreen";
import { UniversesScreen } from "@/components/universes/UniversesScreen";
import { DebateChamber } from "@/components/debate/DebateChamber";
import { NewsBroadcast } from "@/components/news/NewsBroadcast";
import { MostProbableFuture } from "@/components/reveal/MostProbableFuture";
import { PhaseNav } from "@/components/shared/PhaseNav";
import { ErrorToast } from "@/components/shared/ErrorToast";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { pageTransition } from "@/animations/variants";

export default function Home() {
  const phase = useSimulationStore((s) => s.phase);
  useKeyboardShortcuts();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <PhaseNav />
      <ErrorToast />
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" variants={pageTransition} initial="initial" animate="animate" exit="exit">
            <LandingScreen />
          </motion.div>
        )}
        {phase === "generating" && (
          <motion.div key="generating" variants={pageTransition} initial="initial" animate="animate" exit="exit">
            <GenerationScreen />
          </motion.div>
        )}
        {phase === "universes" && (
          <motion.div key="universes" variants={pageTransition} initial="initial" animate="animate" exit="exit">
            <UniversesScreen />
          </motion.div>
        )}
        {phase === "debate" && (
          <motion.div key="debate" variants={pageTransition} initial="initial" animate="animate" exit="exit">
            <DebateChamber />
          </motion.div>
        )}
        {phase === "news" && (
          <motion.div key="news" variants={pageTransition} initial="initial" animate="animate" exit="exit">
            <NewsBroadcast />
          </motion.div>
        )}
        {phase === "reveal" && (
          <motion.div key="reveal" variants={pageTransition} initial="initial" animate="animate" exit="exit">
            <MostProbableFuture />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
