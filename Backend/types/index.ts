export type SubjectWeights = {
  korean: number;
  math: number;
  english: number;
  science: number;
  social: number;
};

export type GradeWeights = {
  semesterWeights: number[];
};

export type School = {
  id: string;
  name: string;
  type: '과학고' | '외고' | '특성화고' | string;
  location: string;
  studentCount: string;
  history: string;
  description: string;
  subjectWeights: SubjectWeights;
  gradeWeights: GradeWeights;
  cutline?: number;
  difficulty?: number; // ✅ 중복 제거됨
  difficultyMode?: 'add' | 'mul';
  spread?: number;
}; // ✅ 괄호 닫힘

export type UserScore = {
  semesters: {
    korean: number;
    math: number;
    english: number;
    science: number;
    social: number;
  }[];
};

export type CalculationResult = {
  schoolId: string;
  finalScore: number;
  probability: number | null;
  level: string;
};