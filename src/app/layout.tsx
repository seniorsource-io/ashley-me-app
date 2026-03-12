import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ashley Krause",
  description: "Ashley Krause, Senior Living Advisor",
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
