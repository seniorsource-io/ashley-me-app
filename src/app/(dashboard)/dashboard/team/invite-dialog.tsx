"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeamMember } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function InviteDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createTeamMember({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    });

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="bg-foreground text-background">
            <Plus className="h-4 w-4 mr-1.5" />
            Invite Member
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs text-[hsl(var(--muted))] mb-1 block">
              Name
            </label>
            <Input name="name" placeholder="Jane Smith" required className="h-10" />
          </div>
          <div>
            <label className="text-xs text-[hsl(var(--muted))] mb-1 block">
              Email
            </label>
            <Input
              name="email"
              type="email"
              placeholder="jane@seniorsource.io"
              required
              className="h-10"
            />
          </div>
          <div>
            <label className="text-xs text-[hsl(var(--muted))] mb-1 block">
              Role
            </label>
            <select
              name="role"
              defaultValue="user"
              className="w-full rounded-md border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background"
          >
            {loading ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
