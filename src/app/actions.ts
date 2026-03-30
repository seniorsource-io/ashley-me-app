"use server";

import { db } from "@/db";
import { communities } from "@/db/schema";
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
