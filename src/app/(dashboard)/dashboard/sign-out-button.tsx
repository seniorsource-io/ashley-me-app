"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted))] hover:text-foreground transition-colors cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  );
}
