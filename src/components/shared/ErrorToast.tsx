"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useSimulationStore } from "@/lib/store";

export function ErrorToast() {
  const { error, setError } = useSimulationStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-xl px-6 py-4 max-w-md flex items-start gap-3"
          style={{ borderLeft: "3px solid #ef4444" }}
        >
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80">Simulation Error</p>
            <p className="text-xs text-white/40 mt-1">{error}</p>
            <p className="text-xs text-white/20 mt-2">
              Check your API keys in .env.local and try again.
            </p>
          </div>
          <button onClick={() => setError(null)} className="text-white/20 hover:text-white/50">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
