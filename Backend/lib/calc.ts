import { School, UserScore, CalculationResult } from '../types/index';

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

/**
 * 학기별 가중치를 적용한 과목별 평균 점수 계산
 * 🔥 수정 사항: semesterWeights의 기본값을 []로 설정하여 타입 에러를 해결했습니다.
 */
export function semesterWeightedAvg(
  user: UserScore,
  semesterWeights: number[] = [] // ✅ {} 대신 [] 사용으로 빌드 에러 해결
) {
  const subjects = ['korean', 'math', 'english', 'science', 'social'] as const;
  const sums: Record<string, number> = {};

  // 가중치 합 계산
  let weightSum = semesterWeights.reduce((s, w) => s + w, 0);
  const effectiveWeights: number[] = [];

  // 가중치가 없거나 0일 경우 기본값 처리
  if (weightSum <= 0) {
    const n = Math.max(1, user.semesters.length);
    for (let i = 0; i < n; i++) effectiveWeights.push(1);
    weightSum = effectiveWeights.length;
  } else {
    for (let i = 0; i < user.semesters.length; i++) {
      effectiveWeights.push(semesterWeights[i] ?? 0);
    }
  }

  // 합계 초기화
  subjects.forEach((sub) => {
    sums[sub] = 0;
  });

  // 학기별 성적 및 가중치 계산 (2026 입시 트렌드 반영)
  user.semesters.forEach((sem, idx) => {
    const w = effectiveWeights[idx] ?? 0;
    subjects.forEach((sub) => {
      let score = (sem as any)[sub] ?? 0;
      
      // ✅ 기존 기능 유지: 특정 과목 가산점 및 감점 로직
      if (sub === 'math' || sub === 'science') {
        if (score >= 90) score += 2; // 수학/과학 90점 이상 가산점
      }
      if (sub === 'korean' || sub === 'social') {
        if (score < 70) score -= 2; // 국어/사회 70점 미만 감점
      }
      if (sub === 'english') {
        if (score >= 80) score = 90; // 영어 80점 이상 보정
      }
      sums[sub] += score * w;
    });
  });

  const out: Record<string, number> = {};
  subjects.forEach((sub) => {
    out[sub] = weightSum > 0 ? sums[sub] / weightSum : 0;
  });

  return out as Record<(typeof subjects)[number], number>;
}

/**
 * 과목별 가중치 적용 합계 계산
 */
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

/**
 * 100점 만점으로 정규화
 */
export function normalizeTo100(weightedSum: number, weightSum: number) {
  if (weightSum <= 0) return 0;
  const maxWeighted = 100 * weightSum;
  return (weightedSum / maxWeighted) * 100;
}

/**
 * 난이도 보정 적용
 */
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

/**
 * 합격 확률 계산
 */
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

/**
 * 합격 안정권 레벨 판단 (기존 로직 유지)
 */
export function levelFromFinalScore(finalScore: number | null, cutline?: number, difficulty?: number, spread?: number) {
  if (finalScore == null) return '미정';
  const s = typeof spread === 'number' && spread > 0 ? spread : 6;
  const prob = probabilityFromScore(finalScore, cutline, s);
  if (prob >= 0.7) return '적정';
  if (prob >= 0.4) return '경쟁';
  return '힘듦';
}

/**
 * 특정 학교에 대한 최종 성적 계산 및 결과 반환
 */
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
  
  let prob = school.cutline != null
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

export default {
  semesterWeightedAvg,
  weightedSubjectSum,
  normalizeTo100,
  applyDifficulty,
  probabilityFromScore,
  calculateForSchool,
};