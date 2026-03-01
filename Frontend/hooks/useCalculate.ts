"use client";

import { useState, useCallback } from "react";
import { UserScore, CalculateResponse } from "../types";
import { calculateAll } from "../lib/calculator";
import { SCHOOLS } from "../lib/schools-data";

type State = {
  data: CalculateResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function useCalculate() {
  const [state, setState] = useState<State>({
    data: null,
    isLoading: false,
    error: null,
  });

  const calculate = useCallback(async (userScore: UserScore) => {
    setState({ data: null, isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const results = calculateAll(SCHOOLS, userScore);
      setState({ data: results, isLoading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "계산 중 오류가 발생했습니다.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, calculate, reset };
}