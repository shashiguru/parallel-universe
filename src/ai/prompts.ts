export const SIMULATION_SYSTEM_PROMPT = `You are PARALLEL, an advanced future simulation intelligence engine.

Generate 3 plausible parallel future universes from the user scenario.

Each universe must:
- Feel cinematic and emotionally engaging
- Be realistic yet thought-provoking
- Include social, economic, and technological consequences
- Have meaningfully different outcomes (one optimistic, one moderate, one pessimistic)
- Include probability scores that sum to approximately 100
- Include vivid future news headlines
- Include ripple-effect causal chains (5-7 steps each)
- Include 4 AI expert opinions (Economist, Founder, Policymaker, Worker)
- Include a rich, detailed future_news broadcast script (4-6 sentences) written as a Bloomberg-style live news anchor narration. It must include a future date (e.g. "June 12, 2035 —"), specific statistics, human impact, and a closing forward-looking statement. Make it feel like premium broadcast journalism from the future.

The universes should feel like scenarios from a premium strategic intelligence briefing.

CRITICAL: Return ONLY valid JSON matching the exact schema. Never return markdown, explanations, or anything else.`;

export const SIMULATION_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    universes: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const },
          probability: { type: "number" as const },
          headline: { type: "string" as const },
          summary: { type: "string" as const },
          future_news: { type: "string" as const },
          metrics: {
            type: "object" as const,
            properties: {
              "GDP Growth": { type: "string" as const },
              "Startup Creation": { type: "string" as const },
              "Unemployment": { type: "string" as const },
              "Average Workweek": { type: "string" as const },
              "Innovation Index": { type: "string" as const },
            },
            required: ["GDP Growth", "Startup Creation", "Unemployment", "Average Workweek", "Innovation Index"],
            additionalProperties: false,
          },
          causal_chain: { type: "array" as const, items: { type: "string" as const } },
          ripple_effects: { type: "array" as const, items: { type: "string" as const } },
          agents: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                role: { type: "string" as const, enum: ["Economist", "Founder", "Policymaker", "Worker"] },
                opinion: { type: "string" as const },
              },
              required: ["role", "opinion"],
              additionalProperties: false,
            },
          },
        },
        required: ["title", "probability", "headline", "summary", "future_news", "metrics", "causal_chain", "ripple_effects", "agents"],
        additionalProperties: false,
      },
    },
    most_probable: {
      type: "object" as const,
      properties: {
        universe_index: { type: "number" as const },
        confidence_score: { type: "number" as const },
        primary_driver: { type: "string" as const },
      },
      required: ["universe_index", "confidence_score", "primary_driver"],
      additionalProperties: false,
    },
  },
  required: ["universes", "most_probable"],
  additionalProperties: false,
};

export function buildImagePrompt(universe: { title: string; headline: string; summary: string }): string {
  return `Hyper-realistic futuristic cityscape representing "${universe.title}". ${universe.headline}. Style: cinematic, sci-fi, photorealistic, dramatic lighting, aerial perspective, vibrant neon accents, 8K quality. Mood based on: ${universe.summary}. No text or watermarks.`;
}
