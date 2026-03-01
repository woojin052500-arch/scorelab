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
  type: '과학고' | '외고' | string;
  location: string;
  studentCount: string;
  history: string;
  description: string;
  subjectWeights: SubjectWeights;
  gradeWeights: GradeWeights;
  cutline?: number;
  difficulty?: number;
  difficulty?: number
  difficultyMode?: 'add' | 'mul'
  spread?: number

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
