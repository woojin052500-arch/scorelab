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
  };
}

export default { calculateForSchool };git rm -r --cached .