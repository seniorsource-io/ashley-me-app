import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";
import SidebarNav from "./components/sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-[hsl(var(--border))]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-lg font-medium tracking-tight text-foreground"
          >
            Senior One Source
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[hsl(var(--muted))]">
              {session.user.name ?? session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-56 shrink-0 border-r border-[hsl(var(--border))] bg-white min-h-[calc(100vh-53px)]">
          <SidebarNav userRole={(session.user as { role?: string }).role} />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
