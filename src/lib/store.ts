"use client";

import { create } from "zustand";
import type { AppPhase, SimulationResponse, VoiceState } from "@/types/universe";

interface SimulationStore {
  phase: AppPhase;
  prompt: string;
  simulation: SimulationResponse | null;
  universeImages: string[];
  voiceState: VoiceState;
  isLoading: boolean;
  error: string | null;

  setPhase: (phase: AppPhase) => void;
  setPrompt: (prompt: string) => void;
  setSimulation: (data: SimulationResponse) => void;
  setUniverseImages: (images: string[]) => void;
  setVoiceState: (state: Partial<VoiceState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialVoiceState: VoiceState = {
  isPlaying: false,
  currentAgent: null,
  currentText: "",
  progress: 0,
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  phase: "landing",
  prompt: "",
  simulation: null,
  universeImages: [],
  voiceState: initialVoiceState,
  isLoading: false,
  error: null,

  setPhase: (phase) => set({ phase }),
  setPrompt: (prompt) => set({ prompt }),
  setSimulation: (simulation) => set({ simulation }),
  setUniverseImages: (universeImages) => set({ universeImages }),
  setVoiceState: (state) =>
    set((prev) => ({ voiceState: { ...prev.voiceState, ...state } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      phase: "landing",
      prompt: "",
      simulation: null,
      universeImages: [],
      voiceState: initialVoiceState,
      isLoading: false,
      error: null,
    }),
}));
