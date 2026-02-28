import { School, SemesterScores, UserScore, Subject, CalculateResult } from "@/types";

const SUBJECTS: Subject[] = ["korean", "math", "english", "science", "social"];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function sumWeights(weights: number[]): number {
  return weights.reduce((acc, w) => acc + w, 0);
}

function calcSubjectSemesterAvg(
  semesters: SemesterScores[],
  semesterWeights: number[]
): Record<Subject, number> {
  const weights = semesterWeights.slice(0, semesters.length);
  const totalWeight = sumWeights(weights);

  const result = {} as Record<Subject, number>;
  for (const subject of SUBJECTS) {
    const weightedSum = semesters.reduce((acc, sem, i) => {
      return acc + sem[subject] * (weights[i] ?? 1);
    }, 0);
    result[subject] = weightedSum / totalWeight;
  }
  return result;
}

function calcWeightedScore(
  subjectAvg: Record<Subject, number>,
  subjectWeights: School["subjectWeights"]
): number {
  return SUBJECTS.reduce((acc, subject) => {
    return acc + subjectAvg[subject] * subjectWeights[subject];
  }, 0);
}

function normalize(weightedScore: number, subjectWeights: School["subjectWeights"]): number {
  const maxWeightedScore = 100 * sumWeights(SUBJECTS.map((s) => subjectWeights[s]));
  return (weightedScore / maxWeightedScore) * 100;
}

function applyDifficulty(score: number, difficulty: number): number {
  return clamp(score + difficulty, 0, 100);
}

function calcProbability(finalScore: number, cutline?: number): number {
  if (cutline == null) {
    const table = [
      { min: 95, prob: 0.95 },
      { min: 90, prob: 0.85 },
      { min: 85, prob: 0.72 },
      { min: 80, prob: 0.58 },
      { min: 75, prob: 0.42 },
      { min: 70, prob: 0.28 },
      { min: 0, prob: 0.12 },
    ];
    return table.find((t) => finalScore >= t.min)?.prob ?? 0.05;
  }

  const spread = 5;
  const x = (finalScore - cutline) / spread;
  return 1 / (1 + Math.exp(-x));
}

function calcLevel(probability: number): CalculateResult["level"] {
  if (probability >= 0.75) return "안정";
  if (probability >= 0.45) return "적정";
  return "상향";
}

export function calculateForSchool(school: School, userScore: UserScore): CalculateResult {
  const { semesters } = userScore;
  const { subjectWeights, gradeWeights, cutline, difficulty } = school;

  const subjectAvg = calcSubjectSemesterAvg(semesters, gradeWeights.semesterWeights);
  const weightedScore = calcWeightedScore(subjectAvg, subjectWeights);
  const normalized = normalize(weightedScore, subjectWeights);
  const finalScore = applyDifficulty(normalized, difficulty ?? 0);
  const probability = calcProbability(finalScore, cutline);
  const level = calcLevel(probability);

  return {
    schoolId: school.id,
    finalScore: Math.round(finalScore * 10) / 10,
    probability: Math.round(probability * 1000) / 1000,
    level,
  };
}

export function calculateAll(schools: School[], userScore: UserScore): CalculateResult[] {
  return schools
    .map((school) => calculateForSchool(school, userScore))
    .sort((a, b) => b.finalScore - a.finalScore);
}