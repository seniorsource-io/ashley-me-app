# Landing Page Redesign — Design Spec

## Overview

Redesign the Senior One Source landing page from a personal brand (Ashley Krause) to a company brand. Simplify the page structure, update the visual identity, and improve accessibility for an older audience.

**Brand shift:** From "Ashley Krause, Senior Living Advisor" to "Senior One Source" — a company that guides families through senior living placement.

**Primary CTA:** "Get Started" → links to existing Typeform intake form (`/customer`).

## Page Structure

6 sections, top to bottom:

1. **Navbar** — brand name, nav links (How It Works, Testimonials, Contact), "Get Started" button
2. **Hero** — two-column layout with headline + feature cards, trust strip below
3. **How It Works** — 4-step horizontal flow
4. **Testimonials** — 2-column card grid
5. **CTA** — dark inverted card with contact info
6. **Footer** — minimal one-line

### Sections removed from current site
- About Ashley (personal story) — brand is now company, not individual
- Services list (Independent Living, Memory Care, etc.) — too menu-like, specifics belong on the call
- CTAMiniSection — redundant

## Design System

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Headings | EB Garamond | 500 | 32-46px |
| Body | Inter | 400-500 | 15px |
| Labels/eyebrows | Inter | 600 | 11px, uppercase, 2.5px tracking |
| Feature card titles | Inter | 600 | 13px |
| Step numbers | EB Garamond | 500 | 36px |
| Trust strip numbers | EB Garamond | 600 | 24px |
| Nav links | Inter | 400 | 13px |

Line heights: headings 1.08, body 1.7.

**Font setup:** Add EB Garamond via Google Fonts import (weights 400-700, italic 400-500). Update `--font-heading` CSS variable and Tailwind `fontFamily.heading` to use EB Garamond. Remove Onest, Playfair Display, and Lora imports — they are no longer used. Keep Inter as the sans-serif body font. Max content width: retain existing 1400px container.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#FAF8F5` | Page background (warm cream) |
| `foreground` | `#2E2E2E` | Primary text (soft black) |
| `muted` | `#5C5C5C` | Body text, descriptions |
| `subtle` | `#6B6560` | Feature descriptions, trust labels |
| `faint` | `#736E69` | Section labels, footer text |
| `border` | `#EFECE7` | Dividers, nav border |
| `card-border` | `#F0EDE8` | Card borders |
| `card-bg` | `#FFFFFF` | Card backgrounds |
| `dark` | `#2E2E2E` | CTA card background, primary button |
| `dark-text` | `#FAF8F5` | Text on dark backgrounds |
| `dark-muted` | `#A0A0A0` | Muted text on dark backgrounds |
| `icon-orange` | `#FFF0EB` | Feature icon background (matching) |
| `icon-green` | `#EBF5F0` | Feature icon background (tours) |
| `icon-blue` | `#EBF0F5` | Feature icon background (move-in) |
| `star` | `#E8C85A` | Testimonial star color |
| `step-number` | `#E0DCD7` | Large step numbers (faded) |
| `dot` | `#D4D0CB` | Trust strip dot separators |

### Components

**Primary button:** `#2E2E2E` background, `#FAF8F5` text, 14px font-weight-600, 14px vertical / 32px horizontal padding, 10px border-radius.

**Ghost link:** `#5C5C5C` text, 14px, no border.

**Light button (on dark):** `#FAF8F5` background, `#2E2E2E` text, same sizing as primary.

**Feature card:** White background, 12px border-radius, 1px `#F0EDE8` border, subtle shadow (`0 2px 12px rgba(0,0,0,0.04)`), padding: 20px vertical / 24px horizontal.

**Testimonial card:** White background, 12px border-radius, 1px `#F0EDE8` border, 28px padding all sides. Italic quote text.

**CTA card:** `#2E2E2E` background, 16px border-radius, padding: 56px vertical / 48px horizontal, centered text.

### Spacing

- Section padding: 56px vertical, 48px horizontal
- Section dividers: 1px `#EFECE7` line with 48px horizontal margin
- Card gaps: 12px (feature cards), 20px (testimonials)
- Step grid: 4 columns, 24px gap

## Section Details

### 1. Navbar
- Left: "Senior One Source" in EB Garamond 18px weight-500
- Right: text links (How It Works, Testimonials, Contact) + "Get Started" dark button
- Bottom border: 1px `#EFECE7`
- Sticky on scroll

### 2. Hero
- **Left column (slightly wider):**
  - H1: "The right senior living, found for you." — EB Garamond 46px
  - Description: "Free, expert guidance for families navigating senior care in Portland. We do the research, scheduling, and comparison — you make the final call."
  - Actions: "Get Started →" primary button + "Learn how it works" ghost link
- **Right column:**
  - 3 stacked feature cards: Personalized Matching, Guided Tours, Move-In Support
  - Each card has a colored icon square (40x40, 10px radius) + title + description
- **Trust strip below hero:**
  - Horizontal row: "600+" families helped, "100%" free service, "4.9★" client rating
  - Separated by dot dividers
  - Top border divider

### 3. How It Works
- Section label: "How It Works" (uppercase, faint)
- Section title: "Four steps to the right fit." (EB Garamond 32px)
- 4-column grid:
  - Step 01: Tell Us Your Needs
  - Step 02: We Call You
  - Step 03: Tour & Compare
  - Step 04: Move In
- Each step: large serif number (faded), bold title, short description
- Arrow connectors between steps (except last)

### 4. Testimonials
- Section label: "What Families Say"
- Section title: "Trusted by hundreds of Portland families."
- 2-column grid, 2 testimonial cards (one per column)
- Each card: 5 gold stars, italic quote, author name, relationship

### 5. CTA
- Dark inverted card centered in section
- Label: "Ready to Start?"
- Title: "Let us help you find the right place."
- Description: "It's free, it's personal, and it starts with a simple form. We'll take it from there."
- "Get Started →" light button
- Contact info below: (503) 383-1442, ashley@SeniorOneSource.net

### 6. Footer
- Single row: "© 2026 Senior One Source" left, Privacy / Terms / Contact links right
- Top border divider

## Accessibility

- Primary and body text meet WCAG AAA (7:1) contrast on cream background. All secondary text (`muted`, `subtle`, `faint`) meets AA (4.5:1). `dark-muted` text on dark backgrounds meets AA.
- Body text minimum 15px
- Button/touch targets minimum 48px height
- `prefers-reduced-motion` support — disable all animations when set
- Focus rings on all interactive elements
- Semantic HTML (nav, main, section, footer)

## Responsive Behavior

- Hero: 2 columns → single column on mobile (feature cards stack below headline)
- How It Works: 4 columns → 2x2 grid on tablet → single column on mobile
- Testimonials: 2 columns → single column on mobile
- Navbar: collapses to hamburger menu on mobile
- CTA card: reduce padding on mobile

## Metadata Update

Update `layout.tsx`:
- Title: "Senior One Source"
- Description: "Free senior living guidance for Portland families."

## Out of Scope

- Community sign-up page (`/community`) — not part of this redesign
- Customer intake page (`/customer`) — stays as Typeform embed
- CRM dashboard — separate future project
- Dark mode — not needed for this page
