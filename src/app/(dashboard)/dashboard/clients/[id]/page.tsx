import { notFound } from "next/navigation";
import { getClientById } from "@/lib/queries";
import PageHeader from "../../components/page-header";
import { ClientStatusBadge } from "../../components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientStatusForm from "./status-form";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) notFound();

  return (
    <>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        description={client.email}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm text-foreground">{client.email}</p>
            </div>
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Phone
              </p>
              <p className="text-sm text-foreground">
                {client.mobilePhone ?? "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Created
              </p>
              <p className="text-sm text-foreground">
                {client.createdAt.toLocaleDateString()}
              </p>
            </div>
            {client.closedReason && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Closed Reason
                </p>
                <p className="text-sm text-foreground capitalize">
                  {client.closedReason.replace("_", " ")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider mb-1">
                Current Status
              </p>
              <ClientStatusBadge status={client.status} />
            </div>
            <ClientStatusForm
              clientId={client.id}
              currentStatus={client.status}
              currentClosedReason={client.closedReason}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
