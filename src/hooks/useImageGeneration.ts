"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/lib/store";

export function useImageGeneration() {
  const { simulation, universeImages, setUniverseImages } = useSimulationStore();

  useEffect(() => {
    if (!simulation || universeImages.length > 0) return;

    async function generateImages() {
      const promises = simulation!.universes.map(async (universe) => {
        try {
          const res = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ universe }),
          });
          if (!res.ok) return "";
          const data = await res.json();
          return data.url || "";
        } catch {
          return "";
        }
      });

      const images = await Promise.all(promises);
      setUniverseImages(images);
    }

    generateImages();
  }, [simulation, universeImages.length, setUniverseImages]);
}
