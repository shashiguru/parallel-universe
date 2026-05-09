import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAgentColor(role: string): string {
  const colors: Record<string, string> = {
    Economist: "#00d4ff",
    Founder: "#ff6b35",
    Policymaker: "#a855f7",
    Worker: "#22c55e",
  };
  return colors[role] || "#ffffff";
}

export function getAgentIcon(role: string): string {
  const icons: Record<string, string> = {
    Economist: "TrendingUp",
    Founder: "Rocket",
    Policymaker: "Shield",
    Worker: "Wrench",
  };
  return icons[role] || "User";
}
