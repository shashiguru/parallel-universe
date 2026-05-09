"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CausalChainProps {
  chain: string[];
  color?: string;
}

export function CausalChain({ chain, color = "#00d4ff" }: CausalChainProps) {
  return (
    <div className="flex flex-col items-start gap-0">
      {chain.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
          className="flex flex-col items-start"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            />
            <span className="text-xs text-white/60">{step}</span>
          </div>
          {i < chain.length - 1 && (
            <div className="ml-0.5 flex items-center">
              <ChevronDown size={10} style={{ color }} className="opacity-40" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
