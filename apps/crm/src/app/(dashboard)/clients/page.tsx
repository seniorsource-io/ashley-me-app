import Link from "next/link";
import { getClients } from "@/lib/queries";
import PageHeader from "../components/page-header";
import StatusFilterTabs from "../components/status-filter-tabs";
import { ClientStatusBadge } from "../components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

const CLIENT_STATUSES = [
  "new",
  "qualified",
  "searching",
  "placed",
  "moved",
  "invoiced",
  "closed",
];

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const clients = await getClients(status);

  return (
    <>
      <PageHeader title="Clients" description="Manage client applications" />
      <StatusFilterTabs
        statuses={CLIENT_STATUSES}
        basePath="/clients"
      />

      <div className="rounded-lg border border-[hsl(var(--border))] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-[hsl(var(--muted))]"
                >
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={`/clients/${client.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {client.firstName} {client.lastName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {client.email}
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {client.mobilePhone ?? "—"}
                  </TableCell>
                  <TableCell>
                    <ClientStatusBadge status={client.status} />
                  </TableCell>
                  <TableCell className="text-sm text-[hsl(var(--muted))]">
                    {client.createdAt.toLocaleDateString()}
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
