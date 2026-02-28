import { SCHOOLS } from "@/lib/schools-data";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
  return SCHOOLS.map((s) => ({ id: s.id }));
}

export default function SchoolDetailPage({ params }: Props) {
  const school = SCHOOLS.find((s) => s.id === params.id);
  if (!school) notFound();

  const subjectLabels: Record<string, string> = {
    korean: "국어",
    math: "수학",
    english: "영어",
    science: "과학",
    social: "사회",
  };

  const totalSubjectWeight = Object.values(school.subjectWeights).reduce((a, b) => a + b, 0);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/schools" className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 inline-block">
        ← 목록으로
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {school.type}
          </span>
          <span className="text-xs text-gray-400">{school.location}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{school.name}</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{school.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="border border-gray-100 rounded-xl p-4 bg-white">
          <p className="text-xs text-gray-400 mb-1">학생 수</p>
          <p className="font-semibold text-gray-800">{school.studentCount}</p>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 bg-white">
          <p className="text-xs text-gray-400 mb-1">설립</p>
          <p className="font-semibold text-gray-800">{school.history}</p>
        </div>
        {school.cutline != null && (
          <div className="border border-gray-100 rounded-xl p-4 bg-white">
            <p className="text-xs text-gray-400 mb-1">커트라인 (참고)</p>
            <p className="font-semibold text-gray-800">{school.cutline}점</p>
          </div>
        )}
        {school.difficulty != null && (
          <div className="border border-gray-100 rounded-xl p-4 bg-white">
            <p className="text-xs text-gray-400 mb-1">난이도 보정</p>
            <p className="font-semibold text-gray-800">
              {school.difficulty > 0 ? `+${school.difficulty}` : school.difficulty}점
            </p>
          </div>
        )}
      </div>

      <div className="border border-gray-100 rounded-xl p-5 bg-white mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">과목별 가중치</h2>
        <div className="space-y-2.5">
          {Object.entries(school.subjectWeights).map(([key, weight]) => {
            const pct = (weight / totalSubjectWeight) * 100;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">{subjectLabels[key]}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-700 w-6 text-right">{weight}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl p-5 bg-white mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">학기별 반영 비율</h2>
        <div className="flex gap-3">
          {school.gradeWeights.semesterWeights.map((w, i) => (
            <div key={i} className="flex-1 text-center border border-gray-100 rounded-lg py-3">
              <p className="text-xs text-gray-400">{i + 1}학기</p>
              <p className="font-semibold text-gray-800 mt-1">{w}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/calculate"
        className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-3.5 text-sm transition-colors"
      >
        이 학교로 합격 가능성 분석하기
      </Link>
    </main>
  );
}