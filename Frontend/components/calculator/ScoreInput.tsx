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
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-700">{semesterIndex + 1}학기</span>
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
              <label className="text-xs text-gray-500 font-medium text-center">{label}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={semester[key]}
                onChange={(e) => onUpdate(semesterIndex, key, e.target.value)}
                className={`w-full text-center border rounded-lg py-2 text-sm font-semibold outline-none transition-all
                  ${error
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white"
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