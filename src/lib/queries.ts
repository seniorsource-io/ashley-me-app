import { db } from "@/db";
import {
  customers,
  communityInquiries,
  communities,
  inspections,
  violations,
  regulatoryActions,
  user,
} from "@/db/schema";
import { desc, eq, count, sql, ilike, or } from "drizzle-orm";

// ── Dashboard overview ──

export async function getClientStatusCounts() {
  const rows = await db
    .select({ status: customers.status, count: count() })
    .from(customers)
    .groupBy(customers.status);

  return rows;
}

export async function getRecentClients(limit = 5) {
  return db
    .select()
    .from(customers)
    .orderBy(desc(customers.createdAt))
    .limit(limit);
}

export async function getRecentInquiries(limit = 5) {
  return db
    .select()
    .from(communityInquiries)
    .orderBy(desc(communityInquiries.createdAt))
    .limit(limit);
}

export async function getCommunityCount() {
  const [row] = await db.select({ count: count() }).from(communities);
  return row?.count ?? 0;
}

export async function getNewClientsThisWeek() {
  const [row] = await db
    .select({ count: count() })
    .from(customers)
    .where(sql`${customers.createdAt} >= now() - interval '7 days'`);
  return row?.count ?? 0;
}

// ── Clients ──

export async function getClients(status?: string) {
  const query = db.select().from(customers).orderBy(desc(customers.createdAt));

  if (status && status !== "all") {
    return query.where(eq(customers.status, status as typeof customers.status.enumValues[number]));
  }

  return query;
}

export async function getClientById(id: string) {
  const [client] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));
  return client ?? null;
}

// ── Community inquiries ──

export async function getCommunityInquiries(status?: string) {
  const query = db
    .select()
    .from(communityInquiries)
    .orderBy(desc(communityInquiries.createdAt));

  if (status && status !== "all") {
    return query.where(
      eq(communityInquiries.status, status as typeof communityInquiries.status.enumValues[number]),
    );
  }

  return query;
}

export async function getCommunityInquiryById(id: string) {
  const [inquiry] = await db
    .select()
    .from(communityInquiries)
    .where(eq(communityInquiries.id, id));
  return inquiry ?? null;
}

// ── Communities directory ──

const COMMUNITIES_PER_PAGE = 25;

export async function getCommunities(page = 1, search?: string) {
  const offset = (page - 1) * COMMUNITIES_PER_PAGE;

  const conditions = search
    ? or(
        ilike(communities.address, `%${search}%`),
        ilike(communities.city, `%${search}%`),
        ilike(communities.title, `%${search}%`),
      )
    : undefined;

  const [rows, [totalRow]] = await Promise.all([
    db
      .select()
      .from(communities)
      .where(conditions)
      .orderBy(desc(communities.createdAt))
      .limit(COMMUNITIES_PER_PAGE)
      .offset(offset),
    db.select({ count: count() }).from(communities).where(conditions),
  ]);

  return {
    communities: rows,
    total: totalRow?.count ?? 0,
    totalPages: Math.ceil((totalRow?.count ?? 0) / COMMUNITIES_PER_PAGE),
    page,
  };
}

export async function getCommunityById(id: string) {
  const [community] = await db
    .select()
    .from(communities)
    .where(eq(communities.id, id));
  return community ?? null;
}

// ── Inspections, violations, regulatory actions ──

export async function getInspectionsByProvider(licenseNumber: string) {
  return db
    .select()
    .from(inspections)
    .where(eq(inspections.providerIdNumber, licenseNumber))
    .orderBy(desc(inspections.createdAt));
}

export async function getViolationsByProvider(licenseNumber: string) {
  return db
    .select()
    .from(violations)
    .where(eq(violations.providerIdNumber, licenseNumber))
    .orderBy(desc(violations.createdAt));
}

export async function getRegulatoryActionsByProvider(licenseNumber: string) {
  return db
    .select()
    .from(regulatoryActions)
    .where(eq(regulatoryActions.providerIdNumber, licenseNumber))
    .orderBy(desc(regulatoryActions.createdAt));
}

// ── Team ──

export async function getTeamMembers() {
  return db.select().from(user).orderBy(desc(user.createdAt));
}
