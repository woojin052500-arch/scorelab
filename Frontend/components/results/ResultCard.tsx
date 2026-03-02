// ...existing code...
"use client";

import { CalculateResult, School } from "@/types";
import { LEVEL_CONFIG, formatProbability, formatScore } from "@/lib/level";
import Link from "next/link";

type Props = {
  result: CalculateResult;
  school: School;
};

export function ResultCard({ result, school }: Props) {
  const levelConfig = LEVEL_CONFIG[result.level];

  return (
    <Link href={`/schools/${school.id}`} className="block group">
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md p-6 hover:shadow-xl hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                {school.type}
              </span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{school.location}</span>
            </div>
            <p className="font-extrabold text-lg text-neutral-900 dark:text-white truncate group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
              {school.name}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">환산점수</p>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{formatScore(result.finalScore)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-0.5">합격 확률</p>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{formatProbability(result.probability)}</p>
            </div>
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${levelConfig.color} ${levelConfig.bg} ${levelConfig.border}`}>
              {result.level}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${result.probability * 100}%` }}
          />
        </div>
      </div>
    </Link>
  );
}