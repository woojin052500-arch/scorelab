"use client";

import { useState, useCallback } from "react";
import { SemesterScores, UserScore } from "../types";
import { validateUserScore, ValidationError } from "../lib/validation";

const EMPTY_SEMESTER: SemesterScores = {
  korean: 0,
  math: 0,
  english: 0,
  science: 0,
  social: 0,
};

const EXAMPLE_SEMESTERS: SemesterScores[] = [
  { korean: 95, math: 98, english: 93, science: 99, social: 92 },
  { korean: 94, math: 97, english: 91, science: 98, social: 90 },
];

type FormSemester = Record<keyof SemesterScores, string>;

function toFormSemester(sem: SemesterScores): FormSemester {
  return {
    korean: String(sem.korean),
    math: String(sem.math),
    english: String(sem.english),
    science: String(sem.science),
    social: String(sem.social),
  };
}

function toSemesterScores(form: FormSemester): SemesterScores {
  return {
    korean: Number(form.korean),
    math: Number(form.math),
    english: Number(form.english),
    science: Number(form.science),
    social: Number(form.social),
  };
}

export function useScoreForm() {
  const [semesters, setSemesters] = useState<FormSemester[]>([
    toFormSemester(EMPTY_SEMESTER),
  ]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const updateScore = useCallback(
    (semesterIndex: number, subject: keyof SemesterScores, value: string) => {
      setSemesters((prev) => {
        const next = [...prev];
        next[semesterIndex] = { ...next[semesterIndex], [subject]: value };
        return next;
      });
      setTouched((prev) => {
        const next = new Set(prev);
        next.add(`semesters.${semesterIndex}.${subject}`);
        return next;
      });
    },
    []
  );

  const addSemester = useCallback(() => {
    if (semesters.length >= 4) return;
    setSemesters((prev) => [...prev, toFormSemester(EMPTY_SEMESTER)]);
  }, [semesters.length]);

  const removeSemester = useCallback((index: number) => {
    setSemesters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const fillExample = useCallback(() => {
    setSemesters(EXAMPLE_SEMESTERS.map(toFormSemester));
    setErrors([]);
    setTouched(new Set());
  }, []);

  const validate = useCallback((): UserScore | null => {
    const userScore: UserScore = {
      semesters: semesters.map(toSemesterScores),
    };
    const errs = validateUserScore(userScore);
    setErrors(errs);
    const allFields = new Set<string>();
    semesters.forEach((_, i) => {
      (["korean", "math", "english", "science", "social"] as const).forEach((s) => {
        allFields.add(`semesters.${i}.${s}`);
      });
    });
    setTouched(allFields);
    if (errs.length > 0) return null;
    return userScore;
  }, [semesters]);

  const getFieldError = useCallback(
    (field: string): string | undefined => {
      if (!touched.has(field)) return undefined;
      return errors.find((e) => e.field === field)?.message;
    },
    [errors, touched]
  );

  return {
    semesters,
    errors,
    updateScore,
    addSemester,
    removeSemester,
    fillExample,
    validate,
    getFieldError,
    semesterCount: semesters.length,
  };
}