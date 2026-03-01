import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/ui/Header";

export const metadata: Metadata = {
  title: "입시계산기 - 과학고·외고 합격 가능성 분석",
  description: "내신 점수를 입력하면 학교별 환산점수와 합격 확률을 분석합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}