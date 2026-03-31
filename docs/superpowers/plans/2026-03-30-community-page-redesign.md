# Community Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-step search-and-claim community page with a clean contact form in a split layout that matches the landing page aesthetic.

**Architecture:** New `community_inquiries` table for form submissions. Zod schema shared between client and server. Split layout page with value props on the left and a client-side form component (using shadcn Input/Label/Button) on the right. Server action validates with Zod and inserts.

**Tech Stack:** Next.js, Drizzle ORM, Neon Postgres, Zod, shadcn/ui, Tailwind CSS, Lucide icons

**Spec:** `docs/superpowers/specs/2026-03-30-community-page-redesign.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/db/schema.ts` | Modify | Add `communityInquiries` table |
| `src/lib/definitions.ts` | Modify | Add `CommunityInquiry` type |
| `src/lib/schemas.ts` | Create | Zod validation schema for community inquiry form |
| `src/app/actions.ts` | Modify | Add `submitCommunityInquiry` server action with Zod validation |
| `src/components/community-form.tsx` | Create | Client component — contact form using shadcn components |
| `src/app/(public)/community/page.tsx` | Rewrite | Split layout — left copy/value props, right form card |
| `src/components/community-contact.tsx` | Delete | Replaced by `community-form.tsx` |
| `src/components/community-join-us.tsx` | Delete | Value props move inline to page |

---

### Task 1: Add `communityInquiries` table and Zod schema

**Files:**
- Modify: `src/db/schema.ts` (after `communities` table, before `customers` table)
- Modify: `src/lib/definitions.ts`
- Create: `src/lib/schemas.ts`

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

Replace `src/lib/definitions.ts` with:

```ts
import { communities, customers, communityInquiries } from "@/db/schema";

export type Community = typeof communities.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;

export type MailingAddress = {
  address: string;
  city: string;
  state: string;
  zip: string;
};
```

- [ ] **Step 3: Create Zod validation schema**

Create `src/lib/schemas.ts`:

```ts
import { z } from "zod";

export const communityInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  careHomeName: z.string().min(1, "Care home name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional().default(""),
  email: z.string().email("Please enter a valid email address"),
});

export type CommunityInquiryFormData = z.infer<typeof communityInquirySchema>;
```

- [ ] **Step 4: Generate migration and push to database**

```bash
pnpm db:generate && pnpm db:push
```

Expected: New migration file in `drizzle/` and table created in Neon.

- [ ] **Step 5: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

---

### Task 2: Add `submitCommunityInquiry` server action

**Files:**
- Modify: `src/app/actions.ts`

- [ ] **Step 1: Add the server action**

Update the import line at the top of `src/app/actions.ts`:

```ts
import { communities, communityInquiries } from "@/db/schema";
```

Add this import near the top:

```ts
import { communityInquirySchema } from "@/lib/schemas";
```

Add the new action at the bottom of the file:

```ts
export async function submitCommunityInquiry(data: {
  name: string;
  careHomeName: string;
  address: string;
  phone?: string;
  email: string;
}) {
  const parsed = communityInquirySchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
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
    return { success: false as const, error: "Something went wrong. Please try again." };
  }
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

---

### Task 3: Create the contact form component

**Files:**
- Create: `src/components/community-form.tsx`

- [ ] **Step 1: Create the form component**

Create `src/components/community-form.tsx`. Uses React Hook Form with `zodResolver`, shadcn `Field`/`FieldLabel`/`FieldError` for accessible field wrappers, `Input` for inputs, and `Button` for submit.

```tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityInquirySchema, type CommunityInquiryFormData } from "@/lib/schemas";
import { submitCommunityInquiry } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export default function CommunityForm() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<CommunityInquiryFormData>({
    resolver: zodResolver(communityInquirySchema),
    defaultValues: {
      name: "",
      careHomeName: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(data: CommunityInquiryFormData) {
    setSubmitStatus("loading");
    setSubmitError("");

    const result = await submitCommunityInquiry(data);

    if (result.success) {
      setSubmitStatus("success");
    } else {
      setSubmitStatus("error");
      setSubmitError(result.error);
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="font-heading text-xl font-medium text-foreground mb-2">
          Thanks for reaching out!
        </h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-[11px]">Your name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Jane Smith"
              className="h-10 text-[13px]"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="careHomeName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-[11px]">Care home name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Sunrise Adult Care Home"
              className="h-10 text-[13px]"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="text-[11px]">Care home address</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="1234 SE Hawthorne Blvd, Portland, OR 97214"
              className="h-10 text-[13px]"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-[11px]">Phone</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                aria-invalid={fieldState.invalid}
                placeholder="(503) 555-1234"
                className="h-10 text-[13px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="text-[11px]">Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="jane@sunrise.com"
                className="h-10 text-[13px]"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {submitStatus === "error" && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}

      <Button
        type="submit"
        disabled={submitStatus === "loading"}
        size="lg"
        className="w-full mt-1"
      >
        {submitStatus === "loading" ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
pnpm build
```

Expected: Build succeeds.

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

---

### Task 5: Delete old components and clean up

**Files:**
- Delete: `src/components/community-contact.tsx`
- Delete: `src/components/community-join-us.tsx`

- [ ] **Step 1: Delete old components**

```bash
rm src/components/community-contact.tsx src/components/community-join-us.tsx
```

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -r "community-contact\|community-join-us" src/
```

Expected: No results.

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: Build succeeds with no errors.

---

## Verification Checklist

After all tasks are complete:

- [ ] `pnpm build` succeeds
- [ ] `/community` loads the new split layout with form on the right
- [ ] Form submits successfully and creates a row in `community_inquiries` table
- [ ] Zod validation catches invalid email client-side before hitting the server
- [ ] Server-side Zod validation returns error if required fields are empty
- [ ] Success state shows "Thanks for reaching out!" message
- [ ] `/` landing page still works
- [ ] `/customer` page still works
