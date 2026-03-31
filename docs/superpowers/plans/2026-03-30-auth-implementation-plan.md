# Auth System — Implementation Plan

**Spec:** `docs/superpowers/specs/2026-03-30-auth-system-design.md`
**Branch:** `feat/auth` (create from `feat/redesign`)

## Context

Add authentication (Better Auth + email/password + Google OAuth) to protect the CRM dashboard. Domain-restricted signup — only `@seniorsource.io` emails. This is the first subsystem: Auth > CRM > Intake > AI.

---

## Step 1: Install Better Auth & update config files

```bash
pnpm add better-auth
```

Update `.env.example`:

```
DATABASE_URL=""
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Add to `.env.local` (actual values):

```
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

---

## Step 2: Add Better Auth tables to database schema

**Modify:** `src/db/schema.ts`

Run `pnpm dlx @better-auth/cli generate` to see the exact Drizzle table definitions Better Auth needs, then manually add the 4 tables (`user`, `session`, `account`, `verification`) to the existing schema file alongside `communities` and `customers`.

Then apply to database:

```bash
pnpm db:generate && pnpm db:push
```

---

## Step 3: Create auth server config

**Create:** `src/lib/auth.ts`

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.email.endsWith("@seniorsource.io")) {
            return false;
          }
          return user;
        },
      },
    },
  },
});
```

---

## Step 4: Create auth client

**Create:** `src/lib/auth-client.ts`

```ts
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient();
```

---

## Step 5: Create API route handler

**Create:** `src/app/api/auth/[...all]/route.ts`

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

---

## Step 6: Restructure existing routes into (public) route group

This step moves existing pages into a `(public)/` route group and extracts shared layout.

1. Create directory: `src/app/(public)/`
2. Move `src/app/page.tsx` → `src/app/(public)/page.tsx`
3. Create directory: `src/app/(public)/community/`
4. Move `src/app/community/page.tsx` → `src/app/(public)/community/page.tsx`
5. Create directory: `src/app/(public)/customer/`
6. Move `src/app/customer/page.tsx` → `src/app/(public)/customer/page.tsx`
7. Delete the now-empty original directories (`src/app/community/`, `src/app/customer/`)
8. Delete original `src/app/page.tsx`

**Create:** `src/app/(public)/layout.tsx`

- Import `<Navbar />` and `<Footer />` from `src/components/`
- Render them wrapping `{children}`
- Remove `<Navbar />` and `<Footer />` imports/usage from each individual page component (`page.tsx`, `community/page.tsx`, `customer/page.tsx`)

---

## Step 7: Create auth pages

**Create:** `src/app/(auth)/layout.tsx`

- Cream background (#FAF8F5), full-height centered layout
- No navbar or footer — minimal chrome

**Create:** `src/app/(auth)/login/page.tsx`

- Centered card (white, rounded, bordered)
- SeniorOneSource logo/icon at top
- "Welcome back" heading (EB Garamond)
- Email input, password input
- "Sign in" button (#2E2E2E bg, white text)
- Divider "or"
- "Continue with Google" button (white, outlined, Google icon)
- Error message display (red text)
- "Don't have an account? Sign up" link → `/signup`
- Uses `signIn.email()` and `signIn.social({ provider: "google" })` from auth client

**Create:** `src/app/(auth)/signup/page.tsx`

- Same card layout as login, but:
  - "Create your account" heading
  - Name field added above email
  - "Sign up" button
  - "Already have an account? Sign in" link → `/login`
  - Domain rejection error: "Only @seniorsource.io email addresses can sign up."
  - Uses `signUp.email()` from auth client

---

## Step 8: Create dashboard placeholder

**Create:** `src/app/(dashboard)/dashboard/layout.tsx`

- Basic shell with a top bar showing user name/email and a sign-out button
- Placeholder sidebar (will be built out in CRM sub-project)
- Uses `useSession()` to get current user

**Create:** `src/app/(dashboard)/dashboard/page.tsx`

- Simple "Welcome to the dashboard" with user greeting
- This is a placeholder — CRM pipeline view will replace it in the next sub-project

Note: `(dashboard)` is a route group (no URL impact). The inner `dashboard/` folder creates the `/dashboard` URL.

---

## Step 9: Add middleware for route protection

**Create:** `middleware.ts` (project root — Next.js requirement)

```ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from dashboard
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

---

## Step 10: Update .env.local with actual values

You'll need to:

1. Run `openssl rand -base64 32` and set as `BETTER_AUTH_SECRET`
2. Set `BETTER_AUTH_URL=http://localhost:3000`
3. Create a Google OAuth app in Google Cloud Console → set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

---

## Verification Checklist

- [ ] `pnpm build` succeeds with no errors
- [ ] `/` loads the landing page (no auth required)
- [ ] `/community` and `/customer` load (no auth required)
- [ ] `/dashboard` redirects to `/login` when not authenticated
- [ ] Signup with non-`@seniorsource.io` email → rejected with error
- [ ] Signup with `@seniorsource.io` email → account created → redirected to `/dashboard`
- [ ] Sign out → redirected to `/login`
- [ ] Sign in with existing account → works → lands on `/dashboard`
- [ ] Google OAuth sign-in → works (with valid credentials)
- [ ] `/login` while authenticated → redirected to `/dashboard`

---

## Files Summary

| File                                       | Action                                 |
| ------------------------------------------ | -------------------------------------- |
| `src/lib/auth.ts`                          | Create                                 |
| `src/lib/auth-client.ts`                   | Create                                 |
| `src/app/api/auth/[...all]/route.ts`       | Create                                 |
| `middleware.ts`                            | Create                                 |
| `src/app/(auth)/layout.tsx`                | Create                                 |
| `src/app/(auth)/login/page.tsx`            | Create                                 |
| `src/app/(auth)/signup/page.tsx`           | Create                                 |
| `src/app/(public)/layout.tsx`              | Create                                 |
| `src/app/(public)/page.tsx`                | Move from `src/app/page.tsx`           |
| `src/app/(public)/community/page.tsx`      | Move from `src/app/community/page.tsx` |
| `src/app/(public)/customer/page.tsx`       | Move from `src/app/customer/page.tsx`  |
| `src/app/(dashboard)/dashboard/layout.tsx` | Create                                 |
| `src/app/(dashboard)/dashboard/page.tsx`   | Create                                 |
| `src/db/schema.ts`                         | Modify (add auth tables)               |
| `package.json`                             | Modify (`pnpm add better-auth`)        |
| `.env.example`                             | Modify (add auth env vars)             |
| `.env.local`                               | Modify (add actual values)             |
| `.gitignore`                               | Modify (add `.superpowers/`)           |

## Existing Files to Reuse

| File                        | What to reuse                                                |
| --------------------------- | ------------------------------------------------------------ |
| `src/db/index.ts`           | `db` export — passed to Better Auth Drizzle adapter          |
| `src/db/schema.ts`          | Add auth tables alongside existing `communities`/`customers` |
| `src/components/navbar.tsx` | Move into `(public)/layout.tsx`                              |
| `src/components/footer.tsx` | Move into `(public)/layout.tsx`                              |
| `src/lib/utils.ts`          | `cn()` utility — reuse in auth page styling                  |
| `src/app/layout.tsx`        | Root layout — unchanged (fonts, globals)                     |
