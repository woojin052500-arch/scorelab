// @ts-nocheck
import { School, UserScore, Subject, CalculateResult } from "@/types";

const SUBJECTS: Subject[] = ["korean", "math", "english", "science", "social"];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

<<<<<<< HEAD
function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = {}) {
=======
/**
 * 학기별 가중치 평균 계산 (2026 입시 로직 반영)
 */
function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = []) {
>>>>>>> 20c801622e4bf71c4c5c35eb93b0d66e87570cc9
  const subjects: Subject[] = SUBJECTS;
  const sums: Record<string, number> = {};
  subjects.forEach((s) => (sums[s] = 0));

  const n = Math.max(1, user.semesters.length);
  const effectiveWeights: number[] = [];
  let weightSum = 0;
<<<<<<< HEAD
=======

>>>>>>> 20c801622e4bf71c4c5c35eb93b0d66e87570cc9

  return {
    schoolId: sObj.id,
    finalScore,
    probability: prob,
    level: levelFromFinalScore(finalScore, sObj.cutline, sObj.difficulty, spreadValue) as any,
    color: getLevelColor(prob), // 🔥 핵심: 이 필드가 있어야 'reading color' 에러가 안 납니다.
>>>>>>> 20c801622e4bf71c4c5c35eb93b0d66e87570cc9
  };
}

export function calculateAll(schools: School[], userScore: UserScore) {
<<<<<<< HEAD
  return schools.map((s) => calculateForSchool(s, userScore)).sort((a, b) => b.finalScore - a.finalScore);
=======
  return schools
    .map((s) => calculateForSchool(s, userScore))
    .sort((a, b) => b.finalScore - a.finalScore);
>>>>>>> 20c801622e4bf71c4c5c35eb93b0d66e87570cc9
}