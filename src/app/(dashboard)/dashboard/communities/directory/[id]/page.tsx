import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCommunityById,
  getInspectionsByProvider,
  getViolationsByProvider,
  getRegulatoryActionsByProvider,
} from "@/lib/queries";
import PageHeader from "../../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const community = await getCommunityById(id);

  if (!community) notFound();

  const [communityInspections, communityViolations, communityActions] =
    community.licenseNumber
      ? await Promise.all([
          getInspectionsByProvider(community.licenseNumber),
          getViolationsByProvider(community.licenseNumber),
          getRegulatoryActionsByProvider(community.licenseNumber),
        ])
      : [[], [], []];

  const abuseViolations = communityViolations.filter(
    (v) => v.violationType === "abuse"
  );
  const licensingViolations = communityViolations.filter(
    (v) => v.violationType === "licensing"
  );

  return (
    <>
      <PageHeader
        title={community.title ?? community.address}
        description={
          community.city + ", " + community.state + " " + community.zip
        }
        action={
          <Link
            href="/dashboard/communities/directory"
            className="text-sm text-[hsl(var(--muted))] hover:text-foreground"
          >
            Back to directory
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                Address
              </p>
              <p className="text-sm text-foreground">{community.address}</p>
              <p className="text-sm text-foreground">
                {community.city}, {community.state} {community.zip}
              </p>
            </div>
            {community.county && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  County
                </p>
                <p className="text-sm text-foreground">{community.county}</p>
              </div>
            )}
            {community.licenseNumber && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  License
                </p>
                <p className="text-sm text-foreground">
                  {community.licenseNumber}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {community.phone && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Phone
                </p>
                <p className="text-sm text-foreground">{community.phone}</p>
              </div>
            )}
            {community.email && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Email
                </p>
                <p className="text-sm text-foreground">{community.email}</p>
              </div>
            )}
            {community.website && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Website
                </p>
                <p className="text-sm text-foreground">{community.website}</p>
              </div>
            )}
            {(community.firstname || community.lastname) && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Administrator
                </p>
                <p className="text-sm text-foreground">
                  {[community.firstname, community.lastname]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Facility Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facility Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {community.type && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Type
                </p>
                <p className="text-sm text-foreground">{community.type}</p>
              </div>
            )}
            {community.classification && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Classification
                </p>
                <p className="text-sm text-foreground">
                  {community.classification}
                </p>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                Licensed Beds
              </p>
              <p className="text-sm text-foreground">
                {community.licensedBeds ?? "Not listed"}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {community.memoryCare !== null && (
                <Badge
                  className={`border-0 text-[11px] font-medium ${community.memoryCare ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {community.memoryCare
                    ? "Memory Care"
                    : "No Memory Care"}
                </Badge>
              )}
              <Badge
                className={`border-0 text-[11px] font-medium ${community.hasMedicaidContract ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
              >
                {community.hasMedicaidContract
                  ? "Accepts Medicaid"
                  : "No Medicaid"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                Monthly Price Range
              </p>
              <p className="text-sm text-foreground">
                {community.monthlyBasePrice && community.monthlyHighPrice
                  ? `$${community.monthlyBasePrice.toLocaleString()} – $${community.monthlyHighPrice.toLocaleString()}`
                  : community.monthlyBasePrice
                    ? `From $${community.monthlyBasePrice.toLocaleString()}`
                    : "Not listed"}
              </p>
            </div>
            {community.medicaidSpendDown && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Medicaid Spend-Down
                </p>
                <p className="text-sm text-foreground">
                  {community.medicaidSpendDown}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge
                className={`border-0 text-[11px] font-medium ${community.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {community.status}
              </Badge>
              {community.isAbuseFree !== null && (
                <Badge
                  className={`border-0 text-[11px] font-medium ${community.isAbuseFree ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {community.isAbuseFree ? "Abuse-free" : "Abuse history"}
                </Badge>
              )}
              {community.isViolationFree !== null && (
                <Badge
                  className={`border-0 text-[11px] font-medium ${community.isViolationFree ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {community.isViolationFree
                    ? "Violation-free"
                    : "Has violations"}
                </Badge>
              )}
            </div>
            {community.genderRestriction && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  Gender Restriction
                </p>
                <p className="text-sm capitalize text-foreground">
                  {community.genderRestriction}
                </p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">
                  {communityInspections.length}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted))]">
                  Inspections
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">
                  {communityViolations.length}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted))]">
                  Violations
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-foreground">
                  {communityActions.length}
                </p>
                <p className="text-[11px] text-[hsl(var(--muted))]">
                  Reg. Actions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Services */}
        {community.careServices && community.careServices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Care Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {community.careServices.map((service) => (
                  <Badge
                    key={service}
                    className="border-0 bg-blue-50 text-[11px] text-blue-700"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating & Notes */}
        {(community.communityRating || community.communityNarrative) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rating & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {community.communityRating !== null && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                    Rating
                  </p>
                  <p className="text-sm text-foreground">
                    {community.communityRating} / 5
                    {community.communityRatingReason && (
                      <span className="text-[hsl(var(--muted))]">
                        {" "}
                        — {community.communityRatingReason}
                      </span>
                    )}
                  </p>
                </div>
              )}
              {community.communityNarrative && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[hsl(var(--muted))]">
                    Notes
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {community.communityNarrative}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Inspections */}
      {communityInspections.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Inspections
          </h3>
          <DataTable rows={communityInspections.map((r) => r.data)} />
        </div>
      )}

      {/* Abuse Violations */}
      {abuseViolations.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Abuse Violations
          </h3>
          <DataTable rows={abuseViolations.map((r) => r.data)} />
        </div>
      )}

      {/* Licensing Violations */}
      {licensingViolations.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Licensing Violations
          </h3>
          <DataTable rows={licensingViolations.map((r) => r.data)} />
        </div>
      )}

      {/* Regulatory Actions */}
      {communityActions.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Regulatory Actions
          </h3>
          <DataTable rows={communityActions.map((r) => r.data)} />
        </div>
      )}
    </>
  );
}

function DataTable({
  rows,
}: {
  rows: (Record<string, string> | null)[];
}) {
  const validRows = rows.filter(Boolean) as Record<string, string>[];
  if (validRows.length === 0) return null;

  const columns = Object.keys(validRows[0]);

  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {validRows.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  className="text-sm text-[hsl(var(--muted))]"
                >
                  {row[col] || "—"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
