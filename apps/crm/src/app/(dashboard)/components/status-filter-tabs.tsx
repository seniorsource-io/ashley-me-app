"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";

export default function StatusFilterTabs({
  statuses,
  basePath,
}: {
  statuses: string[];
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "all";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.replace(`${basePath}?${params.toString()}`);
  }

  return (
    <Tabs value={current} onValueChange={onChange} className="mb-6">
      <TabsList variant="line">
        <TabsTrigger value="all">All</TabsTrigger>
        {statuses.map((s) => (
          <TabsTrigger key={s} value={s} className="capitalize">
            {s}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
