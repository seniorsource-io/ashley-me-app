import { notFound } from "next/navigation";
import { getCommunityInquiryById } from "@/lib/queries";
import PageHeader from "../../../components/page-header";
import { InquiryStatusBadge } from "../../../components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InquiryStatusForm from "./status-form";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getCommunityInquiryById(id);

  if (!inquiry) notFound();

  return (
    <>
      <PageHeader title={inquiry.name} description={inquiry.careHomeName} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Care Home
              </p>
              <p className="text-sm text-foreground">{inquiry.careHomeName}</p>
            </div>
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Address
              </p>
              <p className="text-sm text-foreground">{inquiry.address}</p>
            </div>
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Email
              </p>
              <p className="text-sm text-foreground">{inquiry.email}</p>
            </div>
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Phone
              </p>
              <p className="text-sm text-foreground">
                {inquiry.phone ?? "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Created
              </p>
              <p className="text-sm text-foreground">
                {inquiry.createdAt.toLocaleDateString()}
              </p>
            </div>
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
              <InquiryStatusBadge status={inquiry.status} />
            </div>
            <InquiryStatusForm
              inquiryId={inquiry.id}
              currentStatus={inquiry.status}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
