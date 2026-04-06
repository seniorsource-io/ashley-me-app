"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/app/actions";
import { Button } from "@repo/ui/components/button";

const INQUIRY_STATUSES = ["new", "contacted", "joined", "closed"] as const;

export default function InquiryStatusForm({
  inquiryId,
  currentStatus,
}: {
  inquiryId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateInquiryStatus(inquiryId, status);

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
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

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
