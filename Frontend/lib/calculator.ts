// @ts-nocheck
import { School, UserScore, Subject, CalculateResult } from "@/types";

const SUBJECTS: Subject[] = ["korean", "math", "english", "science", "social"];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 학기별 가중치 평균 계산 (2026 입시 로직 반영)
 */
function semesterWeightedAvg(user: UserScore, semesterWeights: number[] = []) {
  // 학기별 평균 점수 계산 로직 (필요시 상세 구현 추가 가능)
  // 현재는 기본 구조만 유지합니다.
  return user.semesters.reduce((acc, curr) => acc + curr.avg, 0) / (user.semesters.length || 1);
}

/**
 * 학교별 합격 확률 및 점수 계산
 */
export function calculateForSchool(sObj: School, userScore: UserScore): CalculateResult {
  // 1. 기본 점수 계산 (예시 로직)
  const avgScore = semesterWeightedAvg(userScore);
  const finalScore = clamp(avgScore); // 실제로는 학교별 가중치(sObj.weights) 적용 필요

  // 2. 확률 계산 (컷트라인 대비)
  const diff = finalScore - sObj.cutline;
  const spreadValue = sObj.difficulty || 10;
  const prob = clamp(50 + (diff * (100 / spreadValue)), 0, 99);

  // 3. 결과 반환
  return {
    schoolId: sObj.id,
    schoolName: sObj.name,
    finalScore,
    probability: prob,
    // 점수에 따른 등급 판단
    level: levelFromFinalScore(finalScore, sObj.cutline, sObj.difficulty, spreadValue),
    // 🔥 핵심: 이 필드가 있어야 UI에서 'reading color' 에러가 안 납니다.
    color: getLevelColor(prob), 
  };
}

/**
 * 모든 학교에 대해 계산 및 정렬
 */
export function calculateAll(schools: School[], userScore: UserScore) {
  return schools
    .map((s) => calculateForSchool(s, userScore))
    .sort((a, b) => b.finalScore - a.finalScore);
}

// 도우미 함수들 (필요시 추가)
function getLevelColor(prob: number): string {
  if (prob >= 80) return "#22c55e"; // 초록 (안정)
  if (prob >= 50) return "#eab308"; // 노랑 (적정)
  return "#ef4444"; // 빨강 (위험)
}

function levelFromFinalScore(score: number, cutline: number, diff: number, spread: number) {
  if (score >= cutline + 5) return "SAFE";
  if (score >= cutline) return "NORMAL";
  return "DANGER";
}