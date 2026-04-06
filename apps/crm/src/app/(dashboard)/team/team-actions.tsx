"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTeamMemberRole, removeTeamMember } from "@/app/actions";
import { Button } from "@repo/ui/components/button";

export default function TeamActions({
  memberId,
  currentRole,
}: {
  memberId: string;
  currentRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRoleToggle() {
    setLoading(true);
    const newRole = currentRole === "admin" ? "user" : "admin";
    const result = await updateTeamMemberRole(memberId, newRole);
    if (result.success) router.refresh();
    setLoading(false);
  }

  async function handleRemove() {
    if (!confirm("Remove this team member? This cannot be undone.")) return;
    setLoading(true);
    const result = await removeTeamMember(memberId);
    if (result.success) router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="xs"
        onClick={handleRoleToggle}
        disabled={loading}
        className="text-xs"
      >
        {currentRole === "admin" ? "Demote" : "Promote"}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={handleRemove}
        disabled={loading}
        className="text-xs text-destructive hover:text-destructive"
      >
        Remove
      </Button>
    </div>
  );
}
