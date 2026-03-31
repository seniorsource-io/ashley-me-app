import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Welcome{session.user.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="mt-2 text-sm text-[hsl(var(--muted))]">
        This is your dashboard. The CRM pipeline view will be built here next.
      </p>
    </div>
  );
}
