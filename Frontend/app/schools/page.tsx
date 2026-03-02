"use client";
import { SchoolCard } from "../../components/schools/SchoolCard";
import { useSchools } from "../../hooks/useSchools";

export default function SchoolsPage() {
  const { schools, loading, error } = useSchools();

  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 w-full max-w-6xl mx-auto px-8 py-24">
      <h1 className="text-5xl font-extrabold text-neutral-900 dark:text-white mb-6 text-left">학교 목록</h1>
      <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 text-left max-w-xl">Scorelab이 분석하는 모든 학교 정보를 한눈에 확인하세요.</p>
      {loading ? (
        <div className="text-center py-24 text-neutral-400 dark:text-neutral-500 text-xl">불러오는 중...</div>
      ) : error ? (
        <div className="text-center py-24 text-red-400 text-xl">{error}</div>
      ) : (
        <section>
          <h2 className="text-lg font-semibold text-neutral-500 dark:text-neutral-300 mb-6 text-left">전체 학교 <span className="text-cyan-500 dark:text-cyan-400">{schools.length}개교</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}