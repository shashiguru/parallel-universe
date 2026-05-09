import { NextResponse } from "next/server";
import { generateUniverseImage } from "@/services/images";
import type { ImageProvider } from "@/services/images";

export async function POST(request: Request) {
  try {
    const { universe, provider } = await request.json();
    if (!universe) {
      return NextResponse.json(
        { error: "Universe data is required" },
        { status: 400 }
      );
    }

    const imageUrl = await generateUniverseImage(
      universe,
      provider as ImageProvider
    );

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
