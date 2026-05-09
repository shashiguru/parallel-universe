"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, TrendingUp, TrendingDown, ArrowRight, Tv, AlertTriangle, Mic } from "lucide-react";
import { useSimulationStore } from "@/lib/store";

const UNIVERSE_COLORS = ["#00d4ff", "#a855f7", "#ff6b35"];

const TICKERS = [
  { symbol: "AI.SGX", price: "2,847.30", change: "+12.4%", up: true },
  { symbol: "ROBO.NAS", price: "15,221.08", change: "+8.7%", up: true },
  { symbol: "QC.NYS", price: "892.15", change: "-3.2%", up: false },
  { symbol: "NEURO.TSE", price: "4,108.42", change: "+21.1%", up: true },
  { symbol: "META.AI", price: "1,247.88", change: "+5.6%", up: true },
  { symbol: "SPACE.LON", price: "673.22", change: "+15.3%", up: true },
  { symbol: "BIO.FRA", price: "3,891.07", change: "+9.8%", up: true },
  { symbol: "EDGE.HKG", price: "512.44", change: "-1.4%", up: false },
  { symbol: "QUANTUM.TYO", price: "9,201.55", change: "+33.7%", up: true },
  { symbol: "NEURL.NYC", price: "4,503.11", change: "-6.8%", up: false },
];

function StockTicker({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className={`overflow-hidden ${inverted ? "bg-white/5" : "bg-black/40"} border-y border-white/5`}>
      <motion.div
        className="flex whitespace-nowrap gap-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKERS, ...TICKERS].map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-1.5 border-r border-white/5 shrink-0">
            <span className="text-[11px] font-mono font-bold text-white/70">{t.symbol}</span>
            <span className="text-[11px] font-mono text-white/40">{t.price}</span>
            <span className={`text-[11px] font-mono font-bold flex items-center gap-0.5 ${t.up ? "text-emerald-400" : "text-red-400"}`}>
              {t.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {t.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Lower-third graphic — Bloomberg style
function LowerThird({ headline, universe, color }: { headline: string; universe: string; color: string }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
    >
      {/* Universe label bar */}
      <div className="flex items-center" style={{ background: color }}>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black px-4 py-1">
          {universe}
        </span>
        <div className="flex-1 h-full" style={{ background: `${color}80` }} />
      </div>
      {/* Headline bar */}
      <div className="flex items-center gap-3 px-4 py-2" style={{ background: "rgba(3,0,20,0.92)" }}>
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <AlertTriangle size={12} className="text-red-400 shrink-0" />
        </motion.div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 shrink-0">Breaking</span>
        <span className="text-sm text-white/90 font-light truncate">{headline}</span>
      </div>
    </motion.div>
  );
}

// Anchor visualiser — abstract "face" frame with waveform
function AnchorFrame({ isNarrating, color }: { isNarrating: boolean; color: string }) {
  const BARS = Array.from({ length: 20 }, (_, i) => ({ h: 0.3 + Math.abs(Math.sin(i * 0.8)) * 0.5, d: i * 0.05 }));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Concentric ring backdrop */}
      {[120, 90, 60].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: size, height: size, border: `1px solid ${color}`, opacity: 0.08 + i * 0.04 }}
          animate={isNarrating ? { scale: [1, 1.06, 1], opacity: [0.08 + i * 0.04, 0.18 + i * 0.06, 0.08 + i * 0.04] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Mic icon — "anchor" representation */}
      <motion.div
        className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: `radial-gradient(circle, ${color}25, ${color}05)`, border: `2px solid ${color}60` }}
        animate={isNarrating
          ? { boxShadow: [`0 0 0px ${color}00`, `0 0 30px ${color}50`, `0 0 0px ${color}00`] }
          : {}}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <Mic size={24} style={{ color }} />
      </motion.div>

      {/* Waveform arc below the icon */}
      <div className="absolute bottom-4 flex items-end justify-center gap-[3px]">
        {BARS.map((bar, i) =>
          isNarrating ? (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 3, backgroundColor: color }}
              animate={{ height: [`${bar.h * 5}px`, `${bar.h * 22}px`, `${bar.h * 5}px`] }}
              transition={{ duration: 0.4 + bar.h * 0.3, repeat: Infinity, delay: bar.d, ease: "easeInOut" }}
            />
          ) : (
            <div key={i} style={{ width: 3, height: 3, borderRadius: 9999, backgroundColor: `${color}30` }} />
          )
        )}
      </div>
    </div>
  );
}

export function NewsBroadcast() {
  const { simulation, setPhase, setVoiceState, universeImages } = useSimulationStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [fullText, setFullText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFetchingRef = useRef(false);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const headlines = useMemo(() => simulation?.universes.map((u) => u.future_news) ?? [], [simulation]);

  const stopCurrent = () => {
    isFetchingRef.current = false;
    if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    setIsNarrating(false);
    setActiveWordIndex(-1);
    setVoiceState({ isPlaying: false, currentAgent: null });
  };

  const startWordHighlight = (text: string) => {
    const words = text.split(" ");
    const msPerWord = 1000 / 2.6;
    let idx = 0;
    wordTimerRef.current = setInterval(() => {
      if (idx < words.length) { setActiveWordIndex(idx); idx++; }
      else { if (wordTimerRef.current) clearInterval(wordTimerRef.current); }
    }, msPerWord);
  };

  useEffect(() => {
    const text = headlines[activeIndex];
    if (!text) return;

    stopCurrent();
    setFullText(text);
    setIsNarrating(true);
    setActiveWordIndex(-1);
    isFetchingRef.current = true;
    setVoiceState({ isPlaying: true, currentAgent: "Anchor" });

    fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, role: "Anchor" }),
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

        audio.onplay = () => startWordHighlight(text);
        audio.onended = () => {
          setVoiceState({ isPlaying: false, currentAgent: null });
          URL.revokeObjectURL(url);
          audioRef.current = null;
          if (wordTimerRef.current) { clearInterval(wordTimerRef.current); wordTimerRef.current = null; }
          setActiveWordIndex(-1);
          setIsNarrating(false);
        };
        audio.play();
      })
      .catch(() => {
        isFetchingRef.current = false;
        setVoiceState({ isPlaying: false, currentAgent: null });
        // Fallback: word highlight without audio
        startWordHighlight(text);
        setTimeout(() => setIsNarrating(false), text.split(" ").length * 380 + 1000);
      });

    return () => { stopCurrent(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, headlines]);

  const handleTabClick = (i: number) => {
    if (i === activeIndex) return;
    stopCurrent();
    setActiveIndex(i);
  };

  if (!simulation) return null;
  const universe = simulation.universes[activeIndex];
  if (!universe) return null;

  const color = UNIVERSE_COLORS[activeIndex % UNIVERSE_COLORS.length];
  const bgImage = universeImages[activeIndex];
  const words = fullText.split(" ");

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#030014]">

      {/* ── TOP BAR ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 flex items-center justify-between px-6 py-2 glass-strong border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <Radio size={14} className="text-red-400" />
          </motion.div>
          <span className="text-xs font-black tracking-[0.3em] uppercase text-white/80">PARALLEL NEWS NETWORK</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase tracking-widest">Live</span>
        </div>
        <div className="flex items-center gap-6">
          {/* Universe tabs in top bar */}
          {simulation.universes.map((u, i) => (
            <motion.button
              key={i}
              onClick={() => handleTabClick(i)}
              className={`text-[10px] tracking-widest uppercase transition-all ${i === activeIndex ? "font-bold" : "text-white/25 hover:text-white/50"}`}
              style={{ color: i === activeIndex ? UNIVERSE_COLORS[i] : undefined }}
              whileHover={{ scale: 1.05 }}
            >
              {u.title.split(":")[0]}
            </motion.button>
          ))}
          <span className="text-[10px] font-mono text-white/25">2035</span>
          <Tv size={12} className="text-white/20" />
        </div>
      </motion.div>

      <StockTicker />

      {/* ── MAIN BROADCAST ── */}
      <div className="relative z-10 flex-1 flex gap-0">

        {/* LEFT — Anchor panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-56 shrink-0 flex flex-col border-r border-white/5"
          style={{ background: `linear-gradient(180deg, ${color}08, transparent)` }}
        >
          {/* Universe image fills top half */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                {bgImage ? (
                  <img src={bgImage} alt="" className="w-full h-full object-cover opacity-30" />
                ) : (
                  <div className="w-full h-full" style={{ background: `radial-gradient(circle at 50% 40%, ${color}20, transparent 70%)` }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030014]" />
              </motion.div>
            </AnimatePresence>

            {/* Anchor frame visualiser */}
            <div className="absolute inset-0">
              <AnchorFrame isNarrating={isNarrating} color={color} />
            </div>
          </div>

          {/* Anchor label */}
          <div className="px-4 py-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>AI Anchor</div>
            <div className="text-[9px] text-white/25 tracking-wider mt-0.5">Parallel News Network</div>
            {isNarrating && (
              <motion.div
                className="mt-2 flex items-center justify-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <div className="w-1 h-1 rounded-full bg-red-400" />
                <span className="text-[9px] text-red-400 uppercase tracking-widest">Live</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* RIGHT — Broadcast content */}
        <div className="flex-1 flex flex-col">

          {/* Background image panel */}
          <div className="relative h-52 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {bgImage
                  ? <img src={bgImage} alt="" className="w-full h-full object-cover opacity-50" />
                  : (
                    <div className="w-full h-full grid-bg" style={{ background: `linear-gradient(135deg, ${color}10, transparent 60%)` }} />
                  )
                }
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-[#030014] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent" />

            {/* Lower-third */}
            <AnimatePresence mode="wait">
              <LowerThird key={activeIndex} headline={universe.headline} universe={universe.title} color={color} />
            </AnimatePresence>
          </div>

          {/* Subtitle rail */}
          <div className="flex-1 flex flex-col justify-between px-8 py-6">
            <div>
              {/* Status row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-end gap-[2px] h-4">
                  {isNarrating && [0,1,2,3,4,5,6,7].map((i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ height: ["3px", "16px", "3px"] }}
                      transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                  {isNarrating ? "Broadcasting Now" : "Broadcast Complete"}
                </span>
                {isNarrating && (
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400 ml-auto"
                    animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                )}
              </div>

              {/* Word-by-word subtitle */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="min-h-[90px]"
                >
                  <p className="text-lg font-light leading-[1.85] tracking-wide">
                    {words.map((word, wi) => (
                      <motion.span
                        key={wi}
                        className="mr-[0.28em] inline-block"
                        animate={{
                          color: wi <= activeWordIndex ? "#ffffff" : "rgba(255,255,255,0.2)",
                          textShadow: wi === activeWordIndex ? `0 0 14px ${color}` : "none",
                        }}
                        transition={{ duration: 0.1 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Metrics strip */}
            <div className="grid grid-cols-5 gap-3 pt-4 border-t border-white/5">
              {Object.entries(universe.metrics).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-[9px] text-white/25 uppercase tracking-wider mb-1">{key}</div>
                  <div className="text-xs font-bold flex items-center justify-center gap-1" style={{ color }}>
                    <TrendingUp size={9} />
                    {value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StockTicker inverted />

      {/* ── FOOTER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-20 flex justify-center py-6"
      >
        <motion.button
          onClick={() => setPhase("reveal")}
          className="flex items-center gap-2 px-8 py-3 rounded-xl glass text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#ff6b35", border: "1px solid rgba(255,107,53,0.2)" }}
          whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(255,107,53,0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          Reveal Most Probable Future
          <ArrowRight size={14} />
        </motion.button>
      </motion.div>
    </div>
  );
}
