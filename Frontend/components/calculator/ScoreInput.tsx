"use client";

import { SemesterScores } from "@/types";

type Props = {
  semesterIndex: number;
  semester: Record<keyof SemesterScores, string>;
  onUpdate: (semesterIndex: number, subject: keyof SemesterScores, value: string) => void;
  getFieldError: (field: string) => string | undefined;
  onRemove?: () => void;
  canRemove: boolean;
};

const SUBJECT_LABELS: { key: keyof SemesterScores; label: string }[] = [
  { key: "korean", label: "국어" },
  { key: "math", label: "수학" },
  { key: "english", label: "영어" },
  { key: "science", label: "과학" },
  { key: "social", label: "사회" },
];

export function ScoreInput({ semesterIndex, semester, onUpdate, getFieldError, onRemove, canRemove }: Props) {
  return (
    <div className="rounded-xl p-5 bg-white/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm tech-glow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 font-mono">{semesterIndex + 1}학기</span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-xs text-red-400 hover:text-red-600 transition-colors">
            삭제
          </button>
        )}
      </div>
      <div className="grid grid-cols-5 gap-3">
        {SUBJECT_LABELS.map(({ key, label }) => {
          const fieldKey = `semesters.${semesterIndex}.${key}`;
          const error = getFieldError(fieldKey);
          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 font-medium text-center">{label}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={semester[key]}
                onChange={(e) => onUpdate(semesterIndex, key, e.target.value)}
                className={`w-full text-center border rounded-lg py-2 text-sm font-semibold outline-none transition-all mono-number
                  ${error
                    ? "border-red-400 bg-red-50/40 focus:border-red-400"
                    : "border-neutral-300 bg-neutral-50/50 focus:border-cyan-400 focus:bg-white/60"
                  }`}
              />
              {error && <span className="text-xs text-red-500 text-center leading-tight">{error}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}