import { School, UserScore, CalculationResult } from '../types/index';

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export function semesterWeightedAvg(
  user: UserScore,
  semesterWeights: number[]
) {
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

  subjects.forEach((sub) => {
    sums[sub] = 0;
  });

  user.semesters.forEach((sem, idx) => {
    const w = effectiveWeights[idx] ?? 0;
    subjects.forEach((sub) => {
      sums[sub] += (sem[sub] ?? 0) * w;
    });
  });

  const out: Record<string, number> = {};
  subjects.forEach((sub) => {
    out[sub] = weightSum > 0 ? sums[sub] / weightSum : 0;
  });

  return out as Record<(typeof subjects)[number], number>;
}

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
    if (finalScore >= 95) return 0.98;
    if (finalScore >= 90) return 0.9;
    if (finalScore >= 80) return 0.75;
    if (finalScore >= 70) return 0.5;
    if (finalScore >= 60) return 0.25;
    return 0.05;
  }
  const s = typeof spread === 'number' && spread > 0 ? spread : 6;
  return clamp(Number(sigmoid((finalScore - cutline) / s).toFixed(4)), 0, 1);
}

export function levelFromProbability(p: number | null) {
  if (p == null) return '미정';
  if (p >= 0.75) return '적정';
  if (p >= 0.4) return '경쟁';
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
  const s =
    typeof school.spread === 'number' && school.spread > 0 ? school.spread : 6;
  const prob =
    school.cutline != null
      ? probabilityFromScore(afterDifficulty, school.cutline, s)
      : probabilityFromScore(afterDifficulty);
  return {
    schoolId: school.id,
    finalScore: Math.round(afterDifficulty * 10) / 10,
    probability: prob,
    level: levelFromProbability(prob),
  };
}

export default {
  semesterWeightedAvg,
  weightedSubjectSum,
  normalizeTo100,
  applyDifficulty,
  probabilityFromScore,
  calculateForSchool,
};
