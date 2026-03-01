"use client";

import { useCalculate } from "../../hooks/useCalculate";
import { useSchools } from "../../hooks/useSchools";
import { ScoreForm } from "../../components/calculator/ScoreForm";
import { ResultList } from "../../components/results/ResultList";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export default function CalculatePage() {
  const { data, isLoading, error, calculate, reset } = useCalculate();
  const { schools } = useSchools();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">합격 가능성 분석</h1>
        <p className="text-sm text-gray-500 mt-1">학기별 내신 점수를 입력하면 학교별로 분석합니다.</p>
      </div>

      {error && <ErrorMessage message={error} onRetry={reset} />}

      {!data ? (
        <ScoreForm onSubmit={calculate} isLoading={isLoading} />
      ) : (
        <ResultList results={data} schools={schools} onReset={reset} />
      )}
    </main>
  );
}