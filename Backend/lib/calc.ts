// @ts-nocheck
import { School, UserScore, CalculationResult } from '../types/index';

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = []) {
  const subjects = ['korean', 'math', 'english', 'science', 'social'] as const;
  const sums: Record<string, number> = {};
  let weightSum = semesterWeights.reduce((s, w) => s + w, 0);
  const effectiveWeights: number[] = [];

  if (weightSum <= 0) {
    const n = Math.max(1, user.semesters.length);
    for (let i = 0; i < n; i++) effectiveWeights.push(1);
    weightSum = effectiveWeights.length;
  } else {
    for (let i = 0; i < user.semesters.length; i++) {
      effectiveWeights.push(semesterWeights[i] ?? 0);
    }
  }

  subjects.forEach((sub) => { sums[sub] = 0; });

  user.semesters.forEach((sem, idx) => {
    const w = effectiveWeights[idx] ?? 0;
    subjects.forEach((sub) => {
      let score = (sem as any)[sub] ?? 0;
      // 2026 입시 트렌드 유지
      if (sub === 'math' || sub === 'science') if (score >= 90) score += 2;
      if (sub === 'korean' || sub === 'social') if (score < 70) score -= 2;
      if (sub === 'english') if (score >= 80) score = 90;
      sums[sub] += score * w;
    });
  });

  const out: Record<string, number> = {};
  subjects.forEach((sub) => { out[sub] = weightSum > 0 ? sums[sub] / weightSum : 0; });
  return out as Record<(typeof subjects)[number], number>;
}

export function weightedSubjectSum(subjectAvg: Record<string, number>, subjectWeights: Record<string, number>) {
  let sum = 0; let weightSum = 0;
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
  return (weightedSum / (100 * weightSum)) * 100;
}

export function applyDifficulty(score: number, diff?: number, mode: 'add' | 'mul' = 'add') {
  if (diff == null) return clamp(score);
  return mode === 'add' ? clamp(score + diff) : clamp(score * diff);
}

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

export function probabilityFromScore(finalScore: number, cutline?: number, spread?: number) {
  if (cutline == null) {
    if (finalScore >= 95) return 0.99;
    if (finalScore >= 90) return 0.95;
    if (finalScore >= 80) return 0.7;
    return 0.3;
  }
  const s = typeof spread === 'number' && spread > 0 ? spread : 4;
  return clamp(Number(sigmoid((finalScore - cutline + 2) / s).toFixed(4)), 0, 1);
}

export function calculateForSchool(school: School, user: UserScore, options?: { difficultyMode?: 'add' | 'mul' }): CalculationResult {
  const semesterWeights = school.gradeWeights?.semesterWeights ?? [];
  const subjectAvg = semesterWeightedAvg(user, semesterWeights);
  const { sum, weightSum } = weightedSubjectSum(subjectAvg as any, school.subjectWeights as any);
  const normalized = normalizeTo100(sum, weightSum);
  const mode = options?.difficultyMode ?? school.difficultyMode ?? 'add';
  const afterDiff = applyDifficulty(normalized, school.difficulty, mode);
  const s = typeof school.spread === 'number' && school.spread > 0 ? school.spread : 6;
  const prob = school.cutline != null ? probabilityFromScore(afterDiff, school.cutline, s) : probabilityFromScore(afterDiff);
  const finalScore = Math.round(afterDiff * 10) / 10;
  
  let level = '힘듦';
  if (prob >= 0.7) level = '적정';
  else if (prob >= 0.4) level = '경쟁';

  return { schoolId: school.id, finalScore, probability: prob, level };
}

export default { calculateForSchool };