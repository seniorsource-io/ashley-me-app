# Codebase Cleanup & Convention Update

## Context

The codebase was scaffolded with Lovable (AI site builder) which dumped 40+ unused shadcn/ui components, many unused npm packages, and inconsistent conventions. Now that the landing page redesign is done, this pass cleans everything up, establishes proper conventions, and migrates from MongoDB to Neon Postgres + Drizzle before building the CRM/platform features.

---

## Task 1: Remove unused files

**Delete all `src/components/ui/` files** (40+ shadcn components — zero imported by app code):
- accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, use-toast.ts

**Delete unused hooks:**
- `src/hooks/use-toast.ts`
- `src/hooks/use-mobile.tsx`

**Delete test page:**
- `src/app/test/page.tsx`

**Keep:** `src/lib/utils.ts` (has `cn()` helper)

---

## Task 2: Remove unused npm packages

**Uninstall:**
```
@radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio
@radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible
@radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu
@radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar
@radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress
@radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
@radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot
@radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast
@radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
sonner next-themes react-router-dom recharts embla-carousel-react cmdk
input-otp react-day-picker react-hook-form react-resizable-panels vaul
class-variance-authority tailwindcss-animate
```

**Keep:** `clsx`, `tailwind-merge`, `framer-motion`, `lucide-react`, `@typeform/embed-react`

Move accordion keyframes from `tailwindcss-animate` plugin to CSS in `globals.css` (still used by potential future shadcn components). Actually — remove the accordion keyframes from `tailwind.config.ts` too since no accordion component exists anymore. Simplify `tailwind.config.ts` by removing the keyframes/animation sections entirely.

---

## Task 3: Rename files to kebab-case & simplify names

| Current file | New file | Old export | New export |
|---|---|---|---|
| `Navbar.tsx` | `navbar.tsx` | `Navbar` | `Navbar` |
| `HeroSection.tsx` | `hero.tsx` | `HeroSection` | `Hero` |
| `HowItWorksSection.tsx` | `how-it-works.tsx` | `HowItWorksSection` | `HowItWorks` |
| `TestimonialsSection.tsx` | `testimonials.tsx` | `TestimonialsSection` | `Testimonials` |
| `CTASection.tsx` | `cta.tsx` | `CTASection` | `CTA` |
| `Footer.tsx` | `footer.tsx` | `Footer` | `Footer` |
| `CommunityContact.tsx` | `community-contact.tsx` | `CommunityContact` | `CommunityContact` |
| `CommunityJoinUs.tsx` | `community-join-us.tsx` | `JoinUsSection` | `CommunityJoinUs` |
| `CustomerContact.tsx` | `customer-contact.tsx` | `CustomerContact` | `CustomerContact` |

**Update imports in:**
- `src/app/page.tsx` — update paths + component names
- `src/app/community/page.tsx` — update paths
- `src/app/customer/page.tsx` — update paths

---

## Task 4: Next.js best practices — font loading

Replace CSS `@import url(...)` in `globals.css` with `next/font/google` in `layout.tsx`.

**`src/app/layout.tsx`:**
```tsx
import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Senior One Source",
  description: "Free senior living guidance for Portland families.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**`src/app/globals.css`:**
- Remove the `@import url('https://fonts.googleapis.com/...')` line
- Update CSS variables to reference next/font variables:
  ```css
  --font-heading: var(--font-heading), Georgia, serif;
  --font-body: var(--font-body), system-ui, sans-serif;
  --font-sans: var(--font-body), ui-sans-serif, system-ui, sans-serif;
  ```
  Wait — this creates a circular reference. Instead, remove the `--font-heading` / `--font-body` / `--font-sans` declarations from `:root` entirely. The next/font `variable` option already creates `--font-heading` and `--font-body` CSS variables on `<html>`. Update `tailwind.config.ts` font families to use the CSS variables:
  ```ts
  fontFamily: {
    heading: ['var(--font-heading)', 'Georgia', 'serif'],
    body: ['var(--font-body)', 'system-ui', 'sans-serif'],
    sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  ```
  And update the body rule and `@theme inline` block to use `var(--font-body)`.

---

## Task 5: Database migration — MongoDB → Neon Postgres + Drizzle

**Install:**
```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

**Uninstall:**
```bash
npm uninstall mongodb @vercel/functions
```

**Create `drizzle.config.ts`** (project root):
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Create `src/db/schema.ts`:**
```ts
import { pgTable, uuid, text, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const communities = pgTable("communities", {
  id: uuid("id").defaultRandom().primaryKey(),
  classification: text("classification"),
  status: text("status", { enum: ["open", "closed"] }).default("open").notNull(),
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
  genderRestriction: text("gender_restriction", { enum: ["male", "female", "both"] }),
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

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  mobilePhone: text("mobile_phone"),
  status: text("status", {
    enum: ["new", "qualified", "searching", "placed", "moved", "invoiced", "closed"],
  }).default("new").notNull(),
  closedReason: text("closed_reason", {
    enum: ["paid", "deceased", "terminated", "duplicate", "financial_inability", "other"],
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

**Create `src/db/index.ts`:**
```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

**Update `src/app/actions.ts`:**
- Replace MongoDB imports with Drizzle imports
- `searchAddresses`: use `ilike` on address column (`where(ilike(communities.address, '%${query}%'))`)
- `updateCommunity`: use Drizzle `.update().set().where()`
- Remove `testMongoConnection`
- Update `_id` references to `id`

**Delete:** `src/lib/mongodb.ts`

**Update `src/lib/definitions.ts`:**
- Infer types from Drizzle schema: `export type Community = typeof communities.$inferSelect;`
- Remove manual type definitions (replaced by schema inference)

**Add npm scripts:**
```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

**Env variable:** `MONGODB_URI` → `DATABASE_URL` (Neon connection string)

---

## Task 6: Update CommunityContact inline feedback

Replace `alert()` calls in `community-contact.tsx` with inline success/error state (no toast library). Simple `useState<'idle' | 'success' | 'error'>` pattern with conditional UI text.

---

## Task 7: Final cleanup of tailwind.config.ts

- Remove `accordion-down`/`accordion-up` keyframes and animations (no accordion component)
- Remove `tailwindcss-animate` plugin reference
- Remove `medium` shadow (no `--shadow-medium` CSS variable)
- Update font families to use CSS variables (per Task 4)

---

## Verification

```bash
npm run build       # Clean build
npm run lint        # No lint errors
npm run dev         # /, /community, /customer all render correctly
npx drizzle-kit push  # Schema pushes to Neon without errors
```

## Execution order

Tasks 1-2 (delete files, remove packages) → Task 3 (rename) → Task 4 (fonts) → Task 7 (tailwind cleanup) → Task 5 (database) → Task 6 (alert replacement) → verify
