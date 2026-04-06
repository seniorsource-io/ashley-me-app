/**
 * Scrapes Oregon AFH communities from ArcGIS + the state licensing site
 * and stores them in the database.
 *
 * Phase 1: Fetch all providers from ArcGIS (public, no auth) → upsert communities
 * Phase 2: Per-provider scraping for inspections, violations, regulatory actions
 *
 * Usage: pnpm run scrape
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import {
  communities,
  inspections,
  violations,
  regulatoryActions,
} from "../src/db/schema";

const db = drizzle(neon(process.env.DATABASE_URL!));

const ARCGIS_URL =
  "https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/webFACILITY/FeatureServer/0/query";
const BASE_URL = "https://ltclicensing.oregon.gov";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── ArcGIS fetching ─────────────────────────────────────────────────────────

interface ArcGISResponse {
  features: { attributes: Record<string, unknown> }[];
  exceededTransferLimit?: boolean;
}

async function fetchAllProviders(): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let offset = 0;

  while (true) {
    console.log(`Fetching ArcGIS providers (offset: ${offset})...`);
    const url = `${ARCGIS_URL}?where=OperatingStatusDesc%3D'Active'%20AND%20FacilityTypeCd%3D'AFH'&outFields=*&f=json&resultRecordCount=2000&resultOffset=${offset}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`ArcGIS request failed: ${res.status}`);

    const data: ArcGISResponse = await res.json();
    for (const feature of data.features) {
      all.push(feature.attributes);
    }

    console.log(`  Got ${data.features.length} records`);
    if (!data.exceededTransferLimit) break;
    offset += 2000;
  }

  return all;
}

// ── ArcGIS → communities mapping ───────────────────────────────────────────

function mapProvider(attrs: Record<string, unknown>) {
  let firstname: string | null = null;
  let lastname: string | null = null;
  const adminName = (attrs.AdministratorName as string)?.trim();
  if (adminName) {
    const parts = adminName.split(" ");
    firstname = parts[0];
    lastname = parts.slice(1).join(" ") || null;
  }

  const careServices: string[] = [];
  if (attrs.AlzheimerDementia) careServices.push("Alzheimer/Dementia");
  if (attrs.Bariatric) careServices.push("Bariatric");
  if (attrs.Daycare) careServices.push("Daycare");
  if (attrs.Pets) careServices.push("Pets Allowed");
  if (attrs.Smoking) careServices.push("Smoking Allowed");
  if (attrs.TraumaticBrainInjury) careServices.push("Traumatic Brain Injury");
  if (attrs.Ventilator) careServices.push("Ventilator");

  const afhClass = attrs.AFHClass as string | null;

  return {
    licenseNumber: attrs.FacilityID as string,
    title: attrs.FacilityName as string,
    type: attrs.FacilityTypeDesc as string | null,
    classification: afhClass ? `Class ${afhClass}` : null,
    status: "open" as const,
    address: (attrs.Address as string) || "Unknown",
    city: (attrs.City as string) || "Unknown",
    state: (attrs.State as string) || "OR",
    zip: (attrs.Zip as string) || "00000",
    county: (attrs.County as string) || null,
    phone: (attrs.Phone as string) || null,
    email: (attrs.Email as string) || null,
    website: (attrs.Website as string) || null,
    firstname,
    lastname,
    licensedBeds: attrs.TotalBed ? Number(attrs.TotalBed) : null,
    hasMedicaidContract: attrs.MedicaidFlg === 1,
    memoryCare: attrs.MemoryCareFlg === 1,
    careServices: careServices.length > 0 ? careServices : null,
  };
}

// ── HTML table parsing (regex) ──────────────────────────────────────────────

function parseHTMLTable(html: string): Record<string, string>[] {
  // Check for zero records
  const countMatch = html.match(/(\d+)\s+records?\s+found/i);
  if (countMatch && parseInt(countMatch[1]) === 0) return [];

  // Extract headers from <thead>
  const headerMatch = html.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  if (!headerMatch) return [];

  const headers: string[] = [];
  const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
  let m;
  while ((m = thRegex.exec(headerMatch[1])) !== null) {
    headers.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  if (headers.length === 0) return [];

  // Extract rows from <tbody>
  const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
  if (!tbodyMatch) return [];

  const rows: Record<string, string>[] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  while ((m = trRegex.exec(tbodyMatch[1])) !== null) {
    const cells: string[] = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let td;
    while ((td = tdRegex.exec(m[1])) !== null) {
      cells.push(td[1].replace(/<[^>]+>/g, "").trim());
    }
    if (cells.length > 0) {
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
      rows.push(row);
    }
  }

  return rows;
}

// ── Per-provider scraping ───────────────────────────────────────────────────

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}

async function scrapeProviderData(providerId: string) {
  const results = {
    inspections: [] as Record<string, string>[],
    abuseViolations: [] as Record<string, string>[],
    licensingViolations: [] as Record<string, string>[],
    regulatoryActions: [] as Record<string, string>[],
  };

  // Inspections
  let html = await fetchHTML(
    `${BASE_URL}/Inspections/Index/${providerId}?PageNumber=1&PageSize=9999&Sorts=InspectionDate_desc`
  );
  if (html) results.inspections = parseHTMLTable(html);
  await sleep(200);

  // Abuse violations
  html = await fetchHTML(
    `${BASE_URL}/Violations/Index/${providerId}?PageNumber=1&PageSize=9999&Sorts=IncidentDate_desc&violationType=Abuse`
  );
  if (html) results.abuseViolations = parseHTMLTable(html);
  await sleep(200);

  // Licensing violations
  html = await fetchHTML(
    `${BASE_URL}/Violations/Index/${providerId}?PageNumber=1&PageSize=9999&Sorts=IncidentDate_desc&violationType=Licensing`
  );
  if (html) results.licensingViolations = parseHTMLTable(html);
  await sleep(200);

  // Regulatory actions
  html = await fetchHTML(
    `${BASE_URL}/RegulatoryActions/Index/${providerId}?PageNumber=1&PageSize=9999&Sorts=EffectiveDate_desc`
  );
  if (html) results.regulatoryActions = parseHTMLTable(html);
  await sleep(200);

  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // ── Phase 1: ArcGIS → communities ──
  console.log("=== Phase 1: Fetching providers from ArcGIS ===\n");
  const providers = await fetchAllProviders();
  console.log(`\nTotal providers fetched: ${providers.length}\n`);

  // Upsert communities
  const existing = await db
    .select({ licenseNumber: communities.licenseNumber })
    .from(communities);
  const existingSet = new Set(existing.map((r) => r.licenseNumber));

  let inserted = 0;
  let updated = 0;
  const providerIds: string[] = [];

  for (const attrs of providers) {
    const mapped = mapProvider(attrs);
    if (!mapped.licenseNumber) continue;
    providerIds.push(mapped.licenseNumber);

    if (existingSet.has(mapped.licenseNumber)) {
      await db
        .update(communities)
        .set({ ...mapped, updatedAt: new Date() })
        .where(eq(communities.licenseNumber, mapped.licenseNumber));
      updated++;
    } else {
      await db.insert(communities).values(mapped);
      inserted++;
    }
  }

  console.log(`Communities: ${inserted} inserted, ${updated} updated\n`);

  // ── Phase 2: Per-provider scraping ──
  console.log("=== Phase 2: Scraping inspections, violations, regulatory actions ===\n");

  // Clear existing scrape data for idempotency
  await db.delete(inspections);
  await db.delete(violations);
  await db.delete(regulatoryActions);

  let totalInspections = 0;
  let totalViolations = 0;
  let totalActions = 0;
  let samplePrinted = false;

  for (let i = 0; i < providerIds.length; i++) {
    const pid = providerIds[i];

    if (i % 50 === 0) {
      console.log(`Progress: ${i}/${providerIds.length} providers`);
    }

    try {
      const data = await scrapeProviderData(pid);

      // Insert inspections
      for (const row of data.inspections) {
        await db.insert(inspections).values({
          providerIdNumber: pid,
          data: row,
        });
        totalInspections++;
      }

      // Insert abuse violations
      for (const row of data.abuseViolations) {
        await db.insert(violations).values({
          providerIdNumber: pid,
          violationType: "abuse",
          data: row,
        });
        totalViolations++;
      }

      // Insert licensing violations
      for (const row of data.licensingViolations) {
        await db.insert(violations).values({
          providerIdNumber: pid,
          violationType: "licensing",
          data: row,
        });
        totalViolations++;
      }

      // Insert regulatory actions
      for (const row of data.regulatoryActions) {
        await db.insert(regulatoryActions).values({
          providerIdNumber: pid,
          data: row,
        });
        totalActions++;
      }

      // Print one sample record (first provider with any data)
      if (!samplePrinted) {
        const hasData =
          data.inspections.length > 0 ||
          data.abuseViolations.length > 0 ||
          data.licensingViolations.length > 0 ||
          data.regulatoryActions.length > 0;

        if (hasData) {
          const provider = providers.find(
            (p) => (p.FacilityID as string) === pid
          );
          console.log("\n=== Sample Record ===");
          console.log(
            JSON.stringify(
              {
                community: mapProvider(provider!),
                inspections: data.inspections,
                abuseViolations: data.abuseViolations,
                licensingViolations: data.licensingViolations,
                regulatoryActions: data.regulatoryActions,
              },
              null,
              2
            )
          );
          console.log("=== End Sample ===\n");
          samplePrinted = true;
        }
      }
    } catch (err) {
      console.error(`Error on provider ${pid}:`, err);
    }
  }

  // ── Summary ──
  console.log("\n=== Summary ===");
  console.log(`Communities:        ${inserted} inserted, ${updated} updated`);
  console.log(`Inspections:        ${totalInspections}`);
  console.log(`Violations:         ${totalViolations}`);
  console.log(`Regulatory actions: ${totalActions}`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
