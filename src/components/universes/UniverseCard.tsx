"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Rocket, Shield, Wrench, ImageIcon } from "lucide-react";
import type { Universe } from "@/types/universe";
import { ProbabilityRing } from "./ProbabilityRing";
import { CausalChain } from "./CausalChain";

const CARD_COLORS = ["#00d4ff", "#a855f7", "#ff6b35"];

const ROLE_ICONS: Record<string, React.ElementType> = {
  Economist: TrendingUp,
  Founder: Rocket,
  Policymaker: Shield,
  Worker: Wrench,
};

interface UniverseCardProps {
  universe: Universe;
  index: number;
  image?: string;
  onClick?: () => void;
}

function ImageSkeleton({ color, index }: { color: string; index: number }) {
  return (
    <div className="absolute inset-0">
      {/* Animated shimmer sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${color}05 0%, ${color}18 40%, ${color}30 50%, ${color}18 60%, ${color}05 100%)`,
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Grid texture */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      {/* Subtle pulsing glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 30% 60%, ${color}12, transparent 65%)`,
            `radial-gradient(ellipse at 70% 40%, ${color}12, transparent 65%)`,
            `radial-gradient(ellipse at 30% 60%, ${color}12, transparent 65%)`,
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/30 to-transparent" />
      {/* Generating label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ImageIcon size={20} style={{ color }} className="opacity-40" />
        </motion.div>
        <motion.p
          className="text-[10px] tracking-widest uppercase"
          style={{ color }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          Generating image...
        </motion.p>
        {/* Letter watermark */}
        <motion.div
          className="absolute text-[80px] font-black"
          style={{ color, opacity: 0.04 }}
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {String.fromCharCode(65 + index)}
        </motion.div>
      </div>
    </div>
  );
}

export function UniverseCard({ universe, index, image, onClick }: UniverseCardProps) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.2,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 40px ${color}20`,
      }}
      onClick={onClick}
      className="relative glass rounded-2xl overflow-hidden cursor-pointer group"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)`,
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
      />

      {/* Image area — always h-40, skeleton shows until image is ready */}
      <div className="relative h-40 overflow-hidden bg-[#07071a]">
        {/* Skeleton always underneath */}
        <AnimatePresence>
          {!imgLoaded && (
            <motion.div
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ImageSkeleton color={color} index={index} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real image fades in on top once loaded */}
        {image && (
          <motion.img
            src={image}
            alt={universe.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 transition-opacity duration-500"
            onLoad={() => setImgLoaded(true)}
            animate={{ opacity: imgLoaded ? 0.75 : 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
      </div>

      <div className="relative p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <motion.div
              className="text-xs tracking-[0.2em] uppercase mb-1.5"
              style={{ color }}
            >
              Universe {String.fromCharCode(65 + index)}
            </motion.div>
            <h3 className="text-xl font-bold text-white">{universe.title}</h3>
          </div>
          <ProbabilityRing probability={universe.probability} size={64} color={color} />
        </div>

        <p className="text-sm font-medium text-white/80">{universe.headline}</p>
        <p className="text-xs text-white/40 leading-relaxed">{universe.summary}</p>

        <div className="grid grid-cols-2 gap-2">
          {Object.entries(universe.metrics).slice(0, 4).map(([key, value]) => (
            <div key={key} className="glass rounded-lg px-3 py-2">
              <div className="text-[10px] text-white/30 uppercase tracking-wider">{key}</div>
              <div className="text-sm font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Causal Chain</div>
          <CausalChain chain={universe.causal_chain} color={color} />
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="text-[10px] text-white/30 uppercase tracking-wider">Expert Analysis</div>
          {universe.agents.slice(0, 2).map((agent) => {
            const Icon = ROLE_ICONS[agent.role] || TrendingUp;
            return (
              <div key={agent.role} className="flex items-start gap-2">
                <Icon size={12} className="mt-0.5 shrink-0" style={{ color }} />
                <div>
                  <span className="text-[10px] font-semibold" style={{ color }}>
                    {agent.role}:
                  </span>
                  <span className="text-[10px] text-white/50 ml-1">{agent.opinion}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
