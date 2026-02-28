import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">입시 합격 가능성 분석</h1>
          <p className="text-gray-500 text-base leading-relaxed">
            내신 점수를 입력하면 과학고·외고별 환산점수와<br />
            합격 가능성을 분석해 드립니다.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/calculate"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-8 py-3.5 transition-colors"
          >
            지금 바로 분석하기
          </Link>
          <Link
            href="/schools"
            className="inline-block text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
          >
            학교 목록 보기
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
          {[
            { label: "분석 학교 수", value: "6개교" },
            { label: "학교 유형", value: "과학고·외고" },
            { label: "계산 방식", value: "학교별 맞춤 가중치" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-bold text-indigo-600">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}