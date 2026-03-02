"use client";

import { useScoreForm } from "@/hooks/useScoreForm";
import { UserScore } from "@/types";
import { ScoreInput } from "./ScoreInput";

type Props = {
  onSubmit: (userScore: UserScore) => void;
  isLoading: boolean;
};

export function ScoreForm({ onSubmit, isLoading }: Props) {
  const { semesters, updateScore, addSemester, removeSemester, fillExample, validate, getFieldError, semesterCount } =
    useScoreForm();

  const handleSubmit = () => {
    const userScore = validate();
    if (userScore) onSubmit(userScore);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-800 font-mono">성적 입력</h2>
        <button
          type="button"
          onClick={fillExample}
          className="text-xs text-cyan-500 hover:text-cyan-400 underline underline-offset-2 transition-colors"
        >
          예시 데이터 채우기
        </button>
      </div>

      <div className="space-y-3">
        {semesters.map((sem, i) => (
          <ScoreInput
            key={i}
            semesterIndex={i}
            semester={sem}
            onUpdate={updateScore}
            getFieldError={getFieldError}
            onRemove={() => removeSemester(i)}
            canRemove={semesterCount > 1}
          />
        ))}
      </div>

      {semesterCount < 4 && (
        <button
          type="button"
          onClick={addSemester}
          className="w-full border border-dashed border-neutral-700/20 rounded-xl py-3 text-sm text-neutral-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
        >
          + 학기 추가 ({semesterCount}/4)
        </button>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full text-white font-semibold rounded-xl py-3.5 text-sm transition-all mono-number"
        style={{ background: 'var(--brand-gradient)', opacity: isLoading ? 0.6 : 1 }}
      >
        {isLoading ? "계산 중..." : "합격 가능성 분석하기"}
      </button>
    </div>
  );
}