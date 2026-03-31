# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the landing page from a personal brand (Ashley Krause) to a company brand (Senior One Source) with a new visual identity — EB Garamond + Inter, warm cream palette, simplified 6-section layout.

**Architecture:** Replace all existing landing page components with redesigned versions. Update the global CSS to swap the color palette and font stack. The page structure changes from 9 components to 6 (Navbar, HeroSection, HowItWorksSection, TestimonialsSection, CTASection, Footer). Three components are deleted (AboutSection, ServicesSection, CTAMiniSection).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion (kept for subtle animations with prefers-reduced-motion support), Lucide React icons.

**Spec:** `docs/superpowers/specs/2026-03-29-landing-page-redesign-design.md`

---

## File Map

**Modify:**
- `src/app/globals.css` — Replace color palette, font imports, CSS variables
- `tailwind.config.ts` — Update font families, remove unused color tokens
- `src/app/layout.tsx` — Update metadata (title, description)
- `src/app/page.tsx` — Remove deleted component imports, reorder sections
- `src/components/Navbar.tsx` — Full rewrite: new brand, nav links, "Get Started" CTA
- `src/components/HeroSection.tsx` — Full rewrite: two-column layout, feature cards, trust strip
- `src/components/HowItWorksSection.tsx` — Rewrite: serif step numbers, arrow connectors, new copy
- `src/components/TestimonialsSection.tsx` — Rewrite: cream background, 2-column card grid, 2 testimonials
- `src/components/CTASection.tsx` — Rewrite: dark inverted card, light button, contact info
- `src/components/Footer.tsx` — Rewrite: minimal one-line, company brand

**Delete:**
- `src/components/AboutSection.tsx`
- `src/components/ServicesSection.tsx`
- `src/components/CTAMiniSection.tsx`

---

## Chunk 1: Design System Foundation

### Task 1: Update fonts and color palette in globals.css

**Files:**
- Modify: `src/app/globals.css`

**Important:** Preserve these existing lines — do NOT delete them:
- Line 2: `@config "../../tailwind.config.ts";` (Tailwind v4 config directive)
- Line 9: `@import "tailwindcss";` (Tailwind v4 import)
- Line 13: `@custom-variant dark (&:where(.dark, .dark *));` (can stay, harmless)
- Lines 16-18: `html { scroll-behavior: smooth; }` (needed for anchor scrolling)
- Lines 199-207: The second `@layer base` block with `* { @apply border-border }` and heading font-family rule — **keep this**, it applies `var(--font-heading)` to all headings globally.
- Lines 209-213: The `@layer utilities` block with `.text-balance` — keep this.

- [ ] **Step 1: Replace Google Fonts imports**

Replace lines 4-8 in `globals.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap');
```

This removes Playfair Display, DM Sans, Lora, Space Mono, and Onest. Keeps Inter, adds EB Garamond.

- [ ] **Step 2: Remove the outer `:root` block (lines 20-24)**

Delete this block entirely — it conflicts with the new HSL-based variables:

```css
:root {
  color-scheme: light;
  --background: #ffffff;
  --foreground: #171717;
}
```

The `color-scheme: light` will be added to the new `:root` block instead.

- [ ] **Step 3: Replace the `:root` CSS variables in the `@layer base` block**

Replace the entire `:root` block inside `@layer base` (lines 38-123) with:

```css
:root {
    color-scheme: light;

    --background: 37 33% 97%;       /* #FAF8F5 warm cream */
    --foreground: 0 0% 18%;         /* #2E2E2E soft black */

    --primary: 0 0% 18%;            /* #2E2E2E dark — buttons, CTA card */
    --primary-foreground: 37 33% 97%; /* #FAF8F5 text on dark */

    --muted: 0 0% 36%;              /* #5C5C5C body descriptions */
    --muted-foreground: 0 0% 36%;

    --subtle: 20 4% 40%;            /* #6B6560 feature descriptions */
    --faint: 20 4% 43%;             /* #736E69 section labels, footer */

    --card: 0 0% 100%;              /* #FFFFFF */
    --card-foreground: 0 0% 18%;
    --card-border: 30 13% 93%;      /* #F0EDE8 */

    --border: 33 15% 92%;           /* #EFECE7 dividers */
    --input: 33 15% 92%;
    --ring: 215 80% 55%;            /* Focus ring blue */

    --radius: 0.625rem;             /* 10px default */

    --icon-orange: 20 100% 96%;     /* #FFF0EB */
    --icon-green: 150 33% 94%;      /* #EBF5F0 */
    --icon-blue: 215 33% 94%;       /* #EBF0F5 */

    --star: 45 73% 63%;             /* #E8C85A */
    --step-number: 30 10% 87%;      /* #E0DCD7 */
    --dot: 30 7% 81%;               /* #D4D0CB */

    --dark-muted: 0 0% 63%;         /* #A0A0A0 muted text on dark */

    --font-heading: 'EB Garamond', Georgia, serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

    --shadow-card: 0 2px 12px rgba(0, 0, 0, 0.04);
    --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.06);

    /* Legacy variables — retained for /community and /customer pages */
    --secondary: 20 20% 97%;
    --secondary-foreground: 215 19% 34%;
    --secondary-paper: 33, 25%, 93%;
    --secondary-deep: 203 20% 94%;
    --secondary-clinic: 200 15% 97%;
    --secondary-cream: 50 33% 96%;
    --accent: 20 35% 58%;
    --accent-foreground: 0 0% 18%;
    --accent-coral: 6 85% 55%;
    --accent-coral-deep: 6 90% 42%;
    --card-secondary: 176, 5%, 98%;
    --popover: 214 31% 91%;
    --popover-foreground: 222 47% 11%;
    --destructive: 0 72% 50%;
    --destructive-foreground: 0 85% 97%;
    --sage: 152 32% 40%;
    --sage-light: 152 20% 95%;
    --warm-gold: 38 60% 55%;
    --warm-gold-light: 38 50% 85%;
    --charcoal: 200 15% 20%;
    --charcoal-light: 200 10% 50%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 222 47% 11%;
    --sidebar-primary: 200 98% 39%;
    --sidebar-primary-foreground: 204 100% 97%;
    --sidebar-accent: 215 24% 26%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 212 26% 83%;
    --sidebar-ring: 200 98% 39%;
}
```

- [ ] **Step 4: Remove the `.dark` block inside `@layer base`**

Delete the entire `.dark { ... }` block (lines 124-172). Dark mode is out of scope.

- [ ] **Step 5: Update the body styles**

Replace the existing body rule with:

```css
body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: var(--font-body);
}
```

- [ ] **Step 6: Update the `@theme inline` block**

Replace the existing `@theme inline` block with:

```css
@theme inline {
    --color-background: hsl(var(--background));
    --color-foreground: hsl(var(--foreground));
    --font-sans: var(--font-sans);
}
```

- [ ] **Step 7: Add prefers-reduced-motion support**

Add at the end of the file, replacing the existing `@media (prefers-reduced-motion: no-preference)` block and the logo/card/read-the-docs styles (which are unused):

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

- [ ] **Step 8: Add global focus ring styles**

Add after the `@layer utilities` block:

```css
a:focus-visible,
button:focus-visible,
[role="button"]:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
    border-radius: 4px;
}
```

This ensures all interactive elements have visible focus rings for accessibility.

- [ ] **Step 9: Remove unused CSS**

Delete these blocks which are leftover from a previous scaffold:
- `.logo` and `.logo:hover` and `.logo.react:hover` rules
- `@keyframes logo-spin`
- The old `@media (prefers-reduced-motion: no-preference)` block
- `.card` rule (the bare `.card { padding: 2em; }`)
- `.read-the-docs` rule

- [ ] **Step 10: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds (there will be color reference warnings from components not yet updated — that's OK at this stage).

- [ ] **Step 11: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: replace color palette and fonts with new design system

Swap to EB Garamond + Inter, warm cream palette (#FAF8F5),
soft black text (#2E2E2E). Remove dark mode, add
prefers-reduced-motion support."
```

---

### Task 2: Update Tailwind config

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace font families**

Replace the `fontFamily` section in `tailwind.config.ts` with:

```typescript
fontFamily: {
    heading: ['EB Garamond', 'Georgia', 'serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
},
```

Remove `serif` and `mono` font families — they're unused.

- [ ] **Step 2: Simplify colors**

Replace the `colors` section with:

```typescript
colors: {
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
    },
    muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
    },
    card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
        border: 'hsl(var(--card-border))',
    },
},
```

Keep the legacy color groups (`secondary`, `destructive`, `accent`, `popover`, `sage`, `cream`, `gold`, `charcoal`, `sidebar`) — they are still used by `/community` and `/customer` pages and by `src/components/ui/` shadcn components.

- [ ] **Step 3: Add new shadow tokens**

Add `card` and `soft` to the existing `boxShadow` section:

```typescript
card: 'var(--shadow-card)',
soft: 'var(--shadow-soft)',
```

Keep existing shadow entries (`warm`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`) — they may be used by other pages.

- [ ] **Step 4: Keep keyframes, animations, and plugins**

Keep `accordion-down`, `accordion-up` keyframes and `tailwindcss-animate` plugin — they are used by shadcn/ui components in `src/components/ui/`. Remove only `fade-up` (unused by new components).

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: simplify Tailwind config for redesign

Update font families to EB Garamond + Inter, remove unused
color tokens, simplify shadow system."
```

---

### Task 3: Update layout metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update metadata**

Change the metadata object:

```typescript
export const metadata: Metadata = {
    title: "Senior One Source",
    description: "Free senior living guidance for Portland families.",
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update metadata to Senior One Source branding"
```

---

## Chunk 2: Component Rewrites

### Task 4: Rewrite Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar component**

Replace the entire file content with:

```tsx
'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-[hsl(var(--background))] border-b border-[hsl(var(--border))]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
                <Link href="/" className="font-heading text-lg font-medium tracking-tight text-foreground">
                    Senior One Source
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-[13px] text-[hsl(var(--muted))] hover:text-foreground transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/customer"
                        className="bg-foreground text-[hsl(var(--background))] text-xs font-semibold px-5 py-2 rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-[hsl(var(--border))] px-6 pb-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="block py-3 text-[hsl(var(--muted))] hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link
                        href="/customer"
                        className="inline-block mt-2 bg-foreground text-[hsl(var(--background))] text-sm font-semibold px-5 py-2.5 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
```

- [ ] **Step 2: Verify it renders**

Run: `npm run dev` and check `http://localhost:3000` in browser.
Expected: Navbar shows "Senior One Source" brand, nav links, "Get Started" button on cream background.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: rewrite Navbar with company branding and simplified links"
```

---

### Task 5: Rewrite HeroSection

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] **Step 1: Rewrite HeroSection component**

Replace the entire file with:

```tsx
'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ClipboardList, Handshake } from 'lucide-react';

const features = [
    {
        icon: Home,
        title: 'Personalized Matching',
        description: 'Matched to care needs, budget, and location',
        iconBg: 'bg-[hsl(var(--icon-orange))]',
    },
    {
        icon: ClipboardList,
        title: 'Guided Tours',
        description: 'We schedule and accompany every visit',
        iconBg: 'bg-[hsl(var(--icon-green))]',
    },
    {
        icon: Handshake,
        title: 'Move-In Support',
        description: 'Paperwork, coordination, and follow-up',
        iconBg: 'bg-[hsl(var(--icon-blue))]',
    },
];

const trustItems = [
    { number: '600+', label: 'families\nhelped' },
    { number: '100%', label: 'free\nservice' },
    { number: '4.9★', label: 'client\nrating' },
];

const HeroSection = () => {
    return (
        <section className="bg-[hsl(var(--background))]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-14 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <h1 className="font-heading text-4xl sm:text-[46px] font-medium leading-[1.08] tracking-tight text-foreground mb-5">
                            The right senior living, found for you.
                        </h1>
                        <p className="text-[15px] text-[hsl(var(--muted))] leading-[1.7] mb-7 max-w-lg">
                            Free, expert guidance for families navigating senior care in Portland.
                            We do the research, scheduling, and comparison — you make the final call.
                        </p>
                        <div className="flex items-center gap-3.5">
                            <Link
                                href="/customer"
                                className="inline-flex items-center gap-2 bg-foreground text-[hsl(var(--background))] text-sm font-semibold px-8 py-4 rounded-[10px] hover:bg-foreground/90 transition-colors"
                            >
                                Get Started →
                            </Link>
                            <a
                                href="#how-it-works"
                                className="text-sm text-[hsl(var(--muted))] py-4 px-4 hover:text-foreground transition-colors"
                            >
                                Learn how it works
                            </a>
                        </div>
                    </motion.div>

                    {/* Right column — feature cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="flex flex-col gap-3 justify-center"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-center gap-4 bg-white rounded-xl px-6 py-5 border border-[hsl(var(--card-border))] shadow-card"
                            >
                                <div className={`w-10 h-10 rounded-[10px] ${feature.iconBg} flex items-center justify-center shrink-0`}>
                                    <feature.icon className="w-5 h-5 text-foreground/70" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-foreground mb-0.5">
                                        {feature.title}
                                    </p>
                                    <p className="text-[11px] text-[hsl(var(--subtle))]">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Trust strip */}
            <div className="border-t border-[hsl(var(--border))]">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-6 flex items-center justify-center gap-10 sm:gap-12">
                    {trustItems.map((item, i) => (
                        <div key={item.number} className="flex items-center gap-10 sm:gap-12">
                            {i > 0 && (
                                <div className="w-1 h-1 rounded-full bg-[hsl(var(--dot))]" />
                            )}
                            <div className="flex items-center gap-2.5">
                                <span className="font-heading text-2xl font-semibold text-foreground">
                                    {item.number}
                                </span>
                                <span className="text-[11px] text-[hsl(var(--subtle))] leading-tight whitespace-pre-line">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
```

- [ ] **Step 2: Verify it renders**

Run: Check `http://localhost:3000` in browser.
Expected: Two-column hero with headline left, 3 feature cards right, trust strip below.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: rewrite HeroSection with two-column layout and feature cards"
```

---

### Task 6: Rewrite HowItWorksSection

**Files:**
- Modify: `src/components/HowItWorksSection.tsx`

- [ ] **Step 1: Rewrite HowItWorksSection component**

Replace the entire file with:

```tsx
'use client'

import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Tell Us Your Needs',
        description: 'Fill out a short form about care requirements, budget, and preferred location.',
    },
    {
        number: '02',
        title: 'We Call You',
        description: 'A quick conversation to understand your family\'s situation and answer questions.',
    },
    {
        number: '03',
        title: 'Tour & Compare',
        description: 'We schedule tours at matched communities and help you compare options side by side.',
    },
    {
        number: '04',
        title: 'Move In',
        description: 'We handle coordination with the community and support you through move-in day.',
    },
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="bg-[hsl(var(--background))]">
            <div className="mx-6 sm:mx-12 border-t border-[hsl(var(--border))]" />
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[hsl(var(--faint))] mb-3">
                        How It Works
                    </p>
                    <h2 className="font-heading text-[32px] font-medium tracking-tight text-foreground mb-10">
                        Four steps to the right fit.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            <p className="font-heading text-4xl font-medium text-[hsl(var(--step-number))] mb-3 leading-none">
                                {step.number}
                            </p>
                            <h3 className="text-sm font-semibold text-foreground mb-1.5">
                                {step.title}
                            </h3>
                            <p className="text-xs text-[hsl(var(--subtle))] leading-relaxed">
                                {step.description}
                            </p>
                            {index < steps.length - 1 && (
                                <span className="hidden lg:block absolute top-4 -right-3 text-[hsl(var(--dot))] text-sm">
                                    →
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
```

- [ ] **Step 2: Verify it renders**

Run: Check `http://localhost:3000` in browser.
Expected: "How It Works" section with 4 steps in a horizontal grid, faded serif numbers, arrow connectors on desktop.

- [ ] **Step 3: Commit**

```bash
git add src/components/HowItWorksSection.tsx
git commit -m "feat: rewrite HowItWorksSection with serif step numbers and simplified layout"
```

---

### Task 7: Rewrite TestimonialsSection

**Files:**
- Modify: `src/components/TestimonialsSection.tsx`

- [ ] **Step 1: Rewrite TestimonialsSection component**

Replace the entire file with:

```tsx
'use client'

import { motion } from 'framer-motion';

const testimonials = [
    {
        name: 'Sarah M.',
        relation: 'Daughter of client',
        quote: "We were overwhelmed trying to find the right place for my father. They made the entire process feel manageable and even hopeful.",
        rating: 5,
    },
    {
        name: 'David L.',
        relation: 'Son of client',
        quote: "I didn't know where to start. They walked us through every option, came to every tour, and helped us make a decision we feel good about.",
        rating: 5,
    },
];

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="bg-[hsl(var(--background))]">
            <div className="mx-6 sm:mx-12 border-t border-[hsl(var(--border))]" />
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[hsl(var(--faint))] mb-3">
                        What Families Say
                    </p>
                    <h2 className="font-heading text-[32px] font-medium tracking-tight text-foreground mb-10">
                        Trusted by hundreds of Portland families.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-xl p-7 border border-[hsl(var(--card-border))]"
                        >
                            <div className="flex gap-0.5 mb-3.5 text-[13px] text-[hsl(var(--star))]" style={{ letterSpacing: '2px' }}>
                                {'★'.repeat(t.rating)}
                            </div>
                            <p className="text-sm text-[hsl(var(--muted))] leading-[1.7] mb-5 italic">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <p className="text-[13px] font-semibold text-foreground">{t.name}</p>
                            <p className="text-[11px] text-[hsl(var(--subtle))]">{t.relation}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
```

- [ ] **Step 2: Verify it renders**

Run: Check `http://localhost:3000` in browser.
Expected: 2-column testimonial grid with white cards, gold stars, italic quotes.

- [ ] **Step 3: Commit**

```bash
git add src/components/TestimonialsSection.tsx
git commit -m "feat: rewrite TestimonialsSection with 2-column card grid"
```

---

### Task 8: Rewrite CTASection

**Files:**
- Modify: `src/components/CTASection.tsx`

- [ ] **Step 1: Rewrite CTASection component**

Replace the entire file with:

```tsx
'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';

const CTASection = () => {
    return (
        <section id="contact" className="bg-[hsl(var(--background))]">
            <div className="mx-6 sm:mx-12 border-t border-[hsl(var(--border))]" />
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#2E2E2E] rounded-2xl px-8 sm:px-12 py-14 text-center"
                >
                    <p className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[#A0A0A0] mb-3">
                        Ready to Start?
                    </p>
                    <h2 className="font-heading text-[32px] font-medium tracking-tight text-[#FAF8F5] mb-3.5">
                        Let us help you find the right place.
                    </h2>
                    <p className="text-[15px] text-[#A0A0A0] leading-[1.7] mb-8 max-w-lg mx-auto">
                        It&apos;s free, it&apos;s personal, and it starts with a simple form.
                        We&apos;ll take it from there.
                    </p>
                    <Link
                        href="/customer"
                        className="inline-flex items-center gap-2 bg-[#FAF8F5] text-[#2E2E2E] text-sm font-semibold px-8 py-4 rounded-[10px] hover:bg-[#F0EDE8] transition-colors mb-7"
                    >
                        Get Started →
                    </Link>
                    <div className="flex items-center justify-center gap-8 text-[13px] text-[#7A7570]">
                        <a href="tel:5033831442" className="hover:text-[#A0A0A0] transition-colors">
                            📞 (503) 383-1442
                        </a>
                        <a href="mailto:ashley@SeniorOneSource.net" className="hover:text-[#A0A0A0] transition-colors">
                            ✉ ashley@SeniorOneSource.net
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
```

- [ ] **Step 2: Verify it renders**

Run: Check `http://localhost:3000` in browser.
Expected: Dark card with light text, "Get Started" cream button, phone and email below.

- [ ] **Step 3: Commit**

```bash
git add src/components/CTASection.tsx
git commit -m "feat: rewrite CTASection with dark inverted card design"
```

---

### Task 9: Rewrite Footer

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer component**

Replace the entire file with:

```tsx
const Footer = () => {
    return (
        <footer className="bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-heading text-sm text-[hsl(var(--faint))]">
                    © {new Date().getFullYear()} Senior One Source
                </p>
                <div className="flex gap-6 text-xs text-[hsl(var(--faint))]">
                    <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
                    <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
                    <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rewrite Footer with minimal company branding"
```

---

## Chunk 3: Page Assembly & Cleanup

### Task 10: Update page.tsx and delete unused components

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/AboutSection.tsx`
- Delete: `src/components/ServicesSection.tsx`
- Delete: `src/components/CTAMiniSection.tsx`

- [ ] **Step 1: Update page.tsx**

Replace the entire file with:

```tsx
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <main className="min-h-screen bg-[hsl(var(--background))]">
            <Navbar />
            <HeroSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </main>
    );
}
```

- [ ] **Step 2: Delete unused components**

```bash
rm src/components/AboutSection.tsx
rm src/components/ServicesSection.tsx
rm src/components/CTAMiniSection.tsx
```

- [ ] **Step 3: Delete unused component NavLink.tsx if it exists and is not imported elsewhere**

Check if `NavLink.tsx` is imported anywhere other than the old Navbar. If not, delete it.

```bash
grep -r "NavLink" src/ --include="*.tsx" --include="*.ts"
```

If only found in its own file, delete it:
```bash
rm src/components/NavLink.tsx
```

- [ ] **Step 4: Verify full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Visual verification**

Run: `npm run dev` and check `http://localhost:3000`.
Expected: Full page renders with all 6 sections in order: Navbar → Hero → How It Works → Testimonials → CTA → Footer. Cream background, EB Garamond headings, Inter body text, dark buttons.

- [ ] **Step 6: Check responsive behavior**

In browser dev tools, test at:
- Mobile (375px): single column layout, hamburger menu, stacked cards
- Tablet (768px): 2-column grids where applicable
- Desktop (1280px): full layout with 4-column How It Works grid

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git add -u src/components/  # stages deletions
git commit -m "feat: assemble redesigned landing page

Remove AboutSection, ServicesSection, CTAMiniSection.
Page now has 6 sections: Navbar, Hero, How It Works,
Testimonials, CTA, Footer."
```
