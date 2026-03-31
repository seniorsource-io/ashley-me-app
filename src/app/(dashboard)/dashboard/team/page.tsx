import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTeamMembers } from "@/lib/queries";
import PageHeader from "../components/page-header";
import { RoleBadge } from "../components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InviteDialog from "./invite-dialog";
import TeamActions from "./team-actions";

export default async function TeamPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/dashboard");
  }

  const members = await getTeamMembers();

  return (
    <>
      <PageHeader
        title="Team"
        description="Manage your team members"
        action={<InviteDialog />}
      />

      <div className="rounded-lg border border-[hsl(var(--border))] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium text-foreground">
                  {member.name}
                </TableCell>
                <TableCell className="text-sm text-[hsl(var(--muted))]">
                  {member.email}
                </TableCell>
                <TableCell>
                  <RoleBadge role={member.role ?? "user"} />
                </TableCell>
                <TableCell className="text-sm text-[hsl(var(--muted))]">
                  {member.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {member.id !== session.user.id && (
                    <TeamActions
                      memberId={member.id}
                      currentRole={member.role ?? "user"}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
