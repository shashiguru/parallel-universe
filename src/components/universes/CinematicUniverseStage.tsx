"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronDown, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Universe } from "@/types/universe";

const UNIVERSE_PALETTES = [
  {
    // Universe A — optimistic, innovation, AI renaissance
    primary: "#00d4ff",
    secondary: "#0066ff",
    accent: "#00ffaa",
    glow: "rgba(0, 212, 255, 0.25)",
    bg: "from-[#001a2e] via-[#030014] to-[#030014]",
    label: "OPTIMISTIC",
    labelColor: "#00d4ff",
  },
  {
    // Universe B — transition, uncertainty, fragile balance
    primary: "#a855f7",
    secondary: "#7c3aed",
    accent: "#f0abfc",
    glow: "rgba(168, 85, 247, 0.22)",
    bg: "from-[#1a0a2e] via-[#030014] to-[#030014]",
    label: "UNCERTAIN",
    labelColor: "#a855f7",
  },
  {
    // Universe C — dystopia, collapse, crisis
    primary: "#ff6b35",
    secondary: "#dc2626",
    accent: "#fbbf24",
    glow: "rgba(255, 107, 53, 0.22)",
    bg: "from-[#1a0800] via-[#030014] to-[#030014]",
    label: "DYSTOPIAN",
    labelColor: "#ff6b35",
  },
];

// Metric trend icon
function TrendIcon({ value }: { value: string }) {
  const isUp = value.startsWith("+") || (!value.startsWith("-") && !value.startsWith("Min"));
  const isDown = value.startsWith("-") || value.startsWith("Min");
  if (isDown) return <TrendingDown size={11} />;
  if (isUp) return <TrendingUp size={11} />;
  return <Minus size={11} />;
}

// Holographic metric pill
function MetricPill({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  const isPositive = value.startsWith("+") || (!value.startsWith("-") && !value.includes("Min"));
  const trendColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="relative px-3 py-2 rounded-xl cursor-default"
      style={{
        background: `linear-gradient(135deg, ${color}12, ${color}06)`,
        border: `1px solid ${color}25`,
        boxShadow: `0 0 12px ${color}10`,
      }}
    >
      <div className="text-[9px] uppercase tracking-[0.18em] text-white/30 mb-1">{label}</div>
      <div className="flex items-center gap-1" style={{ color: trendColor }}>
        <TrendIcon value={value} />
        <span className="text-sm font-bold">{value}</span>
      </div>
    </motion.div>
  );
}

// Animated causal chain node flow
function CausalFlow({ chain, color }: { chain: string[]; color: string }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const timers = chain.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 600 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [chain]);

  return (
    <div className="flex flex-col items-start gap-0">
      {chain.map((step, i) => (
        <AnimatePresence key={i}>
          {i < visibleCount && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                  animate={{ boxShadow: [`0 0 0px ${color}`, `0 0 10px ${color}`, `0 0 0px ${color}`] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <span className="text-xs text-white/70 font-light">{step}</span>
              </div>
              {i < chain.length - 1 && (
                <motion.div
                  className="ml-[3.5px] w-px my-1"
                  style={{ background: `linear-gradient(to bottom, ${color}60, transparent)` }}
                  initial={{ height: 0 }}
                  animate={{ height: 14 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}

// Scan line holographic overlay
function HolographicOverlay({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Moving scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] opacity-20"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* Corner brackets */}
      {([
        { style: { top: 12, left: 12, transform: "rotate(0deg)" } },
        { style: { top: 12, right: 12, transform: "rotate(90deg)" } },
        { style: { bottom: 12, left: 12, transform: "rotate(270deg)" } },
        { style: { bottom: 12, right: 12, transform: "rotate(180deg)" } },
      ] as const).map((pos, i) => (
        <div
          key={i}
          className="absolute w-6 h-6"
          style={{
            ...pos.style,
            borderTop: `2px solid ${color}`,
            borderLeft: `2px solid ${color}`,
            opacity: 0.5,
          }}
        />
      ))}
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

interface CinematicUniverseStageProps {
  universe: Universe;
  index: number;
  image?: string;
  onExpand: () => void;
}

export function CinematicUniverseStage({
  universe, index, image, onExpand,
}: CinematicUniverseStageProps) {
  const palette = UNIVERSE_PALETTES[index % UNIVERSE_PALETTES.length];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [3, -3]);
  const rotateY = useTransform(mouseX, [-150, 150], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const rippleTags = universe.ripple_effects?.slice(0, 4) || [];

  return (
    <motion.div
      className="relative w-full flex flex-col"
      style={{ perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="w-full">

        {/* ── CINEMATIC IMAGE PANEL ── */}
        <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "58vh", minHeight: 380 }}>

          {/* Image with Ken Burns zoom */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1.18, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ scale: { duration: 12, ease: "linear" }, opacity: { duration: 0.8 } }}
            >
              {image ? (
                <img src={image} alt={universe.title} className="w-full h-full object-cover" />
              ) : (
                // Generative placeholder while image loads
                <div className="w-full h-full" style={{ background: `radial-gradient(ellipse at 30% 40%, ${palette.primary}25, ${palette.secondary}15, transparent 70%)` }}>
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ background: [
                      `radial-gradient(ellipse at 20% 50%, ${palette.primary}20, transparent 60%)`,
                      `radial-gradient(ellipse at 80% 50%, ${palette.primary}20, transparent 60%)`,
                      `radial-gradient(ellipse at 20% 50%, ${palette.primary}20, transparent 60%)`,
                    ]}}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Cinematic vignette layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030014]/60 via-transparent to-[#030014]/40" />

          {/* Ambient glow pulse */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: `radial-gradient(ellipse at 50% 80%, ${palette.glow}, transparent 65%)` }}
          />

          {/* Holographic overlays */}
          <HolographicOverlay color={palette.primary} />

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${15 + i * 11}%`,
                top: `${20 + (i % 3) * 25}%`,
                backgroundColor: palette.primary,
                opacity: 0.4,
              }}
              animate={{
                y: [-6, 6, -6],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

          {/* Universe label badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 left-4 flex items-center gap-2"
          >
            <div
              className="px-3 py-1 rounded-full text-[9px] font-black tracking-[0.3em] uppercase"
              style={{ background: `${palette.primary}20`, border: `1px solid ${palette.primary}40`, color: palette.primary }}
            >
              Universe {String.fromCharCode(65 + index)} · {palette.label}
            </div>
          </motion.div>

          {/* Probability ring — top right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute top-4 right-4"
          >
            <ProbabilityBadge probability={universe.probability} color={palette.primary} />
          </motion.div>

          {/* ── HERO TEXT — bottom of image ── */}
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2
                className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2"
                style={{ textShadow: `0 0 40px ${palette.primary}60` }}
              >
                {universe.title}
              </h2>
              <p className="text-base text-white/60 font-light italic leading-snug max-w-xl">
                &ldquo;{universe.headline}&rdquo;
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── BOTTOM INFO STRIP ── */}
        <div className="pt-5 px-1 space-y-5">

          {/* Metric pills row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2"
          >
            {Object.entries(universe.metrics).map(([key, value], i) => (
              <MetricPill key={key} label={key} value={value} color={palette.primary} delay={0.7 + i * 0.08} />
            ))}
          </motion.div>

          {/* Two-column: causal chain + ripple chips */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/25 mb-3">Causal Path</p>
              <CausalFlow chain={universe.causal_chain.slice(0, 5)} color={palette.primary} />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/25 mb-3">Ripple Effects</p>
              <div className="flex flex-wrap gap-1.5">
                {rippleTags.map((tag, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.12 }}
                    whileHover={{ scale: 1.06, boxShadow: `0 0 12px ${palette.accent}40` }}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium cursor-default"
                    style={{
                      background: `${palette.accent}12`,
                      border: `1px solid ${palette.accent}25`,
                      color: palette.accent,
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Expand CTA */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onExpand}
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase mt-1"
            style={{ color: palette.primary }}
            whileHover={{ gap: "10px" }}
          >
            <Zap size={10} />
            Deep Analysis
            <ChevronDown size={10} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Circular probability badge with animated ring
function ProbabilityBadge({ probability, color }: { probability: number; color: string }) {
  const r = 16;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative glass rounded-xl px-3 py-2 flex flex-col items-center" style={{ border: `1px solid ${color}30` }}>
      <svg width={44} height={44} className="-rotate-90">
        <circle cx={22} cy={22} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={2.5} />
        <motion.circle
          cx={22} cy={22} r={r}
          fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (probability / 100) * circ }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black" style={{ color }}>{probability}%</span>
      </div>
      <span className="text-[8px] text-white/30 uppercase tracking-widest -mt-0.5">prob.</span>
    </div>
  );
}
