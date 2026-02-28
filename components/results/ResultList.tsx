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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["전체", "과학고", "외고"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === t
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">정렬:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white text-gray-700"
          >
            <option value="finalScore">환산점수순</option>
            <option value="probability">확률순</option>
          </select>
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">결과가 없습니다.</div>
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
        className="w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
      >
        다시 입력하기
      </button>
    </div>
  );
}