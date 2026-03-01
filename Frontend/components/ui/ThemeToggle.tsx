"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);


  // Sync both <html> and <body> for theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark =
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
      document.body.classList.toggle("dark", isDark);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.theme = "light";
    }
  };

  return (
    <button
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      onClick={toggle}
      className="ml-4 p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 transition text-neutral-900 hover:text-black dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
      type="button"
    >
      {dark ? <span aria-hidden>🌞</span> : <span aria-hidden>🌙</span>}
    </button>
  );
}
