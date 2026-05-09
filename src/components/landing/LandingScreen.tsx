"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Globe, Cpu, TrendingUp, Rocket, Zap as Energy, Lock } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { ParticleField } from "@/components/shared/ParticleField";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { fadeInUp } from "@/animations/variants";

const EXAMPLE_PROMPTS = [
  "Simulate Singapore in 2035 if AI replaces 50% of software engineering jobs.",
  "What happens if NVIDIA loses AI chip dominance by 2030?",
  "Simulate the world economy if AGI automates all white-collar jobs.",
  "What if solo AI founders build billion-dollar companies by 2028?",
  "Simulate Southeast Asia if renewable energy becomes 10x cheaper.",
  "What happens if quantum computing breaks modern encryption?",
];

const PRESET_SCENARIOS = [
  {
    icon: Cpu,
    label: "AI Job Disruption",
    prompt: "Simulate Singapore in 2035 if AI replaces 50% of software engineering jobs.",
    color: "#00d4ff",
  },
  {
    icon: TrendingUp,
    label: "NVIDIA Loses AI Crown",
    prompt: "What happens if NVIDIA loses AI chip dominance to a new competitor by 2030?",
    color: "#a855f7",
  },
  {
    icon: Rocket,
    label: "AGI Goes Live",
    prompt: "Simulate the global economy and society if AGI is released publicly in 2027.",
    color: "#ff6b35",
  },
  {
    icon: Globe,
    label: "Solo AI Founders",
    prompt: "What if solo AI founders regularly build billion-dollar companies by 2028?",
    color: "#22c55e",
  },
  {
    icon: Energy,
    label: "Cheap Clean Energy",
    prompt: "Simulate Southeast Asia in 2035 if renewable energy becomes 10x cheaper than fossil fuels.",
    color: "#f59e0b",
  },
  {
    icon: Lock,
    label: "Encryption Broken",
    prompt: "What happens globally if quantum computing breaks all modern encryption in 2029?",
    color: "#ec4899",
  },
];

export function LandingScreen() {
  const { setPrompt, setPhase } = useSimulationStore();
  const [input, setInput] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((i) => (i + 1) % EXAMPLE_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const finalPrompt = input.trim() || EXAMPLE_PROMPTS[exampleIndex];
    setPrompt(finalPrompt);
    setPhase("generating");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField count={100} />
      <GlowOrb color="rgba(0, 212, 255, 0.12)" size={600} x="30%" y="40%" />
      <GlowOrb color="rgba(168, 85, 247, 0.10)" size={500} x="70%" y="60%" delay={2} />
      <GlowOrb color="rgba(255, 107, 53, 0.06)" size={400} x="50%" y="20%" delay={4} />

      <div className="absolute inset-0 grid-bg" />

      <motion.div
        className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 },
          },
        }}
      >
        <motion.div variants={fadeInUp} className="mb-3">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs tracking-widest uppercase text-cyan"
            animate={{ boxShadow: ["0 0 20px rgba(0,212,255,0)", "0 0 20px rgba(0,212,255,0.2)", "0 0 20px rgba(0,212,255,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={12} />
            AI-Powered Future Simulation Engine
          </motion.div>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-7xl md:text-9xl font-bold tracking-tighter text-center mb-4 glow-text"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 50%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          PARALLEL
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-white/50 text-center mb-12 tracking-wide font-light"
        >
          Explore futures before reality chooses one.
        </motion.p>

        <motion.div variants={fadeInUp} className="w-full max-w-2xl relative">
          <div className="relative gradient-border rounded-2xl">
            <div className="glass-strong rounded-2xl p-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                className="w-full bg-transparent text-white/90 placeholder-white/20 text-lg px-6 py-4 rounded-xl outline-none resize-none font-light tracking-wide"
                placeholder=""
              />
              <AnimatePresence mode="wait">
                {!input && (
                  <motion.div
                    key={exampleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.3, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-5 left-7 text-lg font-light pointer-events-none"
                  >
                    {EXAMPLE_PROMPTS[exampleIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Preset scenario chips */}
          <motion.div variants={fadeInUp} className="mt-5">
            <p className="text-[10px] text-white/20 uppercase tracking-widest text-center mb-3">
              — or try a preset scenario —
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <motion.button
                    key={scenario.label}
                    onClick={() => {
                      setInput(scenario.prompt);
                      setPrompt(scenario.prompt);
                      setPhase("generating");
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass text-left group transition-all"
                    style={{ borderColor: `${scenario.color}20` }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: `0 0 20px ${scenario.color}20`,
                      borderColor: `${scenario.color}40`,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${scenario.color}15` }}
                    >
                      <Icon size={12} style={{ color: scenario.color }} />
                    </div>
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors leading-tight">
                      {scenario.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div className="flex gap-3 mt-5 justify-center" variants={fadeInUp}>
            <motion.button
              onClick={handleSubmit}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="relative px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wider uppercase overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #a855f7)",
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #00d4ff)",
                }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2 text-white">
                <Zap size={16} />
                Generate Futures
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-16 flex gap-6 text-xs text-white/20 tracking-widest uppercase"
        >
          <span>OpenAI</span>
          <span className="text-white/10">|</span>
          <span>ElevenLabs</span>
          <span className="text-white/10">|</span>
          <span>Vercel</span>
          <span className="text-white/10">|</span>
          <span>Next.js</span>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none" />
    </div>
  );
}
