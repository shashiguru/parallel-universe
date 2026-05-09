import { NextResponse } from "next/server";
import { getOpenAI } from "@/services/openai";
import { SIMULATION_SYSTEM_PROMPT, SIMULATION_JSON_SCHEMA } from "@/ai/prompts";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const openai = getOpenAI();

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: SIMULATION_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "simulation_response",
          schema: SIMULATION_JSON_SCHEMA,
          strict: true,
        },
      },
    });

    const text = response.output_text;
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { error: "Failed to generate simulation" },
      { status: 500 }
    );
  }
}
