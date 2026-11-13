import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "로또픽 — 나만의 행운 번호 만들기",
  description: "로또 6/45 번호를 간편하게 생성하고 나만의 조합을 만들어보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
