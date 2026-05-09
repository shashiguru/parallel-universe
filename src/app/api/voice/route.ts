import { NextResponse } from "next/server";
import { generateSpeech } from "@/services/elevenlabs";

export async function POST(request: Request) {
  try {
    const { text, role } = await request.json();
    if (!text || !role) {
      return NextResponse.json(
        { error: "Text and role are required" },
        { status: 400 }
      );
    }

    const audioBuffer = await generateSpeech(text, role);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Voice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice" },
      { status: 500 }
    );
  }
}
