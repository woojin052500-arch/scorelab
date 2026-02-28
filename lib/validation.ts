import { SemesterScores, UserScore } from "../types";

export type ValidationError = {
  field: string;
  message: string;
};

export function validateScore(value: unknown, field: string): ValidationError | null {
  const num = Number(value);
  if (value === "" || value === null || value === undefined) {
    return { field, message: "점수를 입력해주세요." };
  }
  if (isNaN(num)) {
    return { field, message: "숫자를 입력해주세요." };
  }
  if (num < 0 || num > 100) {
    return { field, message: "0에서 100 사이의 점수를 입력해주세요." };
  }
  return null;
}

export function validateUserScore(userScore: Partial<UserScore>): ValidationError[] {
  const errors: ValidationError[] = [];
  const semesters = userScore.semesters ?? [];

  if (semesters.length === 0) {
    errors.push({ field: "semesters", message: "최소 1개 학기 점수가 필요합니다." });
    return errors;
  }

  const subjects: (keyof SemesterScores)[] = ["korean", "math", "english", "science", "social"];

  semesters.forEach((sem, i) => {
    subjects.forEach((subject) => {
      const error = validateScore(sem[subject], `semesters.${i}.${subject}`);
      if (error) errors.push(error);
    });
  });

  return errors;
}

export function isValidScore(value: string): boolean {
  const num = Number(value);
  return value !== "" && !isNaN(num) && num >= 0 && num <= 100;
}