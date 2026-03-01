"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE_URL } from "@/lib/api";
import { School } from "@/types";
import { BarChart } from "@/lib/bar-chart";

type Props = {
  params: { id: string };
};

export default function SchoolDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/schools/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("학교 정보를 불러오지 못했습니다.");
        return res.json();
      })
      .then((data) => {
        setSchool(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.message || "학교 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const subjectLabels: Record<string, string> = {
    korean: "국어",
    math: "수학",
    english: "영어",
    science: "과학",
    social: "사회",
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-8 py-24 text-center text-neutral-400 dark:text-gray-400 text-xl">불러오는 중...</div>;
  }
  if (error || !school) {
    return <div className="max-w-3xl mx-auto px-8 py-24 text-center text-red-400 text-xl">{error || "학교 정보를 찾을 수 없습니다."}</div>;
  }

  const totalSubjectWeight = Object.values(school.subjectWeights).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 max-w-3xl mx-auto px-8 py-24">
      <Link href="/schools" className="text-base text-blue-500 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors mb-8 inline-block font-semibold">
        ← 목록으로
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            {school.type}
          </span>
          <span className="text-xs text-gray-400 dark:text-neutral-400">{school.location}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-cyan-400 mb-2">{school.name}</h1>
        <p className="text-lg text-gray-700 dark:text-neutral-300 mt-2 leading-relaxed">{school.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-blue-100 dark:border-cyan-900 shadow-md p-6">
          <p className="text-xs text-gray-400 dark:text-neutral-400 mb-1">학생 수</p>
          <p className="font-bold text-blue-700 dark:text-cyan-400 text-lg">{school.studentCount}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-blue-100 dark:border-cyan-900 shadow-md p-6">
          <p className="text-xs text-gray-400 dark:text-neutral-400 mb-1">설립</p>
          <p className="font-bold text-blue-700 dark:text-cyan-400 text-lg">{school.history}</p>
        </div>
        {school.cutline != null && (
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-blue-100 dark:border-cyan-900 shadow-md p-6">
            <p className="text-xs text-gray-400 dark:text-neutral-400 mb-1">커트라인 (참고)</p>
            <p className="font-bold text-blue-700 dark:text-cyan-400 text-lg">{school.cutline}점</p>
          </div>
        )}
        {school.difficulty != null && (
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-blue-100 dark:border-cyan-900 shadow-md p-6">
            <p className="text-xs text-gray-400 dark:text-neutral-400 mb-1">난이도 보정</p>
            <p className="font-bold text-blue-700 dark:text-cyan-400 text-lg">
              {school.difficulty > 0 ? `+${school.difficulty}` : school.difficulty}점
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-blue-100 dark:border-cyan-900 shadow-md p-8 mb-8">
        <h2 className="text-lg font-bold text-blue-600 dark:text-cyan-400 mb-6">과목별 가중치 비중</h2>
        <div className="flex flex-col items-center">
          <BarChart
            labels={Object.keys(school.subjectWeights).map((k) => subjectLabels[k] || k)}
            data={Object.values(school.subjectWeights)}
            width={320}
            height={240}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-blue-100 dark:border-cyan-900 shadow-md p-8 mb-10">
        <h2 className="text-lg font-bold text-blue-600 dark:text-cyan-400 mb-4">학기별 반영 비율</h2>
        <div className="flex gap-4">
          {school.gradeWeights.semesterWeights.map((w, i) => (
            <div key={i} className="flex-1 text-center rounded-xl border border-blue-100 dark:border-cyan-900 bg-blue-50 dark:bg-neutral-800 py-4">
              <p className="text-xs text-gray-400 dark:text-neutral-400">{i + 1}학기</p>
              <p className="font-bold text-blue-700 dark:text-cyan-400 text-lg mt-1">{w}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/calculate"
        className="block w-full text-center bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-cyan-700 dark:to-cyan-400 hover:from-blue-600 hover:to-cyan-500 dark:hover:from-cyan-800 dark:hover:to-cyan-300 text-white font-extrabold rounded-2xl py-4 text-lg shadow-lg transition-colors"
      >
        이 학교로 합격 가능성 분석하기
      </Link>
    </main>
  );
}
