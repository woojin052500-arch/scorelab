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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="text-xs tracking-[0.35em] uppercase text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition">
          scorelab
        </Link>

        {/* Right Navigation */}
        <nav className="flex items-center gap-12 text-sm font-medium">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative pb-1 transition ${
                  active
                    ? "text-neutral-900 dark:text-neutral-900"
                    : "text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
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