"use server";

import { db } from "@/db";
import { communities, communityInquiries, customers } from "@/db/schema";
import {
  communityInquirySchema,
  customerIntakeSchema,
  updateClientStatusSchema,
  updateInquiryStatusSchema,
  createTeamMemberSchema,
} from "@/lib/schemas";
import { ilike, eq } from "drizzle-orm";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Community } from "@/lib/definitions";

export async function searchAddresses(query: string): Promise<Community[]> {
  if (query.length < 1) return [];

  const results = await db
    .select()
    .from(communities)
    .where(ilike(communities.address, `%${query}%`))
    .limit(5);

  return results;
}

export async function updateCommunity(
  id: string,
  data: { sms_opt_in: boolean; [key: string]: unknown },
) {
  try {
    await db
      .update(communities)
      .set({
        smsOptIn: data.sms_opt_in,
        updatedAt: new Date(),
        joinedAt: new Date(),
      })
      .where(eq(communities.id, id));

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Database update failed." };
  }
}

export async function submitCommunityInquiry(data: {
  name: string;
  careHomeName: string;
  address: string;
  phone?: string;
  email: string;
}) {
  const parsed = communityInquirySchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { success: false as const, error: firstError };
  }

  try {
    await db.insert(communityInquiries).values({
      name: parsed.data.name,
      careHomeName: parsed.data.careHomeName,
      address: parsed.data.address,
      phone: parsed.data.phone || null,
      email: parsed.data.email,
    });

    return { success: true as const };
  } catch (e) {
    console.error(e);
    return {
      success: false as const,
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function submitCustomerIntake(data: {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone?: string;
}) {
  const parsed = customerIntakeSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { success: false as const, error: firstError };
  }

  try {
    await db.insert(customers).values({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      mobilePhone: parsed.data.mobilePhone || null,
    });

    return { success: true as const };
  } catch (e) {
    console.error(e);
    return {
      success: false as const,
      error: "Something went wrong. Please try again.",
    };
  }
}

// ── Dashboard mutations ──

export async function updateClientStatus(
  id: string,
  status: string,
  closedReason?: string,
) {
  const parsed = updateClientStatusSchema.safeParse({ id, status, closedReason });
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db
      .update(customers)
      .set({
        status: parsed.data.status,
        closedReason: parsed.data.closedReason ?? null,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, parsed.data.id));
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to update client status." };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  const parsed = updateInquiryStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db
      .update(communityInquiries)
      .set({
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(eq(communityInquiries.id, parsed.data.id));
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to update inquiry status." };
  }
}

export async function createTeamMember(data: {
  name: string;
  email: string;
  role?: string;
}) {
  const parsed = createTeamMemberSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const result = await auth.api.createUser({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: crypto.randomUUID(),
        role: parsed.data.role,
      },
    });

    if (!result) {
      return { success: false as const, error: "Failed to create team member." };
    }

    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to create team member." };
  }
}

export async function updateTeamMemberRole(userId: string, role: string) {
  if (role !== "user" && role !== "admin") {
    return { success: false as const, error: "Invalid role." };
  }

  try {
    await db
      .update(user)
      .set({ role, updatedAt: new Date() })
      .where(eq(user.id, userId));
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to update role." };
  }
}

export async function removeTeamMember(userId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.id === userId) {
    return { success: false as const, error: "Cannot remove yourself." };
  }

  try {
    await auth.api.removeUser({ body: { userId } });
    return { success: true as const };
  } catch (e) {
    console.error(e);
    return { success: false as const, error: "Failed to remove team member." };
  }
}
