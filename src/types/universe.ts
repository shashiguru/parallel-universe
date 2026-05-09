import { z } from "zod/v4";

export const AgentSchema = z.object({
  role: z.enum(["Economist", "Founder", "Policymaker", "Worker"]),
  opinion: z.string(),
});

export const UniverseSchema = z.object({
  title: z.string(),
  probability: z.number().min(0).max(100),
  headline: z.string(),
  summary: z.string(),
  future_news: z.string(),
  metrics: z.record(z.string(), z.string()),
  causal_chain: z.array(z.string()),
  ripple_effects: z.array(z.string()),
  agents: z.array(AgentSchema),
});

export const SimulationResponseSchema = z.object({
  universes: z.array(UniverseSchema).length(3),
  most_probable: z.object({
    universe_index: z.number(),
    confidence_score: z.number().min(0).max(100),
    primary_driver: z.string(),
  }),
});

export type Agent = z.infer<typeof AgentSchema>;
export type Universe = z.infer<typeof UniverseSchema>;
export type SimulationResponse = z.infer<typeof SimulationResponseSchema>;

export type AppPhase =
  | "landing"
  | "generating"
  | "universes"
  | "debate"
  | "news"
  | "reveal";

export interface VoiceState {
  isPlaying: boolean;
  currentAgent: string | null;
  currentText: string;
  progress: number;
}
