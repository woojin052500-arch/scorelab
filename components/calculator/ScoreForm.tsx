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
        <h2 className="text-base font-semibold text-gray-800">성적 입력</h2>
        <button
          type="button"
          onClick={fillExample}
          className="text-xs text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
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
          className="w-full border border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
        >
          + 학기 추가 ({semesterCount}/4)
        </button>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-xl py-3.5 text-sm transition-colors"
      >
        {isLoading ? "계산 중..." : "합격 가능성 분석하기"}
      </button>
    </div>
  );
}