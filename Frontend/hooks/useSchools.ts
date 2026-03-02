"use client";


import { useEffect, useState, useCallback } from "react";
import { School } from "../types";
import { API_BASE_URL } from "../lib/api";

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/schools`)
      .then((res) => {
        if (!res.ok) throw new Error("학교 목록을 불러오지 못했습니다.");
        return res.json();
      })
      .then((data) => {
        setSchools(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.message || "학교 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getSchool = useCallback(
    (id: string): School | undefined => schools.find((s) => s.id === id),
    [schools]
  );

  return { schools, getSchool, loading, error };
}