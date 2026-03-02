"use client";

import { useState } from "react";
import { CalculateResponse, School } from "@/types";
import { ResultCard } from "./ResultCard";

type SortKey = "finalScore" | "probability";

type Props = {
  results: CalculateResponse;
  schools: School[];
  onReset: () => void;
};

export function ResultList({ results, schools, onReset }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("finalScore");
  const [typeFilter, setTypeFilter] = useState<"전체" | "과학고" | "외고">("전체");

  const schoolMap = new Map(schools.map((s) => [s.id, s]));

  const filtered = results
    .filter((r) => {
      const school = schoolMap.get(r.schoolId);
      if (!school) return false;
      if (typeFilter !== "전체") return school.type === typeFilter;
      return true;
    })
    .sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["전체", "과학고", "외고"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === t
                  ? "bg-neutral-100 text-neutral-900 border-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">정렬:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs border rounded-lg px-2 py-1.5 outline-none bg-white text-neutral-700 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800"
          >
            <option value="finalScore">환산점수순</option>
            <option value="probability">확률순</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-lg">결과가 없습니다.
            <button
              className="block mx-auto mt-6 px-6 py-2 rounded-lg bg-neutral-800 text-neutral-100 font-semibold hover:bg-neutral-700 transition border border-neutral-700"
              onClick={onReset}
            >
              다시 입력하기
            </button>
          </div>
        ) : (
          filtered.map((result) => {
            const school = schoolMap.get(result.schoolId);
            if (!school) return null;
            return <ResultCard key={result.schoolId} result={result} school={school} />;
          })
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full border rounded-xl py-3 text-sm text-neutral-700 hover:border-neutral-300 hover:text-black transition-colors bg-white dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800 mt-2"
      >
        다시 입력하기
      </button>
    </div>
  );
}