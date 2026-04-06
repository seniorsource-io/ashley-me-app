import { Metadata } from "next";
import { Mail, Users, TrendingUp } from "lucide-react";
import CommunityForm from "@/components/community-form";

export const metadata: Metadata = {
  title: "Join Our Network — Senior One Source",
  description:
    "Partner with Senior One Source to receive qualified referrals and grow your care home community.",
};

const valueProps = [
  {
    icon: Mail,
    title: "Qualified Referrals",
    description: "Matched families sent directly to you",
    iconBg: "bg-[hsl(var(--icon-orange))]",
  },
  {
    icon: Users,
    title: "Provider Network",
    description: "Join a circle of senior care professionals",
    iconBg: "bg-[hsl(var(--icon-green))]",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Community",
    description: "Tools and support to fill your vacancies",
    iconBg: "bg-[hsl(var(--icon-blue))]",
  },
];

export default function CommunityPage() {
  return (
    <section className="flex lg:flex-row flex-col items-center lg:py-0 py-10 gap-10 bg-background">
      {/* Left column — copy + value props */}
      <div className="flex flex-col justify-center">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[hsl(var(--faint))] mb-3 font-body">
          For Care Home Providers
        </p>
        <h1 className="font-heading text-4xl sm:text-[40px] font-medium leading-[1.1] tracking-tight text-foreground mb-4">
          Join our referral network
        </h1>
        <p className="text-[15px] text-[hsl(var(--muted))] leading-[1.7] mb-8 max-w-lg">
          Partner with Senior One Source to receive qualified referrals, connect
          with families, and grow your community.
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

      {/* Right column — contact form */}
      <div className="flex">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[hsl(var(--card-border))] shadow-card p-7">
          <h2 className="font-heading text-xl font-medium text-foreground mb-1">
            Get in touch
          </h2>
          <p className="text-[12px] text-[hsl(var(--muted))] mb-5">
            Tell us about your community and we&apos;ll reach out to connect.
          </p>
          <CommunityForm />
        </div>
      </div>
    </section>
  );
}
