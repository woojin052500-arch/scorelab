import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 tracking-tight">
          입시계산기
        </Link>
        <nav className="flex gap-4">
          <Link href="/schools" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            학교 목록
          </Link>
          <Link href="/calculate" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            성적 분석
          </Link>
        </nav>
      </div>
    </header>
  );
}