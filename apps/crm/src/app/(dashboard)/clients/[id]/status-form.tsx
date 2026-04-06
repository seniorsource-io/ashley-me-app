"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateClientStatus } from "@/app/actions";
import { Button } from "@repo/ui/components/button";

const CLIENT_STATUSES = [
  "new",
  "qualified",
  "searching",
  "placed",
  "moved",
  "invoiced",
  "closed",
] as const;

const CLOSED_REASONS = [
  "paid",
  "deceased",
  "terminated",
  "duplicate",
  "financial_inability",
  "other",
] as const;

export default function ClientStatusForm({
  clientId,
  currentStatus,
  currentClosedReason,
}: {
  clientId: string;
  currentStatus: string;
  currentClosedReason: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [closedReason, setClosedReason] = useState(currentClosedReason ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateClientStatus(
      clientId,
      status,
      status === "closed" ? closedReason || undefined : undefined,
    );

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-[hsl(var(--muted))] mb-1 block">
          Update Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        >
          {CLIENT_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      {status === "closed" && (
        <div>
          <label className="text-xs text-[hsl(var(--muted))] mb-1 block">
            Closed Reason
          </label>
          <select
            value={closedReason}
            onChange={(e) => setClosedReason(e.target.value)}
            className="w-full rounded-md border border-[hsl(var(--border))] bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          >
            <option value="">Select reason...</option>
            {CLOSED_REASONS.map((r) => (
              <option key={r} value={r}>
                {r.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={loading || status === currentStatus}
        size="sm"
        className="bg-foreground text-background"
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
