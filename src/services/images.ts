import { getOpenAI } from "./openai";
import { buildImagePrompt } from "@/ai/prompts";

export type ImageProvider = "openai" | "fal";

export async function generateUniverseImage(
  universe: { title: string; headline: string; summary: string },
  provider?: ImageProvider
): Promise<string> {
  const selectedProvider = provider || (process.env.IMAGE_PROVIDER as ImageProvider) || "openai";

  if (selectedProvider === "fal") {
    return generateWithFal(universe);
  }
  return generateWithOpenAI(universe);
}

async function generateWithOpenAI(
  universe: { title: string; headline: string; summary: string }
): Promise<string> {
  const openai = getOpenAI();
  const prompt = buildImagePrompt(universe);

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1536x1024",
    quality: "medium",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (b64) {
    return `data:image/png;base64,${b64}`;
  }

  return response.data?.[0]?.url || "/placeholder-universe.jpg";
}

async function generateWithFal(
  universe: { title: string; headline: string; summary: string }
): Promise<string> {
  const falKey = process.env.FAL_KEY;
  if (!falKey) throw new Error("FAL_KEY not configured");

  const prompt = buildImagePrompt(universe);

  const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: "landscape_16_9",
      num_images: 1,
    }),
  });

  if (!response.ok) throw new Error(`Fal API error: ${response.status}`);

  const data = await response.json();
  return data.images?.[0]?.url || "/placeholder-universe.jpg";
}
