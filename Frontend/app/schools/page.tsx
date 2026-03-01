import { SCHOOLS } from "../../lib/schools-data";
import { SchoolCard } from "../../components/schools/SchoolCard";

export default function SchoolsPage() {
  const science = SCHOOLS.filter((s) => s.type === "과학고");
  const foreign = SCHOOLS.filter((s) => s.type === "외고");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">학교 목록</h1>
        <p className="text-sm text-gray-500 mt-1">분석 대상 학교 정보를 확인하세요.</p>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">과학고 ({science.length}개교)</h2>
        <div className="grid grid-cols-1 gap-3">
          {science.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">외국어고 ({foreign.length}개교)</h2>
        <div className="grid grid-cols-1 gap-3">
          {foreign.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </section>
    </main>
  );
}