import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Ashley Krause",
  description: "Ashley Krause, Senior Living Advisor",
  openGraph: {
    title: "Ashley Krause",
    description: "Your Trusted Senior Living Advisor",
    url: "https://ashleykrause.me",
    siteName: "ashleykrause.me",
    images: [
      {url: "https://ashleykrause.me/og-image.png", width: 1200, height: 337, alt: "Ashley Krause"},
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
