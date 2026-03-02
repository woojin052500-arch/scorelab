// @ts-nocheck
import { School, UserScore, CalculationResult } from '../types/index';

const SUBJECTS = ['korean', 'math', 'english', 'science', 'social'] as const;

export function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = []) { 
  // 🔴 수정 1: sums는 배열([])이 아니라 객체({})여야 합니다.
  const sums: Record<string, number> = {}; 
  
  SUBJECTS.forEach((s) => (sums[s] = 0));
  let totalWeight = 0;

  semesterWeights.forEach((w, i) => {
    const semester = user.semesters[i];
    if (semester) {
      SUBJECTS.forEach((sub) => {
        let score = (semester as any)[sub] ?? 0;
        // 2026 입시 가산점 로직
        if (sub === 'math' || sub === 'science') if (score >= 90) score += 2;
        if (sub === 'korean' || sub === 'social') if (score < 70) score -= 2;
        if (sub === 'english') if (score >= 80) score = 90;
        sums[sub] += score * w;
      });
      totalWeight += w;
    }
  });

  const out: Record<string, number> = {};
  SUBJECTS.forEach((s) => { 
    // 🔴 수정 2: sums[sub]가 아니라 변수 s를 써서 sums[s]라고 해야 합니다.
    out[s] = totalWeight > 0 ? sums[s] / totalWeight : 0; 
  });
  return out;
}

<<<<<<< HEAD
export function weightedSubjectSum(
  subjectAvg: Record<string, number>,
  subjectWeights: Record<string, number>
) {
  let sum = 0;
  let weightSum = 0;
  for (const k of Object.keys(subjectWeights)) {
    const w = subjectWeights[k] ?? 0;
    // @ts-ignore
    const s = subjectAvg[k] ?? 0;
    sum += s * w;
    weightSum += w;
  }
  return { sum, weightSum };
}

export function normalizeTo100(weightedSum: number, weightSum: number) {
  if (weightSum <= 0) return 0;
  const maxWeighted = 100 * weightSum;
  return (weightedSum / maxWeighted) * 100;
}

export function applyDifficulty(
  score: number,
  difficulty?: number,
  mode: 'add' | 'mul' = 'add'
) {
  if (difficulty == null) return clamp(score);
  if (mode === 'add') return clamp(score + difficulty);

  return clamp(score * difficulty);
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function probabilityFromScore(
  finalScore: number,
  cutline?: number,
  spread?: number
) {
  if (cutline == null) {
    if (finalScore >= 95) return 0.99;
    if (finalScore >= 90) return 0.95;
    if (finalScore >= 85) return 0.85;
    if (finalScore >= 80) return 0.7;
    if (finalScore >= 70) return 0.5;
    if (finalScore >= 60) return 0.3;
    return 0.1;
  }
  const s = typeof spread === 'number' && spread > 0 ? spread : 4;
  return clamp(
    Number(sigmoid((finalScore - cutline + 2) / s).toFixed(4)),
    0,
    1
  );
}

// New: Use finalScore max 18.7 as scale for level
// Modern admissions trend: classify by probability using cutline/difficulty
// 적정: 합격확률 >= 0.7, 경쟁: 0.4 <= 확률 < 0.7, 힘듦: 확률 < 0.4
export function levelFromFinalScore(finalScore: number | null, cutline?: number, difficulty?: number, spread?: number) {
  if (finalScore == null) return '미정';
  // Use probabilityFromScore to reflect cutline/difficulty
  const s = typeof spread === 'number' && spread > 0 ? spread : 6;
  const prob = probabilityFromScore(finalScore, cutline, s);
  if (prob >= 0.7) return '적정';
  if (prob >= 0.4) return '경쟁';
  if (prob >= 0) return '힘듦';
  return '미정';
}

export function calculateForSchool(
  school: School,
  user: UserScore,
  options?: { difficultyMode?: 'add' | 'mul' }
): CalculationResult {
  const semesterWeights = school.gradeWeights?.semesterWeights ?? [];
  const subjectAvg = semesterWeightedAvg(user, semesterWeights);
  const { sum: weightedSum, weightSum } = weightedSubjectSum(
    subjectAvg as Record<string, number>,
    school.subjectWeights as Record<string, number>
  );
  const normalized = normalizeTo100(weightedSum, weightSum);
  const mode = options?.difficultyMode ?? school.difficultyMode ?? 'add';
  const afterDifficulty = applyDifficulty(normalized, school.difficulty, mode);
  const s =
    typeof school.spread === 'number' && school.spread > 0 ? school.spread : 6;
  let prob =
    school.cutline != null
      ? probabilityFromScore(afterDifficulty, school.cutline, s)
      : probabilityFromScore(afterDifficulty);
  if (typeof prob !== 'number' || isNaN(prob)) prob = 0;
  const finalScore = Math.round(afterDifficulty * 10) / 10;
  return {
    schoolId: school.id,
    finalScore,
    probability: prob,
    level: levelFromFinalScore(finalScore, school.cutline, school.difficulty, s),
=======
export function calculateForSchool(school: School, user: UserScore, options?: any): CalculationResult {
  const semesterWeights = school.gradeWeights?.semesterWeights ?? [];
  const subjectAvg = semesterWeightedAvg(user, semesterWeights);
  
  // 기본 계산 로직 (임시)
  const finalScoreResult = 0; 
  
  return { 
    schoolId: school.id, 
    finalScore: finalScoreResult, 
    probability: 0.5, 
    level: '적정' 
>>>>>>> 20c801622e4bf71c4c5c35eb93b0d66e87570cc9
  };
}

export default { calculateForSchool };