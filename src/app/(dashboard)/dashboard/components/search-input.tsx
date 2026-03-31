"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput({ basePath }: { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const defaultValue = searchParams.get("search") ?? "";

  function onChange(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
        params.delete("page");
      } else {
        params.delete("search");
      }
      router.replace(`${basePath}?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="relative mb-6 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted))]" />
      <Input
        placeholder="Search communities..."
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10"
      />
    </div>
  );
}
