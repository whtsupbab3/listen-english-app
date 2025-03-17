import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Вивчай англійську через аудіокниги",
  description: "Платформа для вивчення англійської мови через аудіокниги",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={firaCode.className}>
        {children}
      </body>
    </html>
  );
}
