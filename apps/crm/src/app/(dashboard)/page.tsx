import Link from "next/link";
import { Users, Inbox, Building2, TrendingUp } from "lucide-react";
import {
  getClientStatusCounts,
  getRecentClients,
  getRecentInquiries,
  getCommunityCount,
  getNewClientsThisWeek,
} from "@/lib/queries";
import PageHeader from "./components/page-header";
import MetricCard from "./components/metric-card";
import {
  ClientStatusBadge,
  InquiryStatusBadge,
} from "./components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

export default async function DashboardPage() {
  const [
    statusCounts,
    recentClients,
    recentInquiries,
    communityCount,
    newThisWeek,
  ] = await Promise.all([
    getClientStatusCounts(),
    getRecentClients(5),
    getRecentInquiries(5),
    getCommunityCount(),
    getNewClientsThisWeek(),
  ]);

  const totalClients = statusCounts.reduce((sum, r) => sum + r.count, 0);
  const activeInquiries = statusCounts
    .filter((r) => r.status !== "closed")
    .reduce((sum, r) => sum + r.count, 0);

  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard title="Total Clients" value={totalClients} icon={Users} />
        <MetricCard
          title="New This Week"
          value={newThisWeek}
          icon={TrendingUp}
        />
        <MetricCard
          title="Active Clients"
          value={activeInquiries}
          icon={Inbox}
        />
        <MetricCard
          title="Communities"
          value={communityCount}
          icon={Building2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Clients</CardTitle>
            <Link
              href="/clients"
              className="text-xs text-[hsl(var(--muted))] hover:text-foreground"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-6 text-[hsl(var(--muted))]"
                    >
                      No clients yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium text-foreground hover:underline text-sm"
                        >
                          {client.firstName} {client.lastName}
                        </Link>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Inquiries</CardTitle>
            <Link
              href="/communities/inquiries"
              className="text-xs text-[hsl(var(--muted))] hover:text-foreground"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Care Home</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-6 text-[hsl(var(--muted))]"
                    >
                      No inquiries yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <Link
                          href={`/communities/inquiries/${inquiry.id}`}
                          className="font-medium text-foreground hover:underline text-sm"
                        >
                          {inquiry.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--muted))]">
                        {inquiry.careHomeName}
                      </TableCell>
                      <TableCell>
                        <InquiryStatusBadge status={inquiry.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
