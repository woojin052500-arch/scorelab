// @ts-nocheck
import { School, UserScore, CalculationResult } from '../types/index';

const SUBJECTS = ['korean', 'math', 'english', 'science', 'social'] as const;

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = []) {
  const sums: Record<string, number> = {};
  SUBJECTS.forEach((s) => (sums[s] = 0));

  const n = Math.max(1, user.semesters.length);
  let totalWeight = 0;
  const effectiveWeights: number[] = [];
  if (!semesterWeights || semesterWeights.length === 0) {
    for (let i = 0; i < n; i++) { effectiveWeights.push(1); totalWeight += 1; }
  } else {
    for (let i = 0; i < n; i++) { const w = semesterWeights[i] ?? 0; effectiveWeights.push(w); totalWeight += w; }
  }

  user.semesters.forEach((semester, idx) => {
    const w = effectiveWeights[idx] ?? 0;
    SUBJECTS.forEach((sub) => {
      let score = (semester as any)[sub] ?? 0;
      if ((sub === 'math' || sub === 'science') && score >= 90) score = clamp(score + 1.5);
      if ((sub === 'korean' || sub === 'social') && score < 70) score = clamp(score - 1.5);
      if (sub === 'english' && score >= 85) score = Math.min(score, 95);
      sums[sub] += score * w;
    });
  });

  const out: Record<string, number> = {};
  SUBJECTS.forEach((s) => { out[s] = totalWeight > 0 ? sums[s] / totalWeight : 0; });
  return out;
}

export function weightedSubjectSum(
  subjectAvg: Record<string, number>,
  subjectWeights: Record<string, number>
) {
  let sum = 0;
  let weightSum = 0;
  for (const k of Object.keys(subjectWeights)) {
    const w = subjectWeights[k] ?? 0;
    const s = subjectAvg[k] ?? 0;
    sum += s * w;
    weightSum += w;
  }
  return { sum, weightSum };
}

export function normalizeTo100(weightedSum: number, weightSum: number) {
  if (weightSum <= 0) return 0;
  // subject averages are in 0..100, so weightedSum/weightSum yields 0..100
  return weightedSum / weightSum;
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
  return clamp(Number(sigmoid((finalScore - cutline) / s).toFixed(4)), 0, 1);
}

export function levelFromFinalScore(finalScore: number | null, cutline?: number, difficulty?: number, spread?: number) {
  if (finalScore == null) return '미정';
  const s = typeof spread === 'number' && spread > 0 ? spread : 6;
  const prob = probabilityFromScore(finalScore, cutline, s);
  if (prob >= 0.7) return '적정';
  if (prob >= 0.4) return '경쟁';
  return '힘듦';
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
  const s = typeof school.spread === 'number' && school.spread > 0 ? school.spread : 6;
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
  };
}

export function calculateAll(schools: School[], user: UserScore) {
  return schools.map((s) => calculateForSchool(s, user)).sort((a, b) => b.finalScore - a.finalScore);
}

export default { calculateForSchool, calculateAll };