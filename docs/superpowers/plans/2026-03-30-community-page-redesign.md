# Community Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-step search-and-claim community page with a clean contact form in a split layout that matches the landing page aesthetic.

**Architecture:** New `community_inquiries` table for form submissions. Split layout page with value props on the left and a client-side form component on the right. Server action handles the insert.

**Tech Stack:** Next.js, Drizzle ORM, Neon Postgres, Tailwind CSS, Framer Motion, Lucide icons

**Spec:** `docs/superpowers/specs/2026-03-30-community-page-redesign.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/db/schema.ts` | Modify | Add `communityInquiries` table |
| `src/lib/definitions.ts` | Modify | Add `CommunityInquiry` type |
| `src/app/actions.ts` | Modify | Add `submitCommunityInquiry` server action |
| `src/components/community-form.tsx` | Create | Client component — contact form with validation + submit |
| `src/app/(public)/community/page.tsx` | Rewrite | Split layout — left copy/value props, right form card |
| `src/components/community-contact.tsx` | Delete | Replaced by `community-form.tsx` |
| `src/components/community-join-us.tsx` | Delete | Value props move inline to page |

---

### Task 1: Add `communityInquiries` table to schema

**Files:**
- Modify: `src/db/schema.ts:93` (after `communities` table, before `customers` table)

- [ ] **Step 1: Add the table definition**

Add this between the `communities` and `customers` tables in `src/db/schema.ts`:

```ts
export const communityInquiries = pgTable("community_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  careHomeName: text("care_home_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email").notNull(),
  status: text("status", {
    enum: ["new", "contacted", "joined", "closed"],
  }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

- [ ] **Step 2: Add type export to definitions**

Add to `src/lib/definitions.ts`:

```ts
import { communities, customers, communityInquiries } from "@/db/schema";

export type Community = typeof communities.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;
```

- [ ] **Step 3: Generate migration and push to database**

```bash
pnpm db:generate && pnpm db:push
```

Expected: New migration file in `drizzle/` and table created in Neon.

- [ ] **Step 4: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/db/schema.ts src/lib/definitions.ts drizzle/
git commit -m "feat: add community_inquiries table"
```

---

### Task 2: Add `submitCommunityInquiry` server action

**Files:**
- Modify: `src/app/actions.ts`

- [ ] **Step 1: Add the server action**

Add this to `src/app/actions.ts`. Keep the existing `searchAddresses` and `updateCommunity` actions — they're still used elsewhere. Add the new import for `communityInquiries` at the top.

Update the import line:

```ts
import { communities, communityInquiries } from "@/db/schema";
```

Add the new action at the bottom of the file:

```ts
export async function submitCommunityInquiry(data: {
  name: string;
  careHomeName: string;
  address: string;
  phone: string;
  email: string;
}) {
  if (!data.name || !data.careHomeName || !data.address || !data.email) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    await db.insert(communityInquiries).values({
      name: data.name,
      careHomeName: data.careHomeName,
      address: data.address,
      phone: data.phone || null,
      email: data.email,
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/actions.ts
git commit -m "feat: add submitCommunityInquiry server action"
```

---

### Task 3: Create the contact form component

**Files:**
- Create: `src/components/community-form.tsx`

- [ ] **Step 1: Create the form component**

Create `src/components/community-form.tsx`. This is a `"use client"` component that handles form state, validation, and submission via the `submitCommunityInquiry` server action. It renders inside the white form card on the right column of the page.

```tsx
"use client";

import { useState } from "react";
import { submitCommunityInquiry } from "@/app/actions";

export default function CommunityForm() {
  const [form, setForm] = useState({
    name: "",
    careHomeName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const result = await submitCommunityInquiry(form);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="font-heading text-xl font-medium text-foreground mb-2">
          Thanks for reaching out!
        </h3>
        <p className="text-sm text-[hsl(var(--muted))]">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div>
        <label htmlFor="name" className="block text-[11px] font-medium text-foreground mb-1.5">
          Your name
        </label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Jane Smith"
          className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3 py-2.5 text-[13px] text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="careHomeName" className="block text-[11px] font-medium text-foreground mb-1.5">
          Care home name
        </label>
        <input
          id="careHomeName"
          type="text"
          required
          value={form.careHomeName}
          onChange={(e) => update("careHomeName", e.target.value)}
          placeholder="Sunrise Adult Care Home"
          className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3 py-2.5 text-[13px] text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-[11px] font-medium text-foreground mb-1.5">
          Care home address
        </label>
        <input
          id="address"
          type="text"
          required
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="1234 SE Hawthorne Blvd, Portland, OR 97214"
          className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3 py-2.5 text-[13px] text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="phone" className="block text-[11px] font-medium text-foreground mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(503) 555-1234"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3 py-2.5 text-[13px] text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[11px] font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@sunrise.com"
            className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3 py-2.5 text-[13px] text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-foreground text-[hsl(var(--background))] text-[13px] font-semibold py-3 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {status === "loading" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds (component is not imported yet, but should compile).

- [ ] **Step 3: Commit**

```bash
git add src/components/community-form.tsx
git commit -m "feat: add community contact form component"
```

---

### Task 4: Rewrite the community page with split layout

**Files:**
- Rewrite: `src/app/(public)/community/page.tsx`

- [ ] **Step 1: Rewrite the page**

Replace the entire contents of `src/app/(public)/community/page.tsx`:

```tsx
import { Metadata } from "next";
import { Mail, Users, TrendingUp } from "lucide-react";
import CommunityForm from "@/components/community-form";

export const metadata: Metadata = {
  title: "Join Our Network — Senior One Source",
  description: "Partner with Senior One Source to receive qualified referrals and grow your care home community.",
};

const valueProps = [
  {
    icon: Mail,
    title: "Qualified Referrals",
    description: "Matched families sent directly to you",
    iconBg: "bg-[hsl(var(--icon-orange))]",
  },
  {
    icon: Users,
    title: "Provider Network",
    description: "Join a circle of senior care professionals",
    iconBg: "bg-[hsl(var(--icon-green))]",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Community",
    description: "Tools and support to fill your vacancies",
    iconBg: "bg-[hsl(var(--icon-blue))]",
  },
];

export default function CommunityPage() {
  return (
    <section className="bg-[hsl(var(--background))]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left column — copy + value props */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-[0.15em] text-[hsl(var(--faint))] mb-3 font-body">
              For Care Home Providers
            </p>
            <h1 className="font-heading text-4xl sm:text-[40px] font-medium leading-[1.1] tracking-tight text-foreground mb-4">
              Join our referral network
            </h1>
            <p className="text-[15px] text-[hsl(var(--muted))] leading-[1.7] mb-8 max-w-lg">
              Partner with Senior One Source to receive qualified referrals,
              connect with families, and grow your community.
            </p>

            <div className="flex flex-col gap-3">
              {valueProps.map((prop) => (
                <div
                  key={prop.title}
                  className="flex items-center gap-4 bg-white rounded-xl px-6 py-5 border border-[hsl(var(--card-border))] shadow-card"
                >
                  <div
                    className={`w-10 h-10 rounded-[10px] ${prop.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <prop.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-0.5">
                      {prop.title}
                    </p>
                    <p className="text-[11px] text-[hsl(var(--subtle))]">
                      {prop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — contact form */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl border border-[hsl(var(--card-border))] shadow-card p-7">
              <h2 className="font-heading text-xl font-medium text-foreground mb-1">
                Get in touch
              </h2>
              <p className="text-[12px] text-[hsl(var(--muted))] mb-5">
                Tell us about your community and we&apos;ll reach out to connect.
              </p>
              <CommunityForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds. `/community` route compiles.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(public\)/community/page.tsx
git commit -m "feat: redesign community page with split layout"
```

---

### Task 5: Delete old components and clean up

**Files:**
- Delete: `src/components/community-contact.tsx`
- Delete: `src/components/community-join-us.tsx`

- [ ] **Step 1: Delete old components**

```bash
rm src/components/community-contact.tsx src/components/community-join-us.tsx
```

These are no longer imported anywhere — the community page was fully rewritten in Task 4.

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -r "community-contact\|community-join-us" src/
```

Expected: No results. If any results appear, update those files to remove the dead imports.

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -u src/components/community-contact.tsx src/components/community-join-us.tsx
git commit -m "chore: remove old community components"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] `pnpm build` succeeds
- [ ] `/community` loads the new split layout with form on the right
- [ ] Form submits successfully and creates a row in `community_inquiries` table
- [ ] Required field validation works (empty name/careHomeName/address/email rejected by browser)
- [ ] Server-side validation returns error if required fields are empty
- [ ] Success state shows "Thanks for reaching out!" message
- [ ] `/` landing page still works
- [ ] `/customer` page still works
