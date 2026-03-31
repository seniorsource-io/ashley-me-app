"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  const searchParams = useSearchParams();

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  if (totalPages <= 1) return null;

  const linkClass =
    "inline-flex items-center justify-center rounded-md border border-[hsl(var(--border))] bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-[hsl(var(--background))] transition-colors";

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-[hsl(var(--muted))]">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={buildHref(page - 1)} className={linkClass}>
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link href={buildHref(page + 1)} className={linkClass}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
