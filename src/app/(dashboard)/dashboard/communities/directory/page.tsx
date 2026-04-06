import Link from "next/link";
import { getCommunities } from "@/lib/queries";
import PageHeader from "../../components/page-header";
import SearchInput from "../../components/search-input";
import Pagination from "../../components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { communities, total, totalPages } = await getCommunities(page, search);

  return (
    <>
      <PageHeader
        title="Communities Directory"
        description={`${total} communities`}
      />
      <SearchInput basePath="/dashboard/communities/directory" />

      <div className="rounded-lg border border-[hsl(var(--border))] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name / Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {communities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-[hsl(var(--muted))]"
                >
                  No communities found.
                </TableCell>
              </TableRow>
            ) : (
              communities.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/communities/directory/${c.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {c.title ?? c.address}
                    </Link>
                    {c.title && (
                      <p className="text-xs text-[hsl(var(--muted))]">
                        {c.address}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {c.city}
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {c.licensedBeds ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border-0 font-medium text-[11px] ${c.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {c.memoryCare && (
                        <Badge className="border-0 bg-purple-100 text-[10px] text-purple-700">
                          Memory Care
                        </Badge>
                      )}
                      {c.hasMedicaidContract && (
                        <Badge className="border-0 bg-blue-100 text-[10px] text-blue-700">
                          Medicaid
                        </Badge>
                      )}
                      {c.isAbuseFree && (
                        <Badge className="border-0 bg-green-100 text-[10px] text-green-700">
                          Abuse-free
                        </Badge>
                      )}
                      {c.isViolationFree && (
                        <Badge className="border-0 bg-green-100 text-[10px] text-green-700">
                          Violation-free
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/dashboard/communities/directory"
      />
    </>
  );
}
