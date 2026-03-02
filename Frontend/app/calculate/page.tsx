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
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-300">
      <section className="w-full max-w-5xl mx-auto flex flex-col gap-20 px-8 py-28">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-left text-neutral-900 dark:text-white transition-colors duration-300">
            합격 가능성 분석
          </h1>
          <p className="text-lg mb-12 text-left max-w-lg font-medium text-neutral-700 dark:text-neutral-300 transition-colors duration-300">
            학기별 내신 점수를 입력하면 <span className="font-bold text-cyan-600 dark:text-cyan-400">Scorelab</span>이 학교별 환산점수와 합격 확률을 분석해 드립니다.
          </p>
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl shadow-xl p-10 mb-10 transition-colors duration-300">
            {error && <ErrorMessage message={error} onRetry={reset} />}
            {!data ? (
              <ScoreForm onSubmit={calculate} isLoading={isLoading} />
            ) : (
              <ResultList results={data} schools={schools} onReset={reset} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}