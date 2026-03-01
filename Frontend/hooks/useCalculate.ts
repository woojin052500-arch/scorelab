"use client";

import { useState, useCallback } from "react";
import { UserScore, CalculateResponse } from "../types";
import { API_BASE_URL } from "../lib/api";

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
      const res = await fetch(`${API_BASE_URL}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userScore }),
      });
      if (!res.ok) throw new Error("계산에 실패했습니다.");
      const results = await res.json();
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