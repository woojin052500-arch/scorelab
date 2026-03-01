// @ts-nocheck
import { School, UserScore, CalculationResult } from '../types/index';

const SUBJECTS = ['korean', 'math', 'english', 'science', 'social'] as const;

export function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = []) { // ✅ 여기 [] 확인!
  const sums: Record<string, number> = [];
  SUBJECTS.forEach((s) => (sums[s] = 0));
  let totalWeight = 0;

  semesterWeights.forEach((w, i) => {
    const semester = user.semesters[i];
    if (semester) {
      SUBJECTS.forEach((sub) => {
        let score = (semester as any)[sub] ?? 0;
        if (sub === 'math' || sub === 'science') if (score >= 90) score += 2;
        if (sub === 'korean' || sub === 'social') if (score < 70) score -= 2;
        if (sub === 'english') if (score >= 80) score = 90;
        sums[sub] += score * w;
      });
      totalWeight += w;
    }
  });

  const out: Record<string, number> = {};
  SUBJECTS.forEach((s) => { out[s] = totalWeight > 0 ? sums[sub] / totalWeight : 0; });
  return out;
}

export function calculateForSchool(school: School, user: UserScore, options?: any): CalculationResult {
  const semesterWeights = school.gradeWeights?.semesterWeights ?? [];
  const subjectAvg = semesterWeightedAvg(user, semesterWeights);
  const finalScore = 0; // 상세 로직은 기존 calc.ts 유지
  return { schoolId: school.id, finalScore: 0, probability: 0.5, level: '적정' };
}
export default { calculateForSchool };