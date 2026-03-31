import { Badge } from "@/components/ui/badge";

const clientStatusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-700",
  qualified: "bg-blue-100 text-blue-700",
  searching: "bg-amber-100 text-amber-700",
  placed: "bg-green-100 text-green-700",
  moved: "bg-teal-100 text-teal-700",
  invoiced: "bg-purple-100 text-purple-700",
  closed: "bg-red-100 text-red-700",
};

const inquiryStatusColors: Record<string, string> = {
  new: "bg-gray-100 text-gray-700",
  contacted: "bg-blue-100 text-blue-700",
  joined: "bg-green-100 text-green-700",
  closed: "bg-red-100 text-red-700",
};

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-gray-100 text-gray-700",
};

export function ClientStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={`${clientStatusColors[status] ?? "bg-gray-100 text-gray-700"} border-0 font-medium text-[11px] capitalize`}
    >
      {status}
    </Badge>
  );
}

export function InquiryStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={`${inquiryStatusColors[status] ?? "bg-gray-100 text-gray-700"} border-0 font-medium text-[11px] capitalize`}
    >
      {status}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      className={`${roleColors[role] ?? "bg-gray-100 text-gray-700"} border-0 font-medium text-[11px] capitalize`}
    >
      {role}
    </Badge>
  );
}
