# Community Page Redesign

## Context

The `/community` page is where care home providers learn about and contact Senior One Source to join the referral network. The current page uses a 3-step search-and-claim flow against the existing `communities` table. The redesign replaces this with a simple contact form that matches the landing page's aesthetic, fits in a single viewport on desktop, and stores submissions in a new `community_inquiries` table for CRM review.

## Requirements

- Single viewport on desktop — no scrolling to reach the form
- Match the landing page design language (warm cream, EB Garamond headings, white cards, subtle borders)
- Simple contact form — no database lookup or search
- Submissions saved to a new `community_inquiries` table
- Mobile is out of scope for this redesign (current responsive behavior is acceptable)

## Page Layout

Split two-column layout mirroring the landing page hero:

### Left Column — Copy + Value Props

- **Label:** "For Care Home Providers" (11px uppercase, `--faint` color, wide letter-spacing)
- **Heading:** "Join our referral network" (EB Garamond, ~34px, `--foreground`)
- **Subtext:** "Partner with Senior One Source to receive qualified referrals, connect with families, and grow your community." (14px, `--muted`)
- **3 value prop cards** using the same card style as the landing page hero features:
  - Qualified Referrals — "Matched families sent directly to you" (icon-orange bg)
  - Provider Network — "Join a circle of senior care professionals" (icon-green bg)
  - Grow Your Community — "Tools and support to fill your vacancies" (icon-blue bg)

### Right Column — Contact Form

White card with rounded corners, subtle border and shadow (same card treatment as landing page).

- **Heading:** "Get in touch" (EB Garamond, ~20px)
- **Subtext:** "Tell us about your community and we'll reach out to connect." (12px, `--muted`)
- **Fields:**
  - Your name (full width)
  - Care home name (full width)
  - Care home address (full width, single free-text field)
  - Phone + Email (side-by-side, 50/50 split)
- **Button:** "Submit" (#2E2E2E bg, cream text, full width, rounded-lg)
- **Success state:** Form card content transitions to a confirmation message (e.g., "Thanks! We'll be in touch soon.")
- **Error state:** Red text below the form if submission fails

### Form Field Styling

- Labels: 11px, font-weight 500, `--foreground`
- Inputs: 13px, `--border` border, 8px border-radius, 10px 12px padding
- Placeholder text: `--dot` color
- Focus: 2px ring in `--ring` color

## Data Model

### New Table: `community_inquiries`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default random |
| name | text | NOT NULL — person's name |
| careHomeName | text | NOT NULL — name of their care home |
| address | text | NOT NULL — full address as free text |
| phone | text | nullable |
| email | text | NOT NULL |
| status | text | enum: "new", "contacted", "joined", "closed" — default "new" |
| createdAt | timestamp | default now, NOT NULL |
| updatedAt | timestamp | default now, NOT NULL |

The `status` field allows tracking the inquiry through a simple lifecycle in the CRM dashboard later.

### Server Action

New server action `submitCommunityInquiry` in `src/app/actions.ts`:
- Accepts: `{ name, careHomeName, address, phone, email }`
- Inserts into `community_inquiries`
- Returns `{ success: true }` or `{ success: false, error: string }`
- Basic validation: name, careHomeName, address, and email are required

## Components

### Files to Create

| File | Purpose |
|------|---------|
| `src/app/(public)/community/page.tsx` | Rewrite — split layout, server component |
| `src/components/community-form.tsx` | Client component — the contact form |

### Files to Modify

| File | Change |
|------|--------|
| `src/db/schema.ts` | Add `communityInquiries` table |
| `src/app/actions.ts` | Add `submitCommunityInquiry` action, keep existing actions |

### Files to Delete

| File | Reason |
|------|--------|
| `src/components/community-contact.tsx` | Replaced by `community-form.tsx` |
| `src/components/community-join-us.tsx` | Value props move inline to page |

## Out of Scope

- Mobile-specific layout changes
- CRM integration for reviewing inquiries (future CRM sub-project)
- Email notifications on new submissions
- The `/customer` page (separate redesign)
