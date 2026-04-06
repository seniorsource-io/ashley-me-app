"use server";

import { db } from "@repo/db/connection";
import { customers, communityInquiries, user } from "@repo/db/schema";
import {
  updateClientStatusSchema,
  updateInquiryStatusSchema,
  createTeamMemberSchema,
} from "@/lib/schemas";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
