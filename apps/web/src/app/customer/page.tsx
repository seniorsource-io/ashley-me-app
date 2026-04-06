import { Metadata } from "next";
import { Heart, Shield, DollarSign } from "lucide-react";
import CustomerContact from "@/components/customer-contact";

export const metadata: Metadata = {
  title: "Find Senior Care — Senior One Source",
  description:
    "Get personalized help finding the right senior living community for your loved one.",
};

const valueProps = [
  {
    icon: Heart,
    title: "Personalized Guidance",
    description: "A dedicated specialist to help your family",
    iconBg: "bg-[hsl(var(--icon-orange))]",
  },
  {
    icon: Shield,
    title: "Trusted Communities",
    description: "Pre-screened and vetted care home options",
    iconBg: "bg-[hsl(var(--icon-green))]",
  },
  {
    icon: DollarSign,
    title: "Free Service",
    description: "No cost to families, ever",
    iconBg: "bg-[hsl(var(--icon-blue))]",
  },
];

export default function CustomerPage() {
  return (
    <section className="flex lg:flex-row flex-col items-center lg:py-0 py-10 gap-10 bg-background">
      {/* Left column — copy + value props */}
      <div className="flex flex-col justify-center">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[hsl(var(--faint))] mb-3 font-body">
          For Families
        </p>
        <h1 className="font-heading text-4xl sm:text-[40px] font-medium leading-[1.1] tracking-tight text-foreground mb-4">
          Find the right care home
        </h1>
        <p className="text-[15px] text-[hsl(var(--muted))] leading-[1.7] mb-8 max-w-lg">
          Share your information and a placement specialist will guide you
          through finding the perfect senior care community.
        </p>

        <div className="flex flex-col gap-3">
          {valueProps.map((prop) => (
            <div
              key={prop.title}
              className="flex items-center gap-4 bg-white rounded-xl px-6 py-5 border border-[hsl(var(--card-border))] shadow-card"
            >
              <div
                className={`w-10 h-10 rounded-[10px] ${prop.iconBg} flex items-center justify-center shrink-0`}
              >
                <prop.icon className="w-5 h-5 text-foreground/70" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-0.5">
                  {prop.title}
                </p>
                <p className="text-[11px] text-[hsl(var(--subtle))]">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — intake form */}
      <div className="flex">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[hsl(var(--card-border))] shadow-card p-7">
          <h2 className="font-heading text-xl font-medium text-foreground mb-1">
            Get started
          </h2>
          <p className="text-[12px] text-[hsl(var(--muted))] mb-5">
            Tell us a little about yourself and we&apos;ll connect you with a
            specialist.
          </p>
          <CustomerContact />
        </div>
      </div>
    </section>
  );
}
