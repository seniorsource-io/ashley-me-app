import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Senior One Source",
  description: "Free senior living guidance for Portland families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
