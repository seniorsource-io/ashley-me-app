import Link from "next/link";
import { getCommunityInquiries } from "@/lib/queries";
import PageHeader from "../../components/page-header";
import StatusFilterTabs from "../../components/status-filter-tabs";
import { InquiryStatusBadge } from "../../components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

const INQUIRY_STATUSES = ["new", "contacted", "joined", "closed"];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const inquiries = await getCommunityInquiries(status);

  return (
    <>
      <PageHeader
        title="Community Inquiries"
        description="Care homes requesting to join the network"
      />
      <StatusFilterTabs
        statuses={INQUIRY_STATUSES}
        basePath="/communities/inquiries"
      />

      <div className="rounded-lg border border-[hsl(var(--border))] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Care Home</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-[hsl(var(--muted))]"
                >
                  No inquiries found.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <Link
                      href={`/communities/inquiries/${inquiry.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {inquiry.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {inquiry.careHomeName}
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {inquiry.email}
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {inquiry.phone ?? "—"}
                  </TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={inquiry.status} />
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {inquiry.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
