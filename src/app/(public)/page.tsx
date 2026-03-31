import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <Hero />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
}
