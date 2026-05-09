"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, ChevronRight, Sparkles } from "lucide-react";
import type { Universe } from "@/types/universe";
import { CausalChain } from "./CausalChain";
import { getAgentColor } from "@/lib/utils";

const CARD_COLORS = ["#00d4ff", "#a855f7", "#ff6b35"];

interface ExplorationPanelProps {
  universe: Universe;
  index: number;
  onClose: () => void;
}

export function ExplorationPanel({ universe, index, onClose }: ExplorationPanelProps) {
  const [activeTab, setActiveTab] = useState<"chain" | "ripple" | "agents">("chain");
  const color = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative glass-strong rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto gradient-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 glass-strong px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <HelpCircle size={18} style={{ color }} />
            <div>
              <h3 className="text-lg font-bold text-white">{universe.title}</h3>
              <p className="text-xs text-white/30">Why did this future emerge?</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-1 px-6 pt-4">
          {(["chain", "ripple", "agents"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs tracking-wider capitalize transition-all ${
                activeTab === tab
                  ? "glass text-white border border-white/10"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {tab === "chain" ? "Causal Chain" : tab === "ripple" ? "Ripple Effects" : "Expert Analysis"}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "chain" && (
              <motion.div
                key="chain"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <p className="text-sm text-white/40 mb-4">
                  The sequence of events that led to this outcome:
                </p>
                <CausalChain chain={universe.causal_chain} color={color} />
              </motion.div>
            )}

            {activeTab === "ripple" && (
              <motion.div
                key="ripple"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <p className="text-sm text-white/40 mb-4">
                  Secondary effects cascading from this future:
                </p>
                <div className="space-y-3">
                  {universe.ripple_effects.map((effect, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 glass rounded-xl px-4 py-3"
                    >
                      <ChevronRight size={14} style={{ color }} />
                      <span className="text-sm text-white/60">{effect}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "agents" && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <p className="text-sm text-white/40 mb-4">
                  What the experts say about this future:
                </p>
                {universe.agents.map((agent, i) => {
                  const agentColor = getAgentColor(agent.role);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="glass rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} style={{ color: agentColor }} />
                        <span className="text-xs font-bold" style={{ color: agentColor }}>
                          {agent.role}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 italic">&ldquo;{agent.opinion}&rdquo;</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
