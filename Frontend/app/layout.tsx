import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/ui/Header";

export const metadata: Metadata = {
  title: "입시계산기 - 과학고·외고 합격 가능성 분석",
  description: "내신 점수를 입력하면 학교별 환산점수와 합격 확률을 분석합니다.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Remove static class from <body>, let ThemeToggle manage theme classes
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-screen transition-colors duration-300">
        <Header />
        {children}
      </body>
    </html>
  );
}