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
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  상향: {
    label: "상향",
    label: "상향",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  경쟁: {
    label: "경쟁",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  힘듦: {
    label: "힘듦",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

export function formatProbability(prob: number): string {
  return `${Math.round(prob * 100)}%`;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}