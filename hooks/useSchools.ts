"use client";

import { useMemo } from "react";
import { SCHOOLS } from "../lib/schools-data";
import { School } from "../types";

export function useSchools() {
  const schools = useMemo(() => SCHOOLS, []);

  const getSchool = (id: string): School | undefined => {
    return schools.find((s) => s.id === id);
  };

  return { schools, getSchool };
}