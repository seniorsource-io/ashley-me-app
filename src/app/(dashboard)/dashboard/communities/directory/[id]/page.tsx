import { notFound } from "next/navigation";
import Link from "next/link";
import { getCommunityById } from "@/lib/queries";
import PageHeader from "../../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const community = await getCommunityById(id);

  if (!community) notFound();

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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Address
              </p>
              <p className="text-sm text-foreground">{community.address}</p>
              <p className="text-sm text-foreground">
                {community.city}, {community.state} {community.zip}
              </p>
            </div>
            {community.licenseNumber && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  License
                </p>
                <p className="text-sm text-foreground">
                  {community.licenseNumber}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {community.phone && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Phone
                </p>
                <p className="text-sm text-foreground">{community.phone}</p>
              </div>
            )}
            {community.email && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Email
                </p>
                <p className="text-sm text-foreground">{community.email}</p>
              </div>
            )}
            {community.website && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Website
                </p>
                <p className="text-sm text-foreground">{community.website}</p>
              </div>
            )}
            {(community.firstname || community.lastname) && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Contact Person
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
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
            <div>
              <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                Medicaid
              </p>
              <p className="text-sm text-foreground">
                {community.hasMedicaidContract
                  ? "Accepts Medicaid"
                  : "No Medicaid contract"}
                {community.medicaidSpendDown &&
                  ` (Spend-down: ${community.medicaidSpendDown})`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Badge
                className={`border-0 font-medium text-[11px] ${community.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {community.status}
              </Badge>
              {community.isAbuseFree !== null && (
                <Badge
                  className={`border-0 font-medium text-[11px] ${community.isAbuseFree ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {community.isAbuseFree ? "Abuse-free" : "Abuse history"}
                </Badge>
              )}
              {community.isViolationFree !== null && (
                <Badge
                  className={`border-0 font-medium text-[11px] ${community.isViolationFree ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {community.isViolationFree
                    ? "Violation-free"
                    : "Has violations"}
                </Badge>
              )}
            </div>
            {community.classification && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Classification
                </p>
                <p className="text-sm text-foreground">
                  {community.classification}
                </p>
              </div>
            )}
            {community.genderRestriction && (
              <div>
                <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                  Gender Restriction
                </p>
                <p className="text-sm text-foreground capitalize">
                  {community.genderRestriction}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {community.careServices && community.careServices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Care Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1.5 flex-wrap">
                {community.careServices.map((service) => (
                  <Badge
                    key={service}
                    className="bg-blue-50 text-blue-700 border-0 text-[11px]"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(community.communityRating || community.communityNarrative) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rating & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {community.communityRating !== null && (
                <div>
                  <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
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
                  <p className="text-[11px] text-[hsl(var(--muted))] uppercase tracking-wider">
                    Notes
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {community.communityNarrative}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
