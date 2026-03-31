"use server";

import { db } from "@/db";
import { communities, communityInquiries } from "@/db/schema";
import { communityInquirySchema } from "@/lib/schemas";
import { ilike, eq } from "drizzle-orm";
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
