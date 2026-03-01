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
      <div className="border border-gray-200 rounded-xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {school.type}
              </span>
              <span className="text-xs text-gray-400">{school.location}</span>
            </div>
            <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
              {school.name}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">환산점수</p>
              <p className="text-lg font-bold text-gray-900">{formatScore(result.finalScore)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">합격 확률</p>
              <p className="text-lg font-bold text-indigo-600">{formatProbability(result.probability)}</p>
            </div>
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${levelConfig.color} ${levelConfig.bg} ${levelConfig.border}`}>
              {result.level}
            </div>
          </div>
        </div>

        <div className="mt-3 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${result.probability * 100}%` }}
          />
        </div>
      </div>
    </Link>
  );
}