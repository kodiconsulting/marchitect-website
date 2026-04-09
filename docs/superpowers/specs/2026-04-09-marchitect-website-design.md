# Marchitect Website — Frontend Design Spec
**Date:** 2026-04-09  
**Status:** Approved

---

## Overview

A 7-page public marketing website for Marchitect, built on top of the existing Next.js 16 portal repo. The marketing site lives alongside the portal — both deployed from the same Vercel project.

---

## Architecture

### Route Groups

```
app/
  (marketing)/
    layout.tsx           ← Shared Nav + Footer for all marketing pages
    page.tsx             ← Home /
    framework/page.tsx   ← /framework
    results/page.tsx     ← /results
    services/page.tsx    ← /services
    about/page.tsx       ← /about
    contact/page.tsx     ← /contact
  (surveys)/
    layout.tsx           ← Minimal header (logo + exit link), white bg, no footer
    assessment/page.tsx  ← /assessment
  dashboard/             ← Portal (untouched)
  login/page.tsx         ← Portal auth (untouched)
```

**Deletion:** `app/page.tsx` (current placeholder) is deleted before any new files are created.

### Design System — Custom-forward (Approach B)

The portal uses shadcn + zinc/blue palette. The marketing site uses dark navy + purple. They are visually distinct enough to warrant separate systems.

**Implementation:**
- Marchitect tokens added to `app/globals.css` under `--m-*` namespace alongside existing shadcn vars
- All marketing UI components built custom in `components/marketing/`
- `components/ui/` (shadcn) remains portal-only and untouched
- shadcn Accordion reused for FAQ section (interactive, already installed)
- shadcn form inputs reused for Contact page form

### Design Tokens (`--m-*` namespace)

| Token | Value | Usage |
|---|---|---|
| `--m-bg` | `#0B0F1A` | Page/hero backgrounds |
| `--m-bg-card` | `#141B2D` | Card backgrounds |
| `--m-bg-card-hover` | `#1A2340` | Card hover state |
| `--m-accent` | `#6B5CE7` | Buttons, active nav, highlights |
| `--m-text` | `#FFFFFF` | Headlines on dark |
| `--m-text-secondary` | `#8892A4` | Body copy, descriptions |
| `--m-text-muted` | `#5A6478` | Labels, metadata |
| `--m-border` | `rgba(255,255,255,0.06)` | Card borders, dividers |

### Typography

Font: Inter (already installed via `next/font/google`).

| Element | Weight | Size (desktop) |
|---|---|---|
| H1 | 800 | 56–72px, `clamp()` |
| H2 | 700 | 36–48px |
| H3 | 600 | 24–28px |
| Body | 400 | 16–18px, line-height 1.6 |
| Eyebrow | 500, all-caps | 11–12px |
| KPI numbers | 800 | 56–80px |
| Button | 600 | 15–16px |

### No Animations

No animation library. No scroll-triggered effects. No count-up animations. Static rendering only.

---

## Pages

### Shared Components

**Nav** (`components/marketing/Nav.tsx`) — client component for scroll state
- Logo left / nav links center / "Take Assessment" CTA right
- Transparent over hero → `--m-bg-card` solid at 60px scroll threshold
- Hamburger menu on mobile (fullscreen overlay)
- Active link highlighted per page

**Footer** (`components/marketing/Footer.tsx`) — server component
- Logo + tagline left / nav links center / copyright right
- Links: Framework / Results / Services / About / Contact / Privacy Policy

---

### Home `/`

**Visual reference:** https://flock-ramp.webflow.io/

Section order (dark/light alternating):

| # | Component | Background |
|---|---|---|
| 1 | NAV | Transparent → dark |
| 2 | HERO | Dark (`--m-bg`) + purple radial glow |
| 3 | TRUST_ROW | Dark, subtle border top/bottom |
| 4 | PROBLEM_BLOCK | Light (white/off-white) |
| 5 | SOLUTION_BLOCK | Dark |
| 6 | KPI_CARDS | Light |
| 7 | FRAMEWORK_TEASER | Dark |
| 8 | TESTIMONIALS | Light |
| 9 | FAQ_STRIP | Light (shadcn Accordion) |
| 10 | CLOSING_CTA | Dark |
| 11 | FOOTER | Dark |

**HERO:** Full-viewport centered. Eyebrow → H1 → subhead → dual CTAs (Primary: "Take Assessment" / Secondary outlined: "Book a Call"). No scroll indicator animation.

**PROBLEM_BLOCK:** Two-column split. Left: H2 + body. Right: 3 symptom cards. Section label `01`.

**SOLUTION_BLOCK:** Centered, max 760px. H2 + body + single CTA. Section label `02`.

**KPI_CARDS:** 3-column grid. Each card: big number, label, description. Link to `/results`. Section label `03`.

**FRAMEWORK_TEASER:** 5 tiles (A–E). Responsive grid (5-col desktop, 2-3-col tablet, 1-col mobile). Dual CTAs at bottom. Section label `04`.

**TESTIMONIALS:** 3-column card grid. Placeholder copy — to be replaced before launch.

**FAQ_STRIP:** Single column, max 760px, shadcn Accordion. 5 questions.

**CLOSING_CTA:** Centered dark banner. H2 + body + "Take Assessment" button + "Book a Call" text link.

---

### Framework `/framework`

**Visual reference:** https://flock-ramp.webflow.io/individual-overview

- **HERO:** Split layout — 60/40 left/right. Left: eyebrow + H1. Right: body + pill tags + dual CTAs.
- **FRAMEWORK_OVERVIEW:** 5 detailed bucket cards (A–E), each with full deliverables list. Light background.
- **PROOF_PANEL:** Dark. 3 stats. CTA.
- **POSITIONING_BLOCK:** Light. Centered text.
- **EXECUTION_BOUNDARY:** Two-column split. Light gray.
- **CLOSING_CTA:** Same as Home.

---

### Results `/results`

**Visual reference:** TBD

- **HERO:** Simple. H1 "Results" + subhead.
- **KPI_BANNER:** Full-width horizontal stat strip. 3 numbers.
- **CASE_STUDY × 3:** Hardwood Bargains / BMI of Texas / CBD Brand. Alternating light/gray. Each: eyebrow, H2, context, problem, solution, outcome, stats block.
- **CLOSING_CTA:** "See what's breaking your marketing ROI."

---

### Services `/services`

**Visual reference:** https://flock-ramp.webflow.io/integrations

- **HERO:** Simple. H1 "Services" + subhead + body.
- **CATEGORY_STRIP:** Horizontal pill label strip. Light gray.
- **EXECUTION_FRAMING:** Two-column. Two implementation options explained.
- **SERVICE_BLOCKS:** 10 numbered blocks, alternating light/gray. Each: title + description + tag pills.
- **CLOSING_CTA:** "Start with the Assessment — execution scope comes after."

---

### About `/about`

**Visual reference:** https://flock-ramp.webflow.io/about

- **HERO:** Large typographic. H1 "About."
- **ABOUT_INTRO:** Two-column. "Our Why" eyebrow. Light.
- **ORIGIN_STORY:** Full-width narrative. Light gray.
- **CREDENTIALS:** 4-tile KPI grid. Light.
- **APPROACH_STEPS:** Dark. 3 step cards (Diagnose / Install / Enable). Timeline pattern: vertical center line, alternating left/right cards with dot connectors.
- **PRINCIPLES:** Light. Centered numbered list.
- **CLOSING_CTA:** "Ready to stop guessing?"

---

### Contact `/contact`

**Visual reference:** https://flock-ramp.webflow.io/contact

- **HERO:** Simple. H1 "Let's talk." + subhead.
- **CONTACT_SPLIT:** Two-column. Left: "Book a Call" + GoHighLevel calendar iframe. Right: "Send a Message" + contact form.
- **CONTACT_INFO:** Light gray strip. Email / location / response time.
- **CLOSING_CTA:** Standard.

**Contact form** submits to `POST /api/contact` — saves to DB, triggers email notification to Mike.

**Data model — `contact_inquiries` table:**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `created_at` | timestamp | |
| `name` | text | Required |
| `email` | text | Required |
| `company` | text | Optional |
| `message` | text | Required |

---

### Assessment `/assessment`

**Visual reference:** https://flock-ramp.webflow.io/affiliate-program

**Layout:** `(surveys)` route group. Minimal header (logo left, progress center, "Exit" right). White background. No footer.

**Flow:**
1. Intro screen → "Start Assessment" button
2. 7 questions, one per screen
3. Results screen → GoHighLevel calendar iframe to book call

**UX:** The assessment page is a client component (`'use client'`). React `useState` manages current step and accumulated answers. No URL changes between steps. Progress bar shows `Question N of 7`. Back button on each screen. Single-select per question.

**Data model — `assessment_submissions` table:**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `created_at` | timestamp | |
| `session_id` | text | Anonymous browser identifier |
| `responses` | jsonb | All 7 answers keyed by question index |
| `results_shown_at` | timestamp | When results screen was reached |
| `call_booked` | boolean | Future: populated via GHL webhook |

**API:** `POST /api/assessment/submit` — called on completion. Saves submission. Returns `{ submissionId }`.

**Portal connection:** Out of scope for this build. The `assessment_submissions` table is created and populated. A future portal feature (separate spec) will provide a submissions review view and manual workspace promotion flow. Auto-promotion via GHL webhook is also future scope.

---

## Responsive

| Breakpoint | Notes |
|---|---|
| Mobile (<768px) | Nav collapses to hamburger fullscreen overlay. Hero text uses `clamp()`. Card grids go 1-col. Split layouts stack. Timeline → single column vertical list. |
| Tablet (768–1024px) | Card grids go 2-col. Split layouts may stay 2-col or stack depending on content. |
| Desktop (>1024px) | Full layouts. Max container width 1280px. |

---

## API Routes (new)

| Route | Method | Purpose |
|---|---|---|
| `/api/assessment/submit` | POST | Save assessment submission to DB |
| `/api/contact` | POST | Save contact form + notify Mike |

---

## Build Order

1. **Wipe** `app/page.tsx`
2. **Setup** `(marketing)` and `(surveys)` route groups with stub layouts and placeholder pages
3. **Add** `--m-*` tokens to `globals.css`
4. **Build Home page** one component at a time (Nav → Hero → sections → Footer), confirmed before moving on
5. **Build remaining pages** in order: Framework → Results → Services → About → Contact
6. **Build Assessment** page and `assessment_submissions` DB table + API route
7. **Build Contact** form API route

---

## Notes

- The `frontend-design` skill should be invoked at the start of each page/component build
- No animations anywhere on the site
- Testimonials use placeholder copy — to be replaced with real quotes before launch
- GoHighLevel calendar URL to be provided before Contact and Assessment pages are built
- The Results page visual reference is TBD — coordinate with Mike before building
