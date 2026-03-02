"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();

  const nav = [
    { name: "학교 데이터", href: "/schools" },
    { name: "성적 분석", href: "/calculate" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="ScoreLab" className="w-9 h-9 rounded-md object-cover" />
          <span className="text-xs tracking-widest uppercase font-mono text-[var(--brand)] dark:text-[var(--brand-light)] hover:opacity-90 transition">scorelab</span>
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative pb-1 transition ${
                  active
                    ? "text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-neutral-600 hover:text-cyan-500 dark:text-neutral-400 dark:hover:text-cyan-400"
                }`}
              >
                {item.name}
                {/* Active underline */}
                {active && (
                  <span className="absolute left-0 bottom-0 w-full h-px bg-white dark:bg-neutral-900" />
                )}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

      </div>
    </header>
  );
}