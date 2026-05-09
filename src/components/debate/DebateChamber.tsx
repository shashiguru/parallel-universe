"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, ArrowRight, Volume2, Mic } from "lucide-react";
import { useSimulationStore } from "@/lib/store";
import { AgentAvatar } from "./AgentAvatar";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { getAgentColor } from "@/lib/utils";

interface DebateEntry {
  role: string;
  opinion: string;
  universeTitle: string;
  universeIndex: number;
}

const UNIVERSE_COLORS = ["#00d4ff", "#a855f7", "#ff6b35"];
const ALL_ROLES = ["Economist", "Founder", "Policymaker", "Worker"];

// Larger waveform with randomised heights for the "stage" visualiser
const STAGE_BARS = Array.from({ length: 32 }, (_, i) => ({
  base: 0.2 + Math.abs(Math.sin(i * 0.7)) * 0.5,
  delay: i * 0.04,
}));

export function DebateChamber() {
  const { simulation, setPhase, voiceState, setVoiceState } = useSimulationStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  // word-level subtitle highlight
  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(true);
  const isFetchingRef = useRef(false);
  const typeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allDebateEntries = useMemo<DebateEntry[]>(
    () =>
      simulation
        ? simulation.universes.flatMap((u, ui) =>
            u.agents.map((a) => ({
              role: a.role,
              opinion: a.opinion,
              universeTitle: u.title,
              universeIndex: ui,
            }))
          )
        : [],
    [simulation]
  );

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const stopCurrent = useCallback(() => {
    if (typeTimerRef.current) { clearInterval(typeTimerRef.current); typeTimerRef.current = null; }
    if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
    isFetchingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    setVoiceState({ isPlaying: false, currentAgent: null });
    setActiveWordIndex(-1);
  }, [setVoiceState]);

  const advanceToNext = useCallback(() => {
    if (isPlayingRef.current) {
      setCurrentIndex((prev) => (prev < allDebateEntries.length - 1 ? prev + 1 : prev));
    }
  }, [allDebateEntries.length]);

  // Animate words highlighting in sync with estimated speech rate
  const startWordHighlight = useCallback((text: string) => {
    const words = text.split(" ");
    // Rough estimate: average TTS reads ~2.5 words/second
    const msPerWord = 1000 / 2.5;
    let idx = 0;
    wordTimerRef.current = setInterval(() => {
      if (idx < words.length) {
        setActiveWordIndex(idx);
        idx++;
      } else {
        if (wordTimerRef.current) clearInterval(wordTimerRef.current);
      }
    }, msPerWord);
  }, []);

  useEffect(() => {
    const entry = allDebateEntries[currentIndex];
    if (!entry || !isPlaying) return;

    // Reset
    setDisplayedText(entry.opinion);
    setActiveWordIndex(-1);

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setVoiceState({ isPlaying: true, currentAgent: entry.role, currentText: entry.opinion });

    fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: entry.opinion, role: entry.role }),
    })
      .then((res) => {
        if (!isFetchingRef.current) return;
        if (!res.ok) throw new Error("Voice failed");
        return res.blob();
      })
      .then((blob) => {
        if (!blob || !isFetchingRef.current) return;
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        isFetchingRef.current = false;

        audio.onplay = () => startWordHighlight(entry.opinion);
        audio.onended = () => {
          setVoiceState({ isPlaying: false, currentAgent: null });
          URL.revokeObjectURL(url);
          audioRef.current = null;
          if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
          setActiveWordIndex(-1);
          advanceToNext();
        };
        audio.play();
      })
      .catch(() => {
        isFetchingRef.current = false;
        setVoiceState({ isPlaying: false, currentAgent: null });
        // Fallback: animate words without voice
        startWordHighlight(entry.opinion);
        setTimeout(advanceToNext, entry.opinion.split(" ").length * 400 + 1000);
      });

    return () => {
      stopCurrent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPlaying]);

  const togglePlayPause = () => {
    const next = !isPlaying;
    if (!next && audioRef.current) audioRef.current.pause();
    else if (next && audioRef.current) audioRef.current.play();
    setIsPlaying(next);
  };

  const skipNext = () => {
    stopCurrent();
    if (currentIndex < allDebateEntries.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const jumpTo = (i: number) => {
    if (i === currentIndex) return;
    stopCurrent();
    setCurrentIndex(i);
  };

  if (!simulation) return null;
  const currentEntry = allDebateEntries[currentIndex];
  if (!currentEntry) return null;

  const color = getAgentColor(currentEntry.role);
  const uColor = UNIVERSE_COLORS[currentEntry.universeIndex % UNIVERSE_COLORS.length];
  const words = currentEntry.opinion.split(" ");
  const isSpeaking = voiceState.currentAgent === currentEntry.role;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dynamic background glow shifts with active agent color */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse at 50% 60%, ${color}0a 0%, transparent 65%)` }}
        transition={{ duration: 0.8 }}
      />
      <GlowOrb color={`${uColor}12`} size={700} x="50%" y="40%" />
      <div className="absolute inset-0 grid-bg" />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between px-8 pt-6 pb-3"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-400"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">AI Debate Chamber</span>
        </div>
        <span className="text-xs text-white/20 font-mono tracking-widest">
          {currentIndex + 1} / {allDebateEntries.length}
        </span>
      </motion.div>

      {/* MAIN STAGE */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-10">

        {/* Agent row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center gap-10 md:gap-16"
        >
          {ALL_ROLES.map((role) => (
            <AgentAvatar
              key={role}
              role={role}
              isActive={currentEntry.role === role}
              isSpeaking={voiceState.currentAgent === role}
              onClick={() => {
                // jump to next entry for this role
                const idx = allDebateEntries.findIndex((e, i) => i > currentIndex && e.role === role);
                if (idx !== -1) jumpTo(idx);
              }}
            />
          ))}
        </motion.div>

        {/* Stage waveform — full width, visible only while speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="flex items-center justify-center gap-[3px] w-full max-w-xl origin-bottom"
            >
              {STAGE_BARS.map((bar, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ width: 4, backgroundColor: color }}
                  animate={{ height: [`${bar.base * 8}px`, `${bar.base * 36}px`, `${bar.base * 8}px`] }}
                  transition={{ duration: 0.5 + bar.base * 0.4, repeat: Infinity, delay: bar.delay, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speaker card */}
        <motion.div
          layout
          className="w-full max-w-3xl glass-strong rounded-2xl overflow-hidden"
          style={{ borderTop: `2px solid ${color}40` }}
        >
          {/* Universe context strip */}
          <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-white/5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: uColor, boxShadow: `0 0 8px ${uColor}` }} />
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: uColor }}>{currentEntry.universeTitle}</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
              <span className="text-[10px] tracking-widest uppercase" style={{ color }}>{currentEntry.role}</span>
              {isSpeaking && (
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  <Mic size={10} style={{ color }} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Subtitle rail — word-by-word highlight */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="px-6 py-6 min-h-[90px]"
            >
              <p className="text-lg font-light leading-relaxed tracking-wide">
                <span className="text-white/20 mr-1">&ldquo;</span>
                {words.map((word, wi) => (
                  <motion.span
                    key={wi}
                    className="mr-[0.28em] inline-block"
                    animate={{
                      color: wi <= activeWordIndex ? "#ffffff" : "rgba(255,255,255,0.25)",
                      textShadow: wi === activeWordIndex ? `0 0 12px ${color}` : "none",
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {word}
                  </motion.span>
                ))}
                <span className="text-white/20 ml-1">&rdquo;</span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 pb-5 border-t border-white/5 pt-4">
            <div className="flex gap-2">
              <motion.button
                onClick={togglePlayPause}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full glass flex items-center justify-center"
              >
                {isPlaying
                  ? <Pause size={14} style={{ color }} />
                  : <Play size={14} style={{ color }} />}
              </motion.button>
              <motion.button
                onClick={skipNext}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full glass flex items-center justify-center"
              >
                <SkipForward size={14} className="text-white/30" />
              </motion.button>
            </div>

            {/* Progress dots — one per entry */}
            <div className="flex gap-1.5 items-center">
              {allDebateEntries.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => jumpTo(i)}
                  className="rounded-full transition-all"
                  animate={{
                    width: i === currentIndex ? 20 : 6,
                    height: 6,
                    backgroundColor: i === currentIndex ? color : "rgba(255,255,255,0.12)",
                    boxShadow: i === currentIndex ? `0 0 8px ${color}` : "none",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <motion.button
              onClick={() => setPhase("news")}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs tracking-wider uppercase"
              style={{ color: "#a855f7" }}
            >
              <Volume2 size={12} />
              News
              <ArrowRight size={12} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
