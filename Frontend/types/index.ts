export type Subject = "korean" | "math" | "english" | "science" | "social";

export type SemesterScores = {
  korean: number;
  math: number;
  english: number;
  science: number;
  social: number;
};

export type UserScore = {
  semesters: SemesterScores[];
};

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
  type: "과학고" | "외고";
  location: string;
  studentCount: string;
  history: string;
  description: string;
  subjectWeights: SubjectWeights;
  gradeWeights: GradeWeights;
  cutline?: number;
  difficulty?: number;
};

export type CalculateResult = {
  schoolId: string;
  finalScore: number;
  probability: number;
  level: "상향" | "적정" | "안정";
};

export type CalculateRequest = {
  userScore: UserScore;
};

export type CalculateResponse = CalculateResult[];

export type LevelConfig = {
  label: "상향" | "적정" | "안정";
  color: string;
  bg: string;
  border: string;
};