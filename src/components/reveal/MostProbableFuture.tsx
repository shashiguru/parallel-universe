"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp, Shield, RotateCcw, Sparkles } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { ProbabilityRing } from "@/components/universes/ProbabilityRing";
import { CausalChain } from "@/components/universes/CausalChain";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { ParticleField } from "@/components/shared/ParticleField";

export function MostProbableFuture() {
  const { simulation, setPhase, reset } = useSimulationStore();
  const [revealed, setRevealed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setRevealed(true), 2000);
    const timer2 = setTimeout(() => setShowDetails(true), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!simulation) return null;

  const { most_probable } = simulation;
  const winner = simulation.universes[most_probable.universe_index];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField count={60} />
      <GlowOrb color="rgba(0, 212, 255, 0.12)" size={800} x="50%" y="50%" />
      <GlowOrb color="rgba(168, 85, 247, 0.08)" size={600} x="30%" y="30%" delay={1} />
      <GlowOrb color="rgba(255, 107, 53, 0.06)" size={500} x="70%" y="70%" delay={2} />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="prereveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <Target size={48} className="text-cyan mx-auto" />
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold tracking-tighter"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  background: "linear-gradient(270deg, #00d4ff, #a855f7, #ff6b35, #00d4ff)",
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MOST PROBABLE FUTURE
              </motion.h1>

              <motion.p
                className="text-lg text-white/30 mt-4 tracking-widest uppercase"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Detecting...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <Sparkles size={32} className="text-cyan" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs tracking-[0.3em] uppercase text-cyan mb-6"
              >
                Most Probable Future Detected
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl font-bold text-center mb-8 glow-text"
              >
                {winner.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-12 mb-10"
              >
                <div className="flex flex-col items-center">
                  <ProbabilityRing probability={winner.probability} size={100} color="#00d4ff" />
                  <span className="text-xs text-white/30 mt-2 uppercase tracking-wider">
                    Probability
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-[100px] h-[100px] flex items-center justify-center">
                    <motion.span
                      className="text-4xl font-bold text-purple"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      {most_probable.confidence_score}%
                    </motion.span>
                  </div>
                  <span className="text-xs text-white/30 mt-2 uppercase tracking-wider">
                    Confidence
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-[100px] h-[100px] flex items-center justify-center">
                    <Shield size={36} className="text-orange" />
                  </div>
                  <span className="text-xs text-white/30 mt-2 uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </motion.div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full glass-strong rounded-2xl p-8 gradient-border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">{winner.headline}</h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-4">
                          {winner.summary}
                        </p>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                          <TrendingUp size={14} className="text-cyan" />
                          <span className="text-xs text-white/40">Primary Driver:</span>
                          <span className="text-xs font-bold text-cyan">
                            {most_probable.primary_driver}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {Object.entries(winner.metrics)
                            .slice(0, 4)
                            .map(([key, value]) => (
                              <div key={key} className="glass rounded-lg px-3 py-2">
                                <div className="text-[10px] text-white/30 uppercase tracking-wider">
                                  {key}
                                </div>
                                <div className="text-sm font-bold text-cyan">{value}</div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/30 uppercase tracking-wider mb-3">
                          Causal Path to Future
                        </div>
                        <CausalChain chain={winner.causal_chain} color="#00d4ff" />

                        <div className="mt-6">
                          <div className="text-xs text-white/30 uppercase tracking-wider mb-2">
                            Ripple Effects
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {winner.ripple_effects.map((effect, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="px-3 py-1 text-[10px] glass rounded-full text-white/50"
                              >
                                {effect}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
                className="flex gap-4 mt-10"
              >
                <motion.button
                  onClick={() => {
                    reset();
                    setPhase("landing");
                  }}
                  className="px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wider uppercase glass gradient-border text-cyan"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw size={16} />
                    Simulate Another Future
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
