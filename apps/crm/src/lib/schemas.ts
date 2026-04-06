import { z } from "zod";

export const updateClientStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "new",
    "qualified",
    "searching",
    "placed",
    "moved",
    "invoiced",
    "closed",
  ]),
  closedReason: z
    .enum([
      "paid",
      "deceased",
      "terminated",
      "duplicate",
      "financial_inability",
      "other",
    ])
    .optional(),
});

export const updateInquiryStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "joined", "closed"]),
});

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .email("Enter a valid email address")
    .refine((e) => e.endsWith("@seniorsource.io"), "Must be a @seniorsource.io email"),
  role: z.enum(["user", "admin"]).default("user"),
});
