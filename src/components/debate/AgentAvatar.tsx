"use client";

import { motion } from "framer-motion";
import { TrendingUp, Rocket, Shield, Wrench } from "lucide-react";
import { getAgentColor } from "@/lib/utils";

const ROLE_ICONS: Record<string, React.ElementType> = {
  Economist: TrendingUp,
  Founder: Rocket,
  Policymaker: Shield,
  Worker: Wrench,
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  Economist: "Macro Analysis",
  Founder: "Venture Perspective",
  Policymaker: "Governance",
  Worker: "Human Impact",
};

const BAR_HEIGHTS = [0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.75, 0.45, 0.85];

interface AgentAvatarProps {
  role: string;
  isActive: boolean;
  isSpeaking: boolean;
  onClick?: () => void;
}

export function AgentAvatar({ role, isActive, isSpeaking, onClick }: AgentAvatarProps) {
  const color = getAgentColor(role);
  const Icon = ROLE_ICONS[role] || TrendingUp;

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-3 relative focus:outline-none"
      animate={{
        scale: isActive ? 1.08 : 1,
        opacity: isActive ? 1 : 0.45,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Outer pulse rings when speaking */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 80, height: 80, border: `1px solid ${color}`, top: 0, left: "50%", x: "-50%" }}
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 80, height: 80, border: `1px solid ${color}`, top: 0, left: "50%", x: "-50%" }}
            animate={{ scale: [1, 2.1], opacity: [0.3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.4, ease: "easeOut" }}
          />
        </>
      )}

      {/* Avatar circle */}
      <motion.div
        className="relative w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${color}30, ${color}08)`,
          border: `2px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
        }}
        animate={
          isSpeaking
            ? { boxShadow: [`0 0 0px ${color}00`, `0 0 28px ${color}55`, `0 0 0px ${color}00`] }
            : { boxShadow: `0 0 0px ${color}00` }
        }
        transition={isSpeaking ? { duration: 1.2, repeat: Infinity } : { duration: 0.4 }}
      >
        <Icon size={28} style={{ color }} />

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-black"
              animate={isSpeaking ? { scale: [1, 0.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Role name */}
      <div className="text-center">
        <div className="text-xs font-bold tracking-wide" style={{ color: isActive ? color : "rgba(255,255,255,0.4)" }}>
          {role}
        </div>
        <div className="text-[9px] text-white/20 tracking-wider mt-0.5">{ROLE_DESCRIPTIONS[role]}</div>
      </div>

      {/* Waveform bars — only when speaking */}
      <div className="h-5 flex items-end gap-px">
        {BAR_HEIGHTS.map((h, i) =>
          isSpeaking ? (
            <motion.div
              key={i}
              className="w-[3px] rounded-full"
              style={{ backgroundColor: color }}
              animate={{ height: [`${h * 6}px`, `${h * 20}px`, `${h * 6}px`] }}
              transition={{ duration: 0.45 + h * 0.3, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
            />
          ) : (
            <div key={i} className="w-[3px] rounded-full" style={{ height: "3px", backgroundColor: `${color}30` }} />
          )
        )}
      </div>
    </motion.button>
  );
}
