import { LevelConfig } from "../types";

export const LEVEL_CONFIG: Record<string, LevelConfig> = {
  안정: {
    label: "안정",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  적정: {
    label: "적정",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  상향: {
    label: "상향",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

export function formatProbability(prob: number): string {
  return `${Math.round(prob * 100)}%`;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}