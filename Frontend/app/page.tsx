import Link from "next/link";

export default function HomePage() {
  return (

    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Left */}
        <div className="space-y-12">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-neutral-900 dark:text-white">
            입시는 감이 아니라<br />
            <span className="text-cyan-500 dark:text-cyan-400">데이터로 결정됩니다</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl font-medium">
            Scorelab은 내신 점수를 기반으로 학교별 환산 구조와 가중치를 적용해
            <span className="text-cyan-500 dark:text-cyan-400 font-bold"> 합격 가능성</span>을 수치화합니다.
          </p>
          <div className="flex gap-4">
            <Link
              href="/calculate"
              className="px-8 py-4 rounded-full bg-cyan-500 dark:bg-cyan-400 text-white dark:text-neutral-950 text-base font-bold hover:bg-cyan-400 dark:hover:bg-cyan-300 transition shadow"
            >
              분석 시작
            </Link>
            <Link
              href="/schools"
              className="px-8 py-4 rounded-full border border-cyan-500 dark:border-cyan-400 text-base text-cyan-500 dark:text-cyan-400 font-bold hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-neutral-950 transition shadow"
            >
              학교 목록
            </Link>
          </div>
        </div>
        {/* Right – Preview */}
        <div className="rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-10 space-y-8 shadow-xl">
          <p className="text-base text-neutral-500 dark:text-neutral-400 font-semibold tracking-wide">
            분석 미리보기
          </p>
          <div className="space-y-4">
            {[
              { label: "서울과학고", value: "87.4%" },
              { label: "한성과학고", value: "72.1%" },
              { label: "대원외고", value: "64.8%" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center rounded-xl bg-neutral-200 dark:bg-neutral-800 px-6 py-5"
              >
                <span className="text-base text-neutral-900 dark:text-white font-semibold">
                  {item.label}
                </span>
                <span className="text-xl font-extrabold text-cyan-500 dark:text-cyan-400">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            * 실제 데이터 구조를 기반으로 한 예시 화면입니다
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {[
            { label: "분석 대상 학교", value: "6" },
            { label: "지원 유형", value: "과학고 · 외고" },
            { label: "분석 모델", value: "가중치 기반" },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <p className="text-3xl font-extrabold text-cyan-500 dark:text-cyan-400">
                {item.value}
              </p>
              <p className="text-base text-neutral-500 dark:text-neutral-400 font-semibold">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white mb-16">
          scorelab 분석 흐름
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "내신 입력",
              desc: "학기별 성적을 구조화된 방식으로 입력합니다",
            },
            {
              step: "02",
              title: "학교별 환산",
              desc: "각 학교의 반영 비율과 가중치를 적용합니다",
            },
            {
              step: "03",
              title: "합격 확률 분석",
              desc: "과거 데이터 기반 모델로 가능성을 산출합니다",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-4">
              <span className="text-cyan-500 dark:text-cyan-400 text-lg font-bold">
                {item.step}
              </span>
              <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}