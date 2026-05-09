# PARALLEL — AI Parallel Universe Simulator

> "Explore futures before reality chooses one."

An AI-powered parallel universe simulation engine that generates multiple plausible futures from a single prompt. Built with cinematic UI/UX, real-time AI generation, voice narration, and immersive animations.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# Required: OPENAI_API_KEY
# Optional: ELEVENLABS_API_KEY, FAL_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4.1 + image generation |
| `ELEVENLABS_API_KEY` | No | ElevenLabs key for voice narration |
| `FAL_KEY` | No | Fal.ai key for alternative image generation |
| `IMAGE_PROVIDER` | No | `openai` (default) or `fal` |
| `GEMINI_API_KEY` | No | Google Gemini API key |
| `NEXT_PUBLIC_CONVEX_URL` | No | Convex realtime backend URL |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + glassmorphism + gradients
- **Animations**: Framer Motion
- **State**: Zustand
- **AI**: OpenAI GPT-4.1 (structured outputs)
- **Voice**: ElevenLabs text-to-speech
- **Images**: OpenAI GPT Image / Fal.ai
- **Deployment**: Vercel-ready

## Application Flow

1. **Landing Screen** — Cinematic entry with particle effects
2. **Generation Screen** — AI thinking visualization with timeline branching
3. **Parallel Universes** — 3 AI-generated futures with metrics and causal chains
4. **AI Debate Chamber** — Animated AI council with voice narration
5. **Future News Broadcast** — Bloomberg-from-2035 experience
6. **Most Probable Future** — Dramatic reveal with confidence scores

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel
```

## License

MIT
