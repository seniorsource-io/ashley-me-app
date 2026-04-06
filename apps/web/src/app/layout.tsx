import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "@repo/ui/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Senior One Source",
  description: "Free senior living guidance for Portland families.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex flex-1 items-center justify-center">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
