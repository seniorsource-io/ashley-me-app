"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Inbox,
  Building2,
  UserCog,
} from "lucide-react";

const mainLinks = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
];

const clientLinks = [
  { href: "/clients", label: "All Clients", icon: Users },
];

const communityLinks = [
  { href: "/communities/inquiries", label: "Inquiries", icon: Inbox },
  {
    href: "/communities/directory",
    label: "Directory",
    icon: Building2,
  },
];

const teamLinks = [
  { href: "/team", label: "Team", icon: UserCog },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-[hsl(var(--background))] text-foreground font-medium"
          : "text-[hsl(var(--muted))] hover:text-foreground hover:bg-[hsl(var(--background))]"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium text-[hsl(var(--faint))] uppercase tracking-wider mb-2 mt-5 px-3">
      {children}
    </p>
  );
}

export default function SidebarNav({ userRole }: { userRole?: string | null }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="p-4 flex flex-col">
      {mainLinks.map((link) => (
        <NavLink
          key={link.href}
          {...link}
          active={isActive(link.href)}
        />
      ))}

      <SectionLabel>Clients</SectionLabel>
      {clientLinks.map((link) => (
        <NavLink
          key={link.href}
          {...link}
          active={isActive(link.href)}
        />
      ))}

      <SectionLabel>Communities</SectionLabel>
      {communityLinks.map((link) => (
        <NavLink
          key={link.href}
          {...link}
          active={isActive(link.href)}
        />
      ))}

      {userRole === "admin" && (
        <>
          <SectionLabel>Settings</SectionLabel>
          {teamLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={isActive(link.href)}
            />
          ))}
        </>
      )}
    </nav>
  );
}
