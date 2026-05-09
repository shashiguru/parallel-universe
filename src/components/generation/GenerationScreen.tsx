"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulationStore } from "@/lib/store";
import { GlowOrb } from "@/components/shared/GlowOrb";

const LOADING_PHASES = [
  "Analyzing macroeconomic trajectories...",
  "Generating societal probability graphs...",
  "Simulating labor market adaptation...",
  "Computing geopolitical ripple effects...",
  "Building parallel universes...",
  "Calculating probabilistic futures...",
];

function TimelineBranch() {
  return (
    <svg className="w-80 h-60 opacity-60" viewBox="0 0 320 240">
      <defs>
        <linearGradient id="branchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.line
        x1="20" y1="120" x2="160" y2="120"
        stroke="url(#branchGrad)" strokeWidth="2" filter="url(#glow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      {[{ x2: 300, y2: 40 }, { x2: 300, y2: 120 }, { x2: 300, y2: 200 }].map((end, i) => (
        <motion.line
          key={i}
          x1="160" y1="120" x2={end.x2} y2={end.y2}
          stroke="url(#branchGrad)" strokeWidth="2" filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 + i * 0.3, ease: "easeOut" }}
        />
      ))}

      {[{ cx: 20, cy: 120, d: 0 }, { cx: 160, cy: 120, d: 1.2 },
        { cx: 300, cy: 40, d: 2.4 }, { cx: 300, cy: 120, d: 2.7 }, { cx: 300, cy: 200, d: 3 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx} cy={node.cy} r="6"
          fill="#030014" stroke="#00d4ff" strokeWidth="2" filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: node.d, duration: 0.4 }}
        />
      ))}

      {[{ cx: 300, cy: 40 }, { cx: 300, cy: 120 }, { cx: 300, cy: 200 }].map((pos, i) => (
        <motion.circle
          key={`pulse-${i}`}
          cx={pos.cx} cy={pos.cy} r="6"
          fill="transparent" stroke="#00d4ff" strokeWidth="1"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ delay: 2.4 + i * 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
      ))}
    </svg>
  );
}

function NeuralGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;
    let frame = 0;

    const nodes = Array.from({ length: 20 }, () => ({
      x: Math.random() * 300,
      y: Math.random() * 300,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      ctx!.clearRect(0, 0, 300, 300);
      frame++;

      nodes.forEach((node, i) => {
        const pulse = Math.sin(frame * 0.02 + node.phase) * 0.5 + 0.5;

        nodes.forEach((other, j) => {
          if (j <= i) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.2 * pulse;
            ctx!.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(node.x, node.y);
            ctx!.lineTo(other.x, other.y);
            ctx!.stroke();
          }
        });

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 2 + pulse * 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 212, 255, ${0.3 + pulse * 0.4})`;
        ctx!.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return <canvas ref={canvasRef} className="w-48 h-48 opacity-40" />;
}

export function GenerationScreen() {
  const { prompt, setPhase, setSimulation, setError } = useSimulationStore();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % LOADING_PHASES.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 3, 90));
    }, 200);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runSimulation() {
      try {
        const res = await fetch("/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) throw new Error("Simulation failed");

        const data = await res.json();
        if (cancelled) return;

        setProgress(100);
        await new Promise((r) => setTimeout(r, 800));

        setSimulation(data);
        setPhase("universes");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setPhase("landing");
        }
      }
    }

    runSimulation();
    return () => { cancelled = true; };
  }, [prompt, setPhase, setSimulation, setError]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GlowOrb color="rgba(0, 212, 255, 0.15)" size={800} x="50%" y="50%" />
      <GlowOrb color="rgba(168, 85, 247, 0.1)" size={600} x="30%" y="30%" delay={1} />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-8"
        >
          <TimelineBranch />
          <NeuralGrid />
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={phaseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-cyan text-lg font-light tracking-wide"
            >
              {LOADING_PHASES[phaseIndex]}
            </motion.p>
          </AnimatePresence>

          <div className="w-80 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #00d4ff, #a855f7)",
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.p
            className="text-white/20 text-xs tracking-[0.3em] uppercase"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Simulating parallel realities
          </motion.p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1 }}
          className="text-white/30 text-sm max-w-lg text-center font-light mt-4"
        >
          &ldquo;{prompt}&rdquo;
        </motion.p>
      </div>
    </div>
  );
}
