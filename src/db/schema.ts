import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ── Better Auth tables ──────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// ── Application tables ──────────────────────────────────────────────────────

export const communities = pgTable("communities", {
  id: uuid("id").defaultRandom().primaryKey(),
  classification: text("classification"),
  status: text("status", { enum: ["open", "closed"] })
    .default("open")
    .notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  phone: text("phone"),
  email: text("email"),
  isAbuseFree: boolean("is_abuse_free"),
  isViolationFree: boolean("is_violation_free"),
  licenseNumber: text("license_number"),
  firstname: text("firstname"),
  lastname: text("lastname"),
  genderRestriction: text("gender_restriction", {
    enum: ["male", "female", "both"],
  }),
  hasMedicaidContract: boolean("has_medicaid_contract"),
  medicaidSpendDown: text("medicaid_spend_down"),
  monthlyBasePrice: integer("monthly_base_price"),
  monthlyHighPrice: integer("monthly_high_price"),
  careServices: jsonb("care_services").$type<string[]>(),
  communityRating: integer("community_rating"),
  communityRatingReason: text("community_rating_reason"),
  communityNarrative: text("community_narrative"),
  title: text("title"),
  website: text("website"),
  description: text("description"),
  images: jsonb("images").$type<string[]>(),
  videos: jsonb("videos").$type<string[]>(),
  documents: jsonb("documents").$type<string[]>(),
  links: jsonb("links").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  smsOptIn: boolean("sms_opt_in"),
  joinedAt: timestamp("joined_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communityInquiries = pgTable("community_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  careHomeName: text("care_home_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email").notNull(),
  status: text("status", {
    enum: ["new", "contacted", "joined", "closed"],
  })
    .default("new")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  mobilePhone: text("mobile_phone"),
  status: text("status", {
    enum: [
      "new",
      "qualified",
      "searching",
      "placed",
      "moved",
      "invoiced",
      "closed",
    ],
  })
    .default("new")
    .notNull(),
  closedReason: text("closed_reason", {
    enum: [
      "paid",
      "deceased",
      "terminated",
      "duplicate",
      "financial_inability",
      "other",
    ],
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
