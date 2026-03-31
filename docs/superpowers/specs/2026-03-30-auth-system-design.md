# Auth System Design

## Context

The senior placement platform needs authentication to protect the internal CRM dashboard while keeping public-facing pages (landing, community signup, customer intake) accessible. This is the first subsystem in the platform build-out: Auth > CRM > Intake > AI features.

## Requirements

- **Users:** Ashley + a small team (2-5 people)
- **Providers:** Email/password + Google OAuth
- **Access control:** Domain-restricted signup — only `@seniorsource.io` emails can register
- **Roles:** None — all authenticated users have equal access
- **Framework:** Better Auth with Drizzle ORM adapter on Neon Postgres
- **Sessions:** Database sessions (Better Auth default)

## Architecture

### Route Structure

Single Next.js app using route groups to separate public and protected pages:

```
src/app/
├── (public)/              # No auth required
│   ├── page.tsx           # Landing page (moved from current root)
│   ├── layout.tsx         # Public layout (navbar + footer)
│   ├── community/
│   │   └── page.tsx
│   └── customer/
│       └── page.tsx
├── (auth)/                # Login/signup (public, redirects if logged in)
│   ├── layout.tsx         # Minimal centered layout
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/           # Auth required — all routes nested under dashboard/
│   └── dashboard/
│       ├── layout.tsx     # Dashboard shell (sidebar, topbar, user menu)
│       └── page.tsx       # Placeholder until CRM sub-project
├── api/auth/[...all]/
│   └── route.ts           # Better Auth API handler
└── layout.tsx             # Root layout (fonts, globals — unchanged)

middleware.ts              # At project root (Next.js requirement)
                           # Protects /dashboard/*, redirects to /login
```

Note: `(dashboard)/dashboard/page.tsx` maps to URL `/dashboard`. The outer `(dashboard)` is a route group (organizational only, no URL impact), and the inner `dashboard/` folder creates the actual URL segment.

### Auth Configuration

**Server (`src/lib/auth.ts`):**

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
          const ALLOWED_DOMAIN = "seniorsource.io";
          if (!user.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            return false; // Rejects registration
          }
          return user;
        },
      },
    },
  },
});
```

The existing `db` export from `src/db/index.ts` (Drizzle + neon-http driver) is passed directly to the Better Auth Drizzle adapter. The neon-http driver works with Better Auth since all DB operations are standard Drizzle queries.

**Domain restriction for Google OAuth:** Google OAuth creates a user record on first sign-in, so the `databaseHooks.user.create.before` hook also blocks Google sign-ups from non-matching domains. For Google accounts that somehow exist in the DB with wrong domains, the middleware session check is the second line of defense.

**Error handling:** When the hook returns `false`, Better Auth returns an error response. The client-side login/signup form catches this and displays: "Only @seniorsource.io email addresses can sign up."

**Client (`src/lib/auth-client.ts`):**

```ts
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession } = createAuthClient();
```

**Middleware (`middleware.ts` at project root):**

- Matches `/dashboard/:path*` routes
- Uses `auth.api.getSession({ headers })` to check for valid session
- Redirects to `/login` if no session
- Redirects to `/dashboard` from `/login`/`/signup` if already authenticated

### Database

Better Auth manages its own tables via the Drizzle adapter:

- `user` — id, name, email, emailVerified, image, createdAt, updatedAt
- `session` — id, userId, token, expiresAt, ipAddress, userAgent, createdAt, updatedAt
- `account` — id, userId, accountId, providerId, accessToken, refreshToken, etc.
- `verification` — id, identifier, value, expiresAt, createdAt, updatedAt

**Schema approach:** Manually write the Better Auth table definitions in `src/db/schema.ts` alongside the existing `communities` and `customers` tables. Use `pnpm dlx @better-auth/cli generate` as reference for the exact column definitions, but integrate by hand to keep a single schema file. No changes to existing tables.

After adding the tables, run `pnpm db:generate && pnpm db:migrate` to apply.

### Login UI

Centered card on cream background (#FAF8F5):

- SeniorOneSource logo/icon at top
- "Welcome back" heading (EB Garamond)
- Email input field
- Password input field
- "Sign in" button (#2E2E2E background, white text)
- Divider with "or"
- "Continue with Google" button (white, outlined)
- Error message area (red text below form fields)
- "Don't have an account? Sign up" link at bottom

Signup page is identical but with:

- "Create your account" heading
- Name field added
- "Sign up" button
- "Already have an account? Sign in" link
- Domain restriction error: "Only @seniorsource.io email addresses can sign up."

### Environment Variables

New variables needed in `.env.local`:

- `BETTER_AUTH_SECRET` — generated via `openssl rand -base64 32`
- `BETTER_AUTH_URL` — `http://localhost:3000` (dev), production URL later
- `GOOGLE_CLIENT_ID` — from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` — from Google Cloud Console

Update `.env.example`:

```
DATABASE_URL=""
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Files to Create/Modify

| File                                       | Action | Purpose                                                        |
| ------------------------------------------ | ------ | -------------------------------------------------------------- |
| `src/lib/auth.ts`                          | Create | Better Auth server config with Drizzle adapter                 |
| `src/lib/auth-client.ts`                   | Create | Better Auth React client                                       |
| `src/app/api/auth/[...all]/route.ts`       | Create | Auth API handler                                               |
| `middleware.ts` (project root)             | Create | Route protection for `/dashboard/*`                            |
| `src/app/(auth)/layout.tsx`                | Create | Minimal centered layout for auth pages                         |
| `src/app/(auth)/login/page.tsx`            | Create | Login page                                                     |
| `src/app/(auth)/signup/page.tsx`           | Create | Signup page                                                    |
| `src/app/(public)/layout.tsx`              | Create | Public layout (navbar + footer — remove from individual pages) |
| `src/app/(public)/page.tsx`                | Move   | Landing page from `src/app/page.tsx` (delete original)         |
| `src/app/(public)/community/page.tsx`      | Move   | From `src/app/community/page.tsx` (delete original)            |
| `src/app/(public)/customer/page.tsx`       | Move   | From `src/app/customer/page.tsx` (delete original)             |
| `src/app/(dashboard)/dashboard/layout.tsx` | Create | Dashboard shell (placeholder)                                  |
| `src/app/(dashboard)/dashboard/page.tsx`   | Create | Dashboard home (placeholder)                                   |
| `src/db/schema.ts`                         | Modify | Add Better Auth tables (user, session, account, verification)  |
| `package.json`                             | Modify | Add `better-auth` dependency via `pnpm add better-auth`        |
| `.env.example`                             | Modify | Add new env var placeholders                                   |
| `.gitignore`                               | Modify | Add `.superpowers/`                                            |

## Out of Scope

- CRM dashboard UI and features (next sub-project)
- Email verification flow
- Password reset flow
- User profile/settings page
- Admin panel
