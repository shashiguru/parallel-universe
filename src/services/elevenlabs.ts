const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

const VOICE_MAP: Record<string, string> = {
  Economist: "pNInz6obpgDQGcFmaJgB",   // Adam
  Founder: "ErXwobaYiN019PkySvjV",       // Antoni
  Policymaker: "VR6AewLTigWG4xSOukaG",   // Arnold
  Worker: "pqHfZKP75CvOlQylNhV4",        // Bill
  Anchor: "21m00Tcm4TlvDq8ikWAM",        // Rachel
};

export async function generateSpeech(
  text: string,
  role: string
): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

  const voiceId = VOICE_MAP[role] || VOICE_MAP.Anchor;

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return response.arrayBuffer();
}
