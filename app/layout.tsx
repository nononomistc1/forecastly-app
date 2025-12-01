import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forecastly",
  description: "A weather forecast application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

