# Marchitect Website Frontend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 7-page Marchitect marketing website (Home, Framework, Results, Services, About, Contact, Assessment) on top of the existing Next.js 16 portal repo, with a custom `--m-*` design token system, responsive layouts, and two API routes (assessment submit, contact form).

**Architecture:** Route groups `(marketing)` and `(surveys)` sit alongside the portal's `dashboard/` and `login/` — same Vercel deployment, same DB. Marketing components live in `components/marketing/` and use `--m-*` CSS vars. Portal (`components/ui/`, `app/dashboard/`) is untouched.

**Tech Stack:** Next.js 16.2.2 App Router, React 19, Tailwind CSS v4, TypeScript, Drizzle ORM + postgres-js, shadcn Accordion (FAQ), shadcn form inputs (Contact).

---

### Task 1: Route Group Scaffold + Design Tokens

**Goal:** Delete `app/page.tsx`, create `(marketing)` and `(surveys)` route group stubs, and add `--m-*` design tokens to `globals.css`.

**Files:**
- Delete: `app/page.tsx`
- Create: `app/(marketing)/layout.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(marketing)/framework/page.tsx`
- Create: `app/(marketing)/results/page.tsx`
- Create: `app/(marketing)/services/page.tsx`
- Create: `app/(marketing)/about/page.tsx`
- Create: `app/(marketing)/contact/page.tsx`
- Create: `app/(surveys)/layout.tsx`
- Create: `app/(surveys)/assessment/page.tsx`
- Modify: `app/globals.css`

**Acceptance Criteria:**
- [ ] `app/page.tsx` is deleted (no duplicate root route conflict)
- [ ] `/`, `/framework`, `/results`, `/services`, `/about`, `/contact`, `/assessment` all resolve without 404
- [ ] `--m-*` CSS vars are defined in `:root` and registered in `@theme inline`
- [ ] `npx tsc --noEmit && npm run build` exits 0

**Verify:** `npx tsc --noEmit && npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Delete `app/page.tsx`**

```bash
rm /path/to/project/app/page.tsx
```

Run from the project root:

```bash
rm app/page.tsx
```

- [ ] **Step 2: Add `--m-*` tokens to `app/globals.css`**

Insert the `--m-*` vars at the END of the existing `:root` block (after the last `--sidebar-ring` line, before the closing `}`), and add them to the `@theme inline` block.

Final `app/globals.css` (full file):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-heading: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  /* Marchitect marketing design tokens */
  --color-m-bg: var(--m-bg);
  --color-m-bg-card: var(--m-bg-card);
  --color-m-bg-card-hover: var(--m-bg-card-hover);
  --color-m-accent: var(--m-accent);
  --color-m-text: var(--m-text);
  --color-m-text-secondary: var(--m-text-secondary);
  --color-m-text-muted: var(--m-text-muted);
  --color-m-border: var(--m-border);
}

:root {
  --background: oklch(0.975 0 0);
  --foreground: oklch(0.22 0.05 259);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.05 259);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.05 259);
  --primary: oklch(0.60 0.22 260);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.965 0 0);
  --secondary-foreground: oklch(0.39 0.06 260);
  --muted: oklch(0.965 0 0);
  --muted-foreground: oklch(0.57 0.05 259);
  --accent: oklch(0.965 0 0);
  --accent-foreground: oklch(0.39 0.06 260);
  --destructive: oklch(0.58 0.25 10);
  --border: oklch(0.92 0 0);
  --input: oklch(0.92 0 0);
  --ring: oklch(0.60 0.22 260);
  --chart-1: oklch(0.60 0.22 260);
  --chart-2: oklch(0.70 0.20 145);
  --chart-3: oklch(0.58 0.25 10);
  --chart-4: oklch(0.75 0.15 60);
  --chart-5: oklch(0.65 0.18 200);
  --radius: 0.75rem;
  --sidebar: oklch(1 0 0);
  --sidebar-foreground: oklch(0.22 0.05 259);
  --sidebar-primary: oklch(0.60 0.22 260);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.965 0 0);
  --sidebar-accent-foreground: oklch(0.39 0.06 260);
  --sidebar-border: oklch(0.92 0 0);
  --sidebar-ring: oklch(0.60 0.22 260);
  /* Marchitect marketing design tokens */
  --m-bg: #0B0F1A;
  --m-bg-card: #141B2D;
  --m-bg-card-hover: #1A2340;
  --m-accent: #6B5CE7;
  --m-text: #FFFFFF;
  --m-text-secondary: #8892A4;
  --m-text-muted: #5A6478;
  --m-border: rgba(255, 255, 255, 0.06);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

- [ ] **Step 3: Create `app/(marketing)/layout.tsx`**

```tsx
import type { ReactNode } from 'react'

// Nav and Footer will be created in Task 2.
// Placeholder divs allow the build to succeed now.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Nav placeholder — replaced in Task 2 */}
      <div id="nav-placeholder" />
      {children}
      {/* Footer placeholder — replaced in Task 2 */}
      <div id="footer-placeholder" />
    </>
  )
}
```

- [ ] **Step 4: Create stub marketing pages**

`app/(marketing)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>Home — coming soon</p>
    </main>
  )
}
```

`app/(marketing)/framework/page.tsx`:

```tsx
export default function FrameworkPage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>Framework — coming soon</p>
    </main>
  )
}
```

`app/(marketing)/results/page.tsx`:

```tsx
export default function ResultsPage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>Results — coming soon</p>
    </main>
  )
}
```

`app/(marketing)/services/page.tsx`:

```tsx
export default function ServicesPage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>Services — coming soon</p>
    </main>
  )
}
```

`app/(marketing)/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>About — coming soon</p>
    </main>
  )
}
```

`app/(marketing)/contact/page.tsx`:

```tsx
export default function ContactPage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>Contact — coming soon</p>
    </main>
  )
}
```

- [ ] **Step 5: Create `app/(surveys)/layout.tsx`**

```tsx
import type { ReactNode } from 'react'
import Link from 'next/link'

export default function SurveysLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--m-bg-card)',
          borderBottom: '1px solid var(--m-border)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            color: 'var(--m-text)',
            fontWeight: 700,
            fontSize: '1.125rem',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Marchitect
        </Link>
        <Link
          href="/"
          style={{
            color: 'var(--m-text-secondary)',
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          ← Exit
        </Link>
      </header>
      {children}
    </>
  )
}
```

- [ ] **Step 6: Create `app/(surveys)/assessment/page.tsx`**

```tsx
export default function AssessmentPage() {
  return (
    <main style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <p style={{ color: 'var(--m-text)', padding: '2rem' }}>Assessment — coming soon</p>
    </main>
  )
}
```

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0 with no type errors

- [ ] **Step 8: Commit**

```bash
git add app/globals.css app/(marketing) app/(surveys)
git commit -m "feat: scaffold (marketing) and (surveys) route groups with --m-* design tokens"
```

---

### Task 2: Nav + Footer Components

**Goal:** Build `Nav.tsx` (client component, scroll-aware, mobile hamburger) and `Footer.tsx` (server component), then wire them into `app/(marketing)/layout.tsx`.

**Files:**
- Create: `components/marketing/Nav.tsx`
- Create: `components/marketing/Footer.tsx`
- Modify: `app/(marketing)/layout.tsx`

**Acceptance Criteria:**
- [ ] Nav renders logo left, links center, CTA right on desktop
- [ ] Nav background transitions from transparent to `--m-bg-card` at 60px scroll
- [ ] Mobile hamburger opens fullscreen overlay with nav links
- [ ] Active route link is visually distinguished via `usePathname`
- [ ] Footer renders logo + tagline left, nav links center, copyright right
- [ ] `npx tsc --noEmit && npm run build` exits 0

**Verify:** `npx tsc --noEmit && npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Create `components/marketing/Nav.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Framework', href: '/framework' },
  { label: 'Results', href: '/results' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navBg = scrolled || menuOpen
    ? 'var(--m-bg-card)'
    : 'transparent'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: navBg,
          borderBottom: scrolled || menuOpen
            ? '1px solid var(--m-border)'
            : '1px solid transparent',
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: 'var(--m-text)',
            fontWeight: 800,
            fontSize: '1.25rem',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          Marchitect
        </Link>

        {/* Desktop center links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? 'var(--m-text)' : 'var(--m-text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--m-text)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--m-text-secondary)'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex" style={{ flexShrink: 0 }}>
          <Link
            href="/assessment"
            style={{
              backgroundColor: 'var(--m-accent)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            Take Assessment <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--m-text)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--m-text)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--m-text)',
              transition: 'opacity 0.2s ease',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--m-text)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'var(--m-bg-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            paddingTop: '64px',
          }}
          className="md:hidden"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: isActive ? 'var(--m-text)' : 'var(--m-text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/assessment"
            onClick={() => setMenuOpen(false)}
            style={{
              backgroundColor: 'var(--m-accent)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              marginTop: '1rem',
            }}
          >
            Take Assessment →
          </Link>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Create `components/marketing/Footer.tsx`**

```tsx
import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'Framework', href: '/framework' },
  { label: 'Results', href: '/results' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'var(--m-bg)',
        borderTop: '1px solid var(--m-border)',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'start',
          gap: '2rem',
        }}
        className="footer-grid"
      >
        {/* Left: Logo + tagline */}
        <div>
          <Link
            href="/"
            style={{
              color: 'var(--m-text)',
              fontWeight: 800,
              fontSize: '1.125rem',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Marchitect
          </Link>
          <p
            style={{
              color: 'var(--m-text-muted)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              maxWidth: '220px',
            }}
          >
            Marketing architecture that drives revenue.
          </p>
        </div>

        {/* Center: Nav links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--m-text-secondary)',
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--m-text)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--m-text-secondary)'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Copyright */}
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              color: 'var(--m-text-muted)',
              fontSize: '0.8125rem',
            }}
          >
            © {year} Marchitect. All rights reserved.
          </p>
        </div>
      </div>

      {/* Mobile stack override */}
      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .footer-grid > div:last-child {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  )
}
```

- [ ] **Step 3: Update `app/(marketing)/layout.tsx`**

```tsx
import type { ReactNode } from 'react'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0 with no type errors

- [ ] **Step 5: Commit**

```bash
git add components/marketing/Nav.tsx components/marketing/Footer.tsx app/\(marketing\)/layout.tsx
git commit -m "feat: add Nav and Footer marketing components"
```

---

### Task 3: Home — Hero Section

**Goal:** Build the `Hero` component and wire it into the Home page.

**Files:**
- Create: `components/marketing/home/Hero.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] Hero occupies full viewport height (`min-h-screen`)
- [ ] Purple radial glow is rendered behind the content via an absolutely-positioned overlay
- [ ] Eyebrow, H1, subhead, and two CTAs render with correct copy
- [ ] Primary CTA links to `/assessment`, secondary to `/contact`
- [ ] Layout is centered both vertically and horizontally
- [ ] `npx tsc --noEmit && npm run build` exits 0

**Verify:** `npx tsc --noEmit && npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Create `components/marketing/home/Hero.tsx`**

```tsx
import Link from 'next/link'

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--m-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 1.5rem 4rem',
        overflow: 'hidden',
      }}
    >
      {/* Purple radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '900px',
          height: '600px',
          background:
            'radial-gradient(ellipse at center, rgba(107,92,231,0.28) 0%, rgba(107,92,231,0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '760px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            color: 'var(--m-accent)',
            fontWeight: 500,
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          Marketing Architecture That Drives Revenue
        </p>

        {/* H1 */}
        <h1
          style={{
            color: 'var(--m-text)',
            fontWeight: 800,
            fontSize: 'clamp(48px, 6vw, 72px)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}
        >
          Stop Guessing.
          <br />
          Start Growing.
        </h1>

        {/* Subhead */}
        <p
          style={{
            color: 'var(--m-text-secondary)',
            fontWeight: 400,
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
          }}
        >
          Marchitect diagnoses what&apos;s breaking your marketing ROI—then installs
          the systems, talent, and infrastructure to fix it.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/assessment"
            style={{
              backgroundColor: 'var(--m-accent)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            Take Assessment <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/contact"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--m-accent)',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.875rem 1.75rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              border: '1px solid var(--m-accent)',
            }}
          >
            Book a Call <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/(marketing)/page.tsx`**

```tsx
import Hero from '@/components/marketing/home/Hero'

export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0 with no type errors

- [ ] **Step 4: Commit**

```bash
git add components/marketing/home/Hero.tsx app/\(marketing\)/page.tsx
git commit -m "feat: add Hero section to Home page"
```

---

### Task 4: Home — TrustRow Section

**Goal:** Build the `TrustRow` component showing "Trusted by growth-stage brands in:" with industry labels as horizontal pills.

**Files:**
- Create: `components/marketing/home/TrustRow.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] TrustRow renders on a dark background with subtle top/bottom borders
- [ ] Label text and 5 industry pills render correctly
- [ ] Pills wrap gracefully on small screens
- [ ] `npx tsc --noEmit && npm run build` exits 0

**Verify:** `npx tsc --noEmit && npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Create `components/marketing/home/TrustRow.tsx`**

```tsx
const INDUSTRIES = [
  'E-commerce',
  'SaaS',
  'Professional Services',
  'Health & Wellness',
  'Home Services',
]

export default function TrustRow() {
  return (
    <section
      style={{
        backgroundColor: 'var(--m-bg)',
        borderTop: '1px solid var(--m-border)',
        borderBottom: '1px solid var(--m-border)',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            color: 'var(--m-text-muted)',
            fontSize: '0.875rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Trusted by growth-stage brands in:
        </span>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {INDUSTRIES.map((industry) => (
            <span
              key={industry}
              style={{
                color: 'var(--m-text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                backgroundColor: 'var(--m-bg-card)',
                border: '1px solid var(--m-border)',
                borderRadius: '999px',
                padding: '0.3125rem 0.875rem',
                whiteSpace: 'nowrap',
              }}
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/(marketing)/page.tsx`**

```tsx
import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustRow />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0 with no type errors

- [ ] **Step 4: Commit**

```bash
git add components/marketing/home/TrustRow.tsx app/\(marketing\)/page.tsx
git commit -m "feat: add TrustRow section to Home page"
```

---

### Task 5: Home — ProblemBlock Section (Light)

**Goal:** Build the `ProblemBlock` component — two-column split with section label + H2 + body on the left, and 3 symptom cards on the right. White background.

**Files:**
- Create: `components/marketing/home/ProblemBlock.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] Section uses white (`#FFFFFF`) background
- [ ] Left column renders section label `01`, H2, and body copy in dark text
- [ ] Right column renders 3 symptom cards with off-white background and subtle border
- [ ] Layout is two-column on md+ screens, single column on mobile
- [ ] All copy matches spec exactly
- [ ] `npx tsc --noEmit && npm run build` exits 0

**Verify:** `npx tsc --noEmit && npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Create `components/marketing/home/ProblemBlock.tsx`**

```tsx
const SYMPTOMS = [
  'Campaigns run, but nobody knows what\'s actually driving revenue',
  'Marketing and sales operate in silos — handoffs break down',
  'You\'re spending on tools and talent, but the strategy is unclear',
]

export default function ProblemBlock() {
  return (
    <section
      style={{
        backgroundColor: '#FFFFFF',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* Left: text */}
        <div>
          <p
            style={{
              color: 'var(--m-accent)',
              fontWeight: 500,
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            01
          </p>
          <h2
            style={{
              color: '#0B0F1A',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Your Marketing Is Busy. But Is It Working?
          </h2>
          <p
            style={{
              color: '#374151',
              fontWeight: 400,
              fontSize: 'clamp(16px, 1.5vw, 18px)',
              lineHeight: 1.65,
            }}
          >
            Most growth-stage brands have the energy — but not the
            infrastructure. You&apos;re running campaigns, posting content, and
            pushing offers. But attribution is murky, teams are misaligned, and
            ROI is unclear.
          </p>
        </div>

        {/* Right: symptom cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {SYMPTOMS.map((symptom, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#F7F8FA',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              {/* Accent bullet */}
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--m-accent)',
                  marginTop: '7px',
                }}
              />
              <p
                style={{
                  color: '#1F2937',
                  fontWeight: 400,
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {symptom}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/(marketing)/page.tsx`**

```tsx
import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'
import ProblemBlock from '@/components/marketing/home/ProblemBlock'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustRow />
      <ProblemBlock />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0 with no type errors

- [ ] **Step 4: Commit**

```bash
git add components/marketing/home/ProblemBlock.tsx app/\(marketing\)/page.tsx
git commit -m "feat: add ProblemBlock section to Home page"
```

---

### Task 6: Home — SolutionBlock Section (Dark)

**Goal:** Build the `SolutionBlock` component — centered, max-760px content column, dark background, with H2, body, and a "See the Framework" CTA.

**Files:**
- Create: `components/marketing/home/SolutionBlock.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] Section uses `--m-bg` (#0B0F1A) background
- [ ] Section label `02` renders in accent color
- [ ] H2 and body copy render centered, max-width 760px, in light text
- [ ] CTA "See the Framework" links to `/framework` and uses the primary button style
- [ ] `npx tsc --noEmit && npm run build` exits 0

**Verify:** `npx tsc --noEmit && npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Create `components/marketing/home/SolutionBlock.tsx`**

```tsx
import Link from 'next/link'

export default function SolutionBlock() {
  return (
    <section
      style={{
        backgroundColor: 'var(--m-bg)',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Section label */}
        <p
          style={{
            color: 'var(--m-accent)',
            fontWeight: 500,
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          02
        </p>

        {/* H2 */}
        <h2
          style={{
            color: 'var(--m-text)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
          }}
        >
          A Systematic Approach to Marketing That Actually Scales
        </h2>

        {/* Body */}
        <p
          style={{
            color: 'var(--m-text-secondary)',
            fontWeight: 400,
            fontSize: 'clamp(16px, 1.5vw, 18px)',
            lineHeight: 1.65,
            marginBottom: '2.5rem',
          }}
        >
          Marchitect installs a proven marketing operating system across five
          foundational pillars — from positioning and messaging through revenue
          infrastructure. Every engagement starts with a diagnostic to identify
          exactly what&apos;s broken and what needs to be built.
        </p>

        {/* CTA */}
        <Link
          href="/framework"
          style={{
            backgroundColor: 'var(--m-accent)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '1rem',
            padding: '0.875rem 1.75rem',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          See the Framework <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Update `app/(marketing)/page.tsx`**

```tsx
import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'
import ProblemBlock from '@/components/marketing/home/ProblemBlock'
import SolutionBlock from '@/components/marketing/home/SolutionBlock'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustRow />
      <ProblemBlock />
      <SolutionBlock />
    </main>
  )
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0 with no type errors

- [ ] **Step 4: Commit**

```bash
git add components/marketing/home/SolutionBlock.tsx app/\(marketing\)/page.tsx
git commit -m "feat: add SolutionBlock section to Home page"
```
# Marchitect Website — Implementation Plan Part 2 (Tasks 7–12)

> **For agentic workers:** Use `superpowers-extended-cc:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Stack:** Next.js 16.2.2 App Router, React 19, Tailwind CSS v4, TypeScript.
**Verify command:** `npx tsc --noEmit && npm run build` → exits 0.

---

## Prerequisites (completed in Part 1)

- `app/(marketing)/layout.tsx` — shared Nav + Footer
- `app/(marketing)/page.tsx` — home page (partial, extended here)
- `components/marketing/home/Hero.tsx` — Task 2
- `components/marketing/home/TrustRow.tsx` — Task 3
- `components/marketing/home/ProblemBlock.tsx` — Task 4
- `components/marketing/home/SolutionBlock.tsx` — Task 5 / Task 6
- Design tokens (`--m-*`) added to `app/globals.css`

---

### Task 7: Home — KpiCards Section (Light)

**Goal:** Build the `KpiCards` component — 3-column stat grid with big numbers on a white background.

**Files:**
- Create: `components/marketing/home/KpiCards.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] 3 KPI cards rendered in a responsive grid (3-col desktop, 1-col mobile)
- [ ] Big stat number, label, and description visible in each card
- [ ] Section label `03` rendered as eyebrow
- [ ] "See all results →" link navigates to `/results`
- [ ] White/light background — not dark navy

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/home/KpiCards.tsx`**

```tsx
import Link from 'next/link';

const kpis = [
  {
    number: '3.2×',
    label: 'Average Revenue Lift',
    description:
      'Across clients in the first 90 days of full-system engagement',
  },
  {
    number: '87%',
    label: 'Attribution Clarity',
    description:
      'Of clients can trace every marketing dollar to a revenue outcome after Marchitect',
  },
  {
    number: '14 days',
    label: 'Time to First Insight',
    description:
      "From assessment to a clear picture of what's working and what isn't",
  },
];

export default function KpiCards() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Eyebrow */}
        <p
          className="mb-12 text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          03
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <p
                className="mb-2 text-6xl font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--m-accent)' }}
              >
                {kpi.number}
              </p>
              <p className="mb-3 text-lg font-semibold text-gray-900">
                {kpi.label}
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                {kpi.description}
              </p>
            </div>
          ))}
        </div>

        {/* Results link */}
        <div className="mt-12 text-center">
          <Link
            href="/results"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--m-accent)' }}
          >
            See all results →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add `<KpiCards />` to `app/(marketing)/page.tsx`**

Import and insert `<KpiCards />` after `<SolutionBlock />` and before `<FrameworkTeaser />` (or wherever the partial home page currently ends — it will be fully assembled in Task 9).

```tsx
import KpiCards from '@/components/marketing/home/KpiCards';
// ... existing imports

export default function HomePage() {
  return (
    <>
      {/* existing sections */}
      <KpiCards />
      {/* remaining sections added in Task 9 */}
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 4: Commit**

```bash
git add components/marketing/home/KpiCards.tsx app/\(marketing\)/page.tsx
git commit -m "feat: add KpiCards section to home page"
```

---

### Task 8: Home — FrameworkTeaser Section (Dark)

**Goal:** Build the `FrameworkTeaser` component — 5 tiles for the A–E framework pillars on a dark background.

**Files:**
- Create: `components/marketing/home/FrameworkTeaser.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] Section label `04` rendered as eyebrow
- [ ] H2 "The Five Pillars of Marketing Architecture" present
- [ ] 5 tiles rendered (A–E), each with letter badge, title, and description
- [ ] Responsive grid: 5-col desktop (`lg:grid-cols-5`), 2-col tablet (`md:grid-cols-2`), 1-col mobile
- [ ] "Explore the Framework" primary button links to `/framework`
- [ ] "Take Assessment" secondary text link links to `/assessment`
- [ ] Dark background (`--m-bg`)

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/home/FrameworkTeaser.tsx`**

```tsx
import Link from 'next/link';

const pillars = [
  {
    letter: 'A',
    title: 'Positioning & Messaging',
    description:
      "Define who you're for, what you stand for, and why it matters",
  },
  {
    letter: 'B',
    title: 'Demand Generation',
    description:
      'Build the systems that fill your pipeline with qualified opportunities',
  },
  {
    letter: 'C',
    title: 'Conversion Architecture',
    description: 'Design the paths that turn attention into action',
  },
  {
    letter: 'D',
    title: 'Revenue Infrastructure',
    description:
      'Connect marketing to sales in a closed-loop revenue system',
  },
  {
    letter: 'E',
    title: 'Marketing Operations',
    description:
      'Install the tools, data, and processes that make it all run',
  },
];

export default function FrameworkTeaser() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Eyebrow */}
        <p
          className="mb-6 text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          04
        </p>

        {/* Heading */}
        <h2
          className="mb-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          The Five Pillars of Marketing Architecture
        </h2>

        {/* Intro body */}
        <p
          className="mb-16 max-w-2xl text-lg leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          Every Marchitect engagement is structured around five foundational
          pillars. Together, they form a complete marketing operating system.
        </p>

        {/* Tiles grid */}
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.letter}
              className="rounded-2xl p-6 transition-colors"
              style={{
                backgroundColor: 'var(--m-bg-card)',
                border: '1px solid var(--m-border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  'var(--m-bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  'var(--m-bg-card)';
              }}
            >
              {/* Letter badge */}
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: 'rgba(107, 92, 231, 0.15)',
                  color: 'var(--m-accent)',
                }}
              >
                {pillar.letter}
              </div>

              <h3
                className="mb-2 text-base font-semibold leading-snug"
                style={{ color: 'var(--m-text)' }}
              >
                {pillar.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            Explore the Framework →
          </Link>
          <Link
            href="/assessment"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            Take Assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add `<FrameworkTeaser />` to `app/(marketing)/page.tsx`**

```tsx
import FrameworkTeaser from '@/components/marketing/home/FrameworkTeaser';
// ... existing imports

export default function HomePage() {
  return (
    <>
      {/* existing sections */}
      <KpiCards />
      <FrameworkTeaser />
      {/* remaining sections added in Task 9 */}
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 4: Commit**

```bash
git add components/marketing/home/FrameworkTeaser.tsx app/\(marketing\)/page.tsx
git commit -m "feat: add FrameworkTeaser section to home page"
```

---

### Task 9: Home — Testimonials, FaqStrip, ClosingCta + Wire Full Home Page

**Goal:** Build `Testimonials`, `FaqStrip`, and `ClosingCta` components, then assemble the complete home page with all 9 sections in order.

**Files:**
- Create: `components/marketing/home/Testimonials.tsx`
- Create: `components/marketing/home/FaqStrip.tsx`
- Create: `components/marketing/shared/ClosingCta.tsx`
- Modify: `app/(marketing)/page.tsx`

**Acceptance Criteria:**
- [ ] shadcn Accordion installed (`components/ui/accordion.tsx` exists)
- [ ] 3 testimonial cards visible on light background in a responsive 3-col grid
- [ ] 5 FAQ accordion items expand/collapse correctly
- [ ] `ClosingCta` renders on dark background with H2, body, primary button, and text link
- [ ] Home page renders all 9 sections in order with no TypeScript errors

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Install shadcn Accordion component**

```bash
npx shadcn@latest add accordion
```

Confirm `components/ui/accordion.tsx` was created.

- [ ] **Step 2: Create `components/marketing/home/Testimonials.tsx`**

```tsx
const testimonials = [
  {
    quote:
      'Marchitect gave us the clarity we needed to stop wasting budget and start attributing revenue properly. It changed how we run marketing.',
    name: 'Sarah K.',
    title: 'VP Marketing, E-commerce Brand',
  },
  {
    quote:
      "The diagnostic alone was worth it. We found three major gaps in our funnel we didn't know existed.",
    name: 'James T.',
    title: 'CEO, SaaS Company',
  },
  {
    quote:
      "Mike doesn't just consult — he installs systems that keep working after he's gone.",
    name: 'Rachel M.',
    title: 'Founder, Health Brand',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          What Clients Say
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              {/* Quote mark */}
              <div
                className="mb-4 text-4xl font-extrabold leading-none"
                style={{ color: 'var(--m-accent)' }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <p className="mb-6 flex-1 text-base leading-relaxed text-gray-700">
                {t.quote}
              </p>

              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/marketing/home/FaqStrip.tsx`**

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How is Marchitect different from a traditional marketing agency?',
    a: "Agencies execute campaigns. Marchitect builds systems. We diagnose what's broken in your marketing infrastructure, install the processes and tools that fix it, and train your team to run it — so it keeps working after our engagement ends.",
  },
  {
    q: 'What size company is Marchitect designed for?',
    a: 'We work best with growth-stage brands doing $2M–$30M in revenue that have marketing activity but lack the systems to scale it. You have the energy and budget — we provide the architecture.',
  },
  {
    q: 'How long does a typical engagement take?',
    a: 'The initial diagnostic takes 2 weeks. A full system installation typically runs 90–120 days depending on scope. Ongoing enablement is structured in 3-month sprints.',
  },
  {
    q: 'Where do we start?',
    a: 'With the Assessment. It takes 5 minutes and gives you an immediate picture of where your marketing architecture is strong and where it\'s breaking down. From there, we schedule a call to walk through your results.',
  },
  {
    q: 'Does Marchitect do execution, or just strategy?',
    a: "Both. We build the strategy and the infrastructure — and we can embed execution resources through our network of vetted specialists. We don't hand you a deck and walk away.",
  },
];

export default function FaqStrip() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-gray-200 bg-white px-6"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-semibold text-gray-900 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-600">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/marketing/shared/ClosingCta.tsx`**

```tsx
import Link from 'next/link';

interface ClosingCtaProps {
  heading?: string;
  body?: string;
}

export default function ClosingCta({
  heading = 'Ready to Stop Guessing?',
  body = 'Take the 5-minute assessment to find out exactly where your marketing architecture is breaking down.',
}: ClosingCtaProps) {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          {heading}
        </h2>
        <p
          className="mb-10 text-lg leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          {body}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            Take Assessment →
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            Book a Call
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Assemble the complete home page in `app/(marketing)/page.tsx`**

Replace the entire file contents:

```tsx
import Hero from '@/components/marketing/home/Hero';
import TrustRow from '@/components/marketing/home/TrustRow';
import ProblemBlock from '@/components/marketing/home/ProblemBlock';
import SolutionBlock from '@/components/marketing/home/SolutionBlock';
import KpiCards from '@/components/marketing/home/KpiCards';
import FrameworkTeaser from '@/components/marketing/home/FrameworkTeaser';
import Testimonials from '@/components/marketing/home/Testimonials';
import FaqStrip from '@/components/marketing/home/FaqStrip';
import ClosingCta from '@/components/marketing/shared/ClosingCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <ProblemBlock />
      <SolutionBlock />
      <KpiCards />
      <FrameworkTeaser />
      <Testimonials />
      <FaqStrip />
      <ClosingCta />
    </>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 7: Commit**

```bash
git add components/marketing/home/Testimonials.tsx \
        components/marketing/home/FaqStrip.tsx \
        components/marketing/shared/ClosingCta.tsx \
        app/\(marketing\)/page.tsx
git commit -m "feat: add Testimonials, FaqStrip, ClosingCta; wire full home page"
```

---

### Task 10: Framework Page (`/framework`)

**Goal:** Build the complete `/framework` page with hero, overview, proof panel, positioning block, execution boundary, and closing CTA.

**Files:**
- Create: `components/marketing/framework/FrameworkHero.tsx`
- Create: `components/marketing/framework/FrameworkOverview.tsx`
- Create: `components/marketing/framework/ProofPanel.tsx`
- Create: `components/marketing/framework/PositioningBlock.tsx`
- Create: `components/marketing/framework/ExecutionBoundary.tsx`
- Modify: `app/(marketing)/framework/page.tsx`

**Acceptance Criteria:**
- [ ] `/framework` renders without errors
- [ ] Hero shows 60/40 split layout with eyebrow, H1, body, pill tags, and dual CTAs
- [ ] FrameworkOverview shows all 5 pillars with full deliverables lists on a light background
- [ ] ProofPanel shows 3 stats on dark background with CTA to `/results`
- [ ] PositioningBlock shows centered text on light background
- [ ] ExecutionBoundary shows two-column "What We Do / What We Don't Do" split on gray background
- [ ] Page ends with `<ClosingCta />`

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/framework/FrameworkHero.tsx`**

```tsx
import Link from 'next/link';

const pillTags = [
  'Positioning',
  'Demand Generation',
  'Conversion',
  'Revenue Infrastructure',
  'Marketing Operations',
];

export default function FrameworkHero() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      {/* Purple radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--m-accent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-5">
          {/* Left — 60% */}
          <div className="lg:col-span-3">
            <p
              className="mb-4 text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--m-accent)' }}
            >
              The Marchitect Framework
            </p>
            <h1
              className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
              style={{ color: 'var(--m-text)' }}
            >
              The Five Pillars of Marketing Architecture
            </h1>
          </div>

          {/* Right — 40% */}
          <div className="lg:col-span-2">
            <p
              className="mb-8 text-lg leading-relaxed"
              style={{ color: 'var(--m-text-secondary)' }}
            >
              Most marketing fails not because of effort or budget — but because
              the underlying architecture is broken. Marchitect diagnoses the
              breaks and installs the systems that make marketing work.
            </p>

            {/* Pill tags */}
            <div className="mb-8 flex flex-wrap gap-2">
              {pillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(107, 92, 231, 0.12)',
                    color: 'var(--m-accent)',
                    border: '1px solid rgba(107, 92, 231, 0.25)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--m-accent)' }}
              >
                Take Assessment →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{
                  borderColor: 'var(--m-border)',
                  color: 'var(--m-text-secondary)',
                }}
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/marketing/framework/FrameworkOverview.tsx`**

```tsx
const pillars = [
  {
    letter: 'A',
    title: 'Positioning & Messaging',
    deliverables: [
      'ICP definition + ideal buyer persona',
      'Messaging matrix + narrative architecture',
      'Value proposition hierarchy',
      'Competitive differentiation map',
    ],
  },
  {
    letter: 'B',
    title: 'Demand Generation',
    deliverables: [
      'Channel strategy + media mix',
      'Content architecture + editorial calendar',
      'Lead magnet + top-of-funnel system',
      'Campaign framework + testing cadence',
    ],
  },
  {
    letter: 'C',
    title: 'Conversion Architecture',
    deliverables: [
      'Funnel audit + conversion rate analysis',
      'Landing page system + A/B testing framework',
      'Email nurture sequences',
      'Retargeting infrastructure',
    ],
  },
  {
    letter: 'D',
    title: 'Revenue Infrastructure',
    deliverables: [
      'CRM audit + pipeline architecture',
      'Marketing-to-sales handoff protocol',
      'Attribution model + revenue tracking',
      'Deal velocity analysis',
    ],
  },
  {
    letter: 'E',
    title: 'Marketing Operations',
    deliverables: [
      'Tech stack audit + recommendations',
      'Data architecture + integration map',
      'Reporting framework + KPI dashboard',
      'Team structure + RACI definition',
    ],
  },
];

export default function FrameworkOverview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-16 text-3xl font-bold text-gray-900 md:text-4xl">
          What Each Pillar Delivers
        </h2>

        <div className="space-y-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.letter}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <div className="flex items-start gap-6">
                {/* Letter badge */}
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-base font-extrabold"
                  style={{
                    backgroundColor: 'rgba(107, 92, 231, 0.12)',
                    color: 'var(--m-accent)',
                  }}
                >
                  {pillar.letter}
                </div>

                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    {pillar.title}
                  </h3>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {pillar.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span
                          className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: 'var(--m-accent)' }}
                          aria-hidden="true"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/marketing/framework/ProofPanel.tsx`**

```tsx
import Link from 'next/link';

const stats = [
  { value: '3.2×', label: 'Average revenue lift' },
  { value: '87%', label: 'Attribution clarity rate' },
  { value: '14 days', label: 'Time to first insight' },
];

export default function ProofPanel() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-4 text-center text-sm font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          The proof is in the numbers.
        </p>
        <h2
          className="mb-16 text-center text-4xl font-bold md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          Results Across Every Pillar
        </h2>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="mb-2 text-6xl font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--m-accent)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-base font-medium"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            See Client Results →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/marketing/framework/PositioningBlock.tsx`**

```tsx
export default function PositioningBlock() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Strategy Without Execution Is Just Advice
        </h2>
        <p className="text-lg leading-relaxed text-gray-600">
          Every Marchitect engagement ends with your team knowing exactly what
          to do next — and equipped with the systems to do it. We don&apos;t
          hand off decks. We install infrastructure.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `components/marketing/framework/ExecutionBoundary.tsx`**

```tsx
const doItems = [
  'Diagnose your current marketing architecture',
  'Define the systems you need to build',
  'Install the processes, tools, and infrastructure',
  'Enable your team to run it independently',
];

const dontItems = [
  'Run one-off campaigns without a system',
  'Hand you a strategy deck and disappear',
  'Bill for activity instead of outcomes',
  'Own your marketing forever',
];

export default function ExecutionBoundary() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Scope — What&apos;s In and What&apos;s Out
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* What We Do */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">
              What We Do
            </p>
            <ul className="space-y-3">
              {doItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--m-accent)' }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* What We Don't Do */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">
              What We Don&apos;t Do
            </p>
            <ul className="space-y-3">
              {dontItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400"
                    style={{ backgroundColor: '#f3f4f6' }}
                    aria-hidden="true"
                  >
                    ✕
                  </span>
                  <span className="text-sm leading-relaxed text-gray-500">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create/replace `app/(marketing)/framework/page.tsx`**

```tsx
import FrameworkHero from '@/components/marketing/framework/FrameworkHero';
import FrameworkOverview from '@/components/marketing/framework/FrameworkOverview';
import ProofPanel from '@/components/marketing/framework/ProofPanel';
import PositioningBlock from '@/components/marketing/framework/PositioningBlock';
import ExecutionBoundary from '@/components/marketing/framework/ExecutionBoundary';
import ClosingCta from '@/components/marketing/shared/ClosingCta';

export const metadata = {
  title: 'The Marchitect Framework | Five Pillars of Marketing Architecture',
  description:
    'Understand the five foundational pillars Marchitect uses to diagnose, install, and enable your marketing architecture.',
};

export default function FrameworkPage() {
  return (
    <>
      <FrameworkHero />
      <FrameworkOverview />
      <ProofPanel />
      <PositioningBlock />
      <ExecutionBoundary />
      <ClosingCta
        heading="Ready to Apply the Framework?"
        body="Take the 5-minute assessment to see exactly which pillars are broken in your marketing architecture."
      />
    </>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 8: Commit**

```bash
git add components/marketing/framework/ app/\(marketing\)/framework/page.tsx
git commit -m "feat: build complete framework page with all sections"
```

---

### Task 11: Results Page (`/results`)

**Goal:** Build the complete `/results` page with hero, KPI banner, and 3 case study blocks.

**Files:**
- Create: `components/marketing/results/ResultsHero.tsx`
- Create: `components/marketing/results/KpiBanner.tsx`
- Create: `components/marketing/results/CaseStudy.tsx`
- Modify: `app/(marketing)/results/page.tsx`

**Acceptance Criteria:**
- [ ] `/results` renders without errors
- [ ] ResultsHero shows H1 and subhead
- [ ] KpiBanner shows 3 stats horizontally on dark background
- [ ] 3 CaseStudy blocks render with correct copy, alternating light/gray backgrounds
- [ ] Each CaseStudy shows eyebrow, company name, context, problem, solution, outcome, and stat chips
- [ ] Page ends with `<ClosingCta />` using custom heading

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/results/ResultsHero.tsx`**

```tsx
export default function ResultsHero() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1
          className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
          style={{ color: 'var(--m-text)' }}
        >
          Results That Speak for Themselves
        </h1>
        <p
          className="text-xl leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          We measure success by one metric: revenue. Here&apos;s what that
          looks like in practice.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/marketing/results/KpiBanner.tsx`**

```tsx
const stats = [
  { value: '3.2×', label: 'Average Revenue Lift' },
  { value: '87%', label: 'Attribution Clarity' },
  { value: '$2M+', label: 'Incremental Revenue Generated Across Portfolio' },
];

export default function KpiBanner() {
  return (
    <section
      className="border-y py-16"
      style={{
        backgroundColor: 'var(--m-bg-card)',
        borderColor: 'var(--m-border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0"
          style={{ '--tw-divide-opacity': '1' } as React.CSSProperties}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-8 text-center md:py-0 ${i > 0 ? 'md:pl-12' : ''} ${i < stats.length - 1 ? 'md:pr-12' : ''}`}
              style={{ borderColor: 'var(--m-border)' }}
            >
              <p
                className="mb-2 text-5xl font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--m-accent)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/marketing/results/CaseStudy.tsx`**

```tsx
interface Stat {
  value: string;
  label: string;
}

interface CaseStudyProps {
  eyebrow: string;
  company: string;
  context: string;
  problem: string;
  solution: string;
  outcome: string;
  stats: Stat[];
  background?: 'white' | 'gray';
}

export default function CaseStudy({
  eyebrow,
  company,
  context,
  problem,
  solution,
  outcome,
  stats,
  background = 'white',
}: CaseStudyProps) {
  const bgClass = background === 'gray' ? 'bg-gray-50' : 'bg-white';

  return (
    <section className={`${bgClass} py-24`}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Eyebrow + company */}
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {eyebrow}
        </p>
        <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
          {company}
        </h2>

        {/* Context */}
        <p className="mb-10 text-base leading-relaxed text-gray-500 italic">
          {context}
        </p>

        {/* Problem / Solution / Outcome */}
        <div className="mb-10 space-y-8">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--m-accent)' }}>
              The Problem
            </p>
            <p className="text-base leading-relaxed text-gray-700">{problem}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--m-accent)' }}>
              The Solution
            </p>
            <p className="text-base leading-relaxed text-gray-700">{solution}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--m-accent)' }}>
              The Outcome
            </p>
            <p className="text-base leading-relaxed text-gray-700">{outcome}</p>
          </div>
        </div>

        {/* Stat chips */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm"
            >
              <p
                className="mb-1 text-3xl font-extrabold leading-none"
                style={{ color: 'var(--m-accent)' }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create/replace `app/(marketing)/results/page.tsx`**

```tsx
import ResultsHero from '@/components/marketing/results/ResultsHero';
import KpiBanner from '@/components/marketing/results/KpiBanner';
import CaseStudy from '@/components/marketing/results/CaseStudy';
import ClosingCta from '@/components/marketing/shared/ClosingCta';

export const metadata = {
  title: 'Results | Marchitect',
  description:
    'Real revenue outcomes from Marchitect engagements. Case studies from Hardwood Bargains, BMI of Texas, and more.',
};

export default function ResultsPage() {
  return (
    <>
      <ResultsHero />
      <KpiBanner />

      <CaseStudy
        eyebrow="E-COMMERCE"
        company="Hardwood Bargains"
        context="Online flooring retailer with strong product but murky attribution and declining ROAS"
        problem="Campaigns were running but nobody could trace which channels were driving actual revenue. Spend was increasing, margins were shrinking."
        solution="Installed a closed-loop attribution model, restructured the media mix, and rebuilt the email infrastructure from scratch."
        outcome="Revenue from marketing-attributable channels increased 2.8× in 90 days. Email became the #1 revenue channel."
        stats={[
          { value: '2.8×', label: 'Revenue from attributed channels' },
          { value: '42%', label: 'Reduction in wasted ad spend' },
          { value: '90 days', label: 'Time to full impact' },
        ]}
        background="white"
      />

      <CaseStudy
        eyebrow="PROFESSIONAL SERVICES"
        company="BMI of Texas"
        context="Regional bariatric surgery group with referral-heavy pipeline and no digital demand generation"
        problem="Entirely dependent on physician referrals. No digital presence, no lead nurture, no way to measure patient acquisition cost."
        solution="Built a full digital demand generation system: content strategy, SEO architecture, paid search, and a patient nurture sequence."
        outcome="Digital inquiries went from near-zero to 40% of total new patient volume within 6 months."
        stats={[
          { value: '40%', label: 'Of new patients from digital channels' },
          { value: '6 months', label: 'To full pipeline diversification' },
          { value: '3.4×', label: 'ROI on digital investment' },
        ]}
        background="gray"
      />

      <CaseStudy
        eyebrow="E-COMMERCE / HEALTH & WELLNESS"
        company="CBD Brand"
        context="Fast-growing CPG brand constrained by ad platform restrictions in the CBD category"
        problem="Paid channels were largely unavailable. Growth was plateauing. The team had no content infrastructure or retention system."
        solution="Built a content-led demand engine, installed email + SMS retention infrastructure, and created a loyalty system that drove repeat purchase."
        outcome="Retention revenue increased 3.1× in 4 months. Email became a channel that runs without ongoing ad spend."
        stats={[
          { value: '3.1×', label: 'Retention revenue increase' },
          { value: '4 months', label: 'Time to impact' },
          { value: '68%', label: 'Email revenue share' },
        ]}
        background="white"
      />

      <ClosingCta
        heading="Ready to See What's Breaking Your Marketing ROI?"
        body="Take the 5-minute assessment to find out exactly where your marketing architecture is breaking down."
      />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 6: Commit**

```bash
git add components/marketing/results/ app/\(marketing\)/results/page.tsx
git commit -m "feat: build complete results page with KPI banner and case studies"
```

---

### Task 12: Services Page (`/services`)

**Goal:** Build the complete `/services` page with hero, category strip, execution framing, 10 service blocks, and closing CTA.

**Files:**
- Create: `components/marketing/services/ServicesHero.tsx`
- Create: `components/marketing/services/CategoryStrip.tsx`
- Create: `components/marketing/services/ExecutionFraming.tsx`
- Create: `components/marketing/services/ServiceBlock.tsx`
- Modify: `app/(marketing)/services/page.tsx`

**Acceptance Criteria:**
- [ ] `/services` renders without errors
- [ ] ServicesHero shows H1 and subhead
- [ ] CategoryStrip shows 5 decorative pill labels on a light gray background
- [ ] ExecutionFraming shows two-column split with both engagement options
- [ ] 10 ServiceBlock instances render in correct order with alternating backgrounds
- [ ] Each ServiceBlock shows number, title, description, and tag pills
- [ ] Page ends with `<ClosingCta />` using custom heading

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/services/ServicesHero.tsx`**

```tsx
export default function ServicesHero() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-4xl px-6">
        <h1
          className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
          style={{ color: 'var(--m-text)' }}
        >
          What We Build
        </h1>
        <p
          className="max-w-2xl text-xl leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          Marchitect delivers across five pillars of marketing architecture.
          Here&apos;s exactly what that includes.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/marketing/services/CategoryStrip.tsx`**

```tsx
const categories = [
  'Positioning & Messaging',
  'Demand Generation',
  'Conversion Architecture',
  'Revenue Infrastructure',
  'Marketing Operations',
];

export default function CategoryStrip() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600"
              aria-hidden="true"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/marketing/services/ExecutionFraming.tsx`**

```tsx
const options = [
  {
    title: 'Strategy + Installation',
    description:
      "We design and build the full system. You end up with documentation, tooling, and a team that can run it independently.",
    bestFor: 'Brands that need the full infrastructure built from scratch',
  },
  {
    title: 'Embedded Execution',
    description:
      "We bring in our network of vetted specialists to execute within the system we've installed. Ongoing, measurable, accountable.",
    bestFor: 'Brands that want Marchitect running alongside their team',
  },
];

export default function ExecutionFraming() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">
          Two Ways to Engage
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {options.map((option) => (
            <div
              key={option.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {option.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                {option.description}
              </p>
              <div className="flex items-start gap-2">
                <span
                  className="mt-0.5 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--m-text-muted)' }}
                >
                  Best for:
                </span>
                <span className="text-xs leading-relaxed text-gray-500">
                  {option.bestFor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/marketing/services/ServiceBlock.tsx`**

```tsx
interface ServiceBlockProps {
  number: number;
  title: string;
  description: string;
  tags: string[];
  background?: 'white' | 'gray';
}

export default function ServiceBlock({
  number,
  title,
  description,
  tags,
  background = 'white',
}: ServiceBlockProps) {
  const bgClass = background === 'gray' ? 'bg-gray-50' : 'bg-white';

  return (
    <section className={`${bgClass} py-16`}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-start gap-8">
          {/* Number */}
          <div
            className="flex-shrink-0 text-4xl font-extrabold leading-none tabular-nums"
            style={{ color: 'var(--m-accent)', opacity: 0.35 }}
            aria-hidden="true"
          >
            {String(number).padStart(2, '0')}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
              {title}
            </h3>
            <p className="mb-5 text-base leading-relaxed text-gray-600">
              {description}
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(107, 92, 231, 0.08)',
                    color: 'var(--m-accent)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create/replace `app/(marketing)/services/page.tsx`**

```tsx
import ServicesHero from '@/components/marketing/services/ServicesHero';
import CategoryStrip from '@/components/marketing/services/CategoryStrip';
import ExecutionFraming from '@/components/marketing/services/ExecutionFraming';
import ServiceBlock from '@/components/marketing/services/ServiceBlock';
import ClosingCta from '@/components/marketing/shared/ClosingCta';

export const metadata = {
  title: 'Services | Marchitect',
  description:
    'Explore the full scope of Marchitect services across positioning, demand generation, conversion, revenue infrastructure, and marketing operations.',
};

const services: {
  title: string;
  description: string;
  tags: string[];
}[] = [
  {
    title: 'ICP & Buyer Persona Development',
    description:
      "Define exactly who you're selling to, what they care about, and where they are in their journey.",
    tags: ['Positioning', 'Strategy'],
  },
  {
    title: 'Messaging Architecture',
    description:
      'Build a messaging hierarchy that works across channels — from homepage headline to sales email subject line.',
    tags: ['Positioning', 'Copywriting'],
  },
  {
    title: 'Channel Strategy & Media Mix',
    description:
      'Determine which channels deserve your budget and what the right mix looks like for your stage and market.',
    tags: ['Demand Generation', 'Strategy'],
  },
  {
    title: 'Content Architecture',
    description:
      'Build an editorial system that produces content with purpose — not just volume.',
    tags: ['Demand Generation', 'Content'],
  },
  {
    title: 'Funnel Design & Conversion Rate Optimization',
    description:
      'Audit your conversion paths, identify the breaks, and rebuild for performance.',
    tags: ['Conversion', 'CRO'],
  },
  {
    title: 'Email & SMS Infrastructure',
    description:
      'Design and build automated sequences that convert, retain, and reactivate.',
    tags: ['Conversion', 'Retention'],
  },
  {
    title: 'CRM Architecture & Pipeline Design',
    description:
      'Build a CRM that reflects how your customers actually buy — and connects marketing to revenue.',
    tags: ['Revenue Infrastructure', 'CRM'],
  },
  {
    title: 'Attribution & Revenue Tracking',
    description:
      "Install the measurement infrastructure that tells you exactly what's driving revenue.",
    tags: ['Revenue Infrastructure', 'Analytics'],
  },
  {
    title: 'Tech Stack Audit & Optimization',
    description:
      "Identify what's missing, what's redundant, and what needs to integrate.",
    tags: ['Marketing Operations', 'Tools'],
  },
  {
    title: 'Reporting Framework & KPI Dashboard',
    description:
      "Build the views that keep your team aligned on what matters — without manual reporting.",
    tags: ['Marketing Operations', 'Analytics'],
  },
];

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <CategoryStrip />
      <ExecutionFraming />

      {services.map((service, i) => (
        <ServiceBlock
          key={service.title}
          number={i + 1}
          title={service.title}
          description={service.description}
          tags={service.tags}
          background={i % 2 === 0 ? 'white' : 'gray'}
        />
      ))}

      <ClosingCta
        heading="Start With the Assessment"
        body="Find out exactly which systems you need to build — before we talk execution scope."
      />
    </>
  );
}
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 7: Commit**

```bash
git add components/marketing/services/ app/\(marketing\)/services/page.tsx
git commit -m "feat: build complete services page with all 10 service blocks"
```
# Marchitect Website — Implementation Plan Part 3 (Tasks 13–18)

> **For agentic workers:** Use `superpowers-extended-cc:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Stack:** Next.js 16.2.2 App Router, React 19, Tailwind CSS v4, TypeScript.
**Verify command:** `npx tsc --noEmit && npm run build` → exits 0.

---

## Prerequisites (completed in Parts 1–2)

- `app/(marketing)/layout.tsx` — shared Nav + Footer
- `components/marketing/shared/ClosingCta.tsx` — shared CTA block (Task 9)
- Design tokens (`--m-*`) added to `app/globals.css`
- `lib/db/schema.ts` — Drizzle ORM schema (existing tables)
- `lib/db/index.ts` — `db` export
- shadcn components: `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/button.tsx`

---

### Task 13: About Page (`/about`)

**Goal:** Build the complete `/about` page with hero, intro, origin story, credentials grid, approach timeline, and principles list.

**Files:**
- Create: `components/marketing/about/AboutHero.tsx`
- Create: `components/marketing/about/AboutIntro.tsx`
- Create: `components/marketing/about/OriginStory.tsx`
- Create: `components/marketing/about/Credentials.tsx`
- Create: `components/marketing/about/ApproachSteps.tsx`
- Create: `components/marketing/about/Principles.tsx`
- Modify: `app/(marketing)/about/page.tsx`

**Acceptance Criteria:**
- [ ] Page renders at `/about` with no TypeScript errors
- [ ] `AboutHero` shows H1 "About." on dark background
- [ ] `AboutIntro` is two-column with light background, eyebrow "OUR WHY", correct copy
- [ ] `OriginStory` is full-width, centered max-760px, with two body paragraphs
- [ ] `Credentials` shows 4 KPI tiles in a responsive grid
- [ ] `ApproachSteps` shows 3 steps in a timeline pattern (alternating left/right desktop, stacked mobile)
- [ ] `Principles` shows numbered list of 5 principles on light background
- [ ] `ClosingCta` renders with H2 "Ready to Stop Guessing?"

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/about/AboutHero.tsx`**

```tsx
export default function AboutHero() {
  return (
    <section
      style={{ backgroundColor: 'var(--m-bg)' }}
      className="pt-32 pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-7xl md:text-9xl font-bold tracking-tight"
          style={{ color: 'var(--m-text)' }}
        >
          About.
        </h1>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/marketing/about/AboutIntro.tsx`**

```tsx
export default function AboutIntro() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-semibold tracking-widest text-purple-600 uppercase mb-4">
            Our Why
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            We Build What Agencies Don&apos;t
          </h2>
        </div>
        <div className="space-y-5">
          <p className="text-lg text-gray-600 leading-relaxed">
            Marchitect exists because growth-stage brands deserve better than
            campaign vendors and strategy consultants who hand off decks. They
            need someone who understands both the strategy and the systems —
            and can install both.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded by Mike Nowotarski, Marchitect brings Fortune 500 marketing
            infrastructure down to the scale of fast-growing brands.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/marketing/about/OriginStory.tsx`**

```tsx
export default function OriginStory() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-[760px] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Why We Started
        </h2>
        <div className="space-y-6 text-left">
          <p className="text-lg text-gray-600 leading-relaxed">
            Most marketing agencies are built around execution. They run your
            ads, write your content, manage your social — and bill for the
            activity, not the outcome. After years of watching smart brands
            waste budget on disconnected tactics, we decided to build something
            different.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Marchitect is built around architecture. We start with the
            diagnostic, install the infrastructure, and enable the team. When
            we&apos;re done, you own a system that runs — whether we&apos;re in
            the room or not.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/marketing/about/Credentials.tsx`**

```tsx
const tiles = [
  { stat: '15+', label: 'Years of marketing experience' },
  { stat: '50+', label: 'Brands served across verticals' },
  { stat: '3.2×', label: 'Average client revenue lift' },
  { stat: '$50M+', label: 'In marketing spend managed' },
]

export default function Credentials() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {tiles.map((tile) => (
          <div
            key={tile.stat}
            className="text-center p-8 rounded-2xl bg-gray-50 border border-gray-100"
          >
            <p className="text-5xl font-bold text-gray-900 mb-3">{tile.stat}</p>
            <p className="text-sm text-gray-500 leading-snug">{tile.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `components/marketing/about/ApproachSteps.tsx`**

```tsx
const steps = [
  {
    number: '01',
    title: 'Diagnose',
    body: 'We start with the assessment and a deep audit of your current marketing architecture. No assumptions. We map exactly what\'s working, what\'s broken, and what\'s missing.',
  },
  {
    number: '02',
    title: 'Install',
    body: 'We design and build the systems your business needs: positioning, demand generation, conversion paths, revenue infrastructure, and operations. Everything connects.',
  },
  {
    number: '03',
    title: 'Enable',
    body: 'We don\'t just hand over documentation. We train your team, set up the dashboards, and make sure you can run the system independently. Then we step back.',
  },
]

export default function ApproachSteps() {
  return (
    <section
      style={{ backgroundColor: 'var(--m-bg)' }}
      className="py-24 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-center mb-20"
          style={{ color: 'var(--m-text)' }}
        >
          How We Work With You
        </h2>

        {/* Desktop: alternating timeline */}
        <div className="hidden md:block relative">
          {/* Center spine */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: 'var(--m-border)' }}
          />

          <div className="space-y-16">
            {steps.map((step, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <div key={step.number} className="relative flex items-center">
                  {/* Left card slot */}
                  <div className="w-1/2 pr-12 flex justify-end">
                    {isLeft && (
                      <div
                        className="max-w-sm w-full rounded-2xl p-8"
                        style={{
                          backgroundColor: 'var(--m-bg-card)',
                          border: '1px solid var(--m-border)',
                        }}
                      >
                        <p
                          className="text-xs font-semibold tracking-widest mb-3"
                          style={{ color: 'var(--m-accent)' }}
                        >
                          {step.number}
                        </p>
                        <h3
                          className="text-2xl font-bold mb-4"
                          style={{ color: 'var(--m-text)' }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-base leading-relaxed"
                          style={{ color: 'var(--m-text-secondary)' }}
                        >
                          {step.body}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: 'var(--m-accent)',
                        borderColor: 'var(--m-bg)',
                      }}
                    />
                  </div>

                  {/* Right card slot */}
                  <div className="w-1/2 pl-12 flex justify-start">
                    {!isLeft && (
                      <div
                        className="max-w-sm w-full rounded-2xl p-8"
                        style={{
                          backgroundColor: 'var(--m-bg-card)',
                          border: '1px solid var(--m-border)',
                        }}
                      >
                        <p
                          className="text-xs font-semibold tracking-widest mb-3"
                          style={{ color: 'var(--m-accent)' }}
                        >
                          {step.number}
                        </p>
                        <h3
                          className="text-2xl font-bold mb-4"
                          style={{ color: 'var(--m-text)' }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className="text-base leading-relaxed"
                          style={{ color: 'var(--m-text-secondary)' }}
                        >
                          {step.body}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl p-7"
              style={{
                backgroundColor: 'var(--m-bg-card)',
                border: '1px solid var(--m-border)',
              }}
            >
              <p
                className="text-xs font-semibold tracking-widest mb-3"
                style={{ color: 'var(--m-accent)' }}
              >
                {step.number}
              </p>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--m-text)' }}
              >
                {step.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `components/marketing/about/Principles.tsx`**

```tsx
const principles = [
  'Diagnosis before prescription. We never recommend before we understand.',
  'Systems over tactics. One good system beats ten disconnected campaigns.',
  'Clarity over cleverness. The best marketing is understood immediately.',
  'Ownership transfers. Every engagement ends with your team in control.',
  'Revenue is the metric. All other metrics serve this one.',
]

export default function Principles() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-14">
          How We Work
        </h2>
        <ol className="space-y-6 text-left">
          {principles.map((principle, idx) => (
            <li key={idx} className="flex gap-6 items-start">
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: 'var(--m-accent)' }}
              >
                {idx + 1}
              </span>
              <p className="text-lg text-gray-700 leading-relaxed pt-1">
                {principle}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Modify `app/(marketing)/about/page.tsx`**

```tsx
import AboutHero from '@/components/marketing/about/AboutHero'
import AboutIntro from '@/components/marketing/about/AboutIntro'
import OriginStory from '@/components/marketing/about/OriginStory'
import Credentials from '@/components/marketing/about/Credentials'
import ApproachSteps from '@/components/marketing/about/ApproachSteps'
import Principles from '@/components/marketing/about/Principles'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export const metadata = {
  title: 'About — Marchitect',
  description:
    'We build marketing infrastructure for growth-stage brands. Learn why Marchitect exists and how we work.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <OriginStory />
      <Credentials />
      <ApproachSteps />
      <Principles />
      <ClosingCta headline="Ready to Stop Guessing?" />
    </>
  )
}
```

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 9: Commit**

```bash
git add components/marketing/about/ app/\(marketing\)/about/page.tsx
git commit -m "feat: build /about page with hero, intro, origin story, credentials, timeline, and principles"
```

---

### Task 14: Contact Page (`/contact`)

**Goal:** Build the complete `/contact` page with split layout, GoHighLevel calendar iframe, contact form (client component), and info strip.

**Files:**
- Create: `components/marketing/contact/ContactHero.tsx`
- Create: `components/marketing/contact/ContactSplit.tsx`
- Create: `components/marketing/contact/ContactForm.tsx`
- Create: `components/marketing/contact/ContactInfo.tsx`
- Modify: `app/(marketing)/contact/page.tsx`

**Acceptance Criteria:**
- [ ] Page renders at `/contact` with no TypeScript errors
- [ ] `ContactHero` shows H1 "Let's Talk." and subhead
- [ ] `ContactSplit` has two columns: GHL iframe left, contact form right (stacks on mobile)
- [ ] Contact form is a `'use client'` component with controlled inputs
- [ ] Form POSTs to `/api/contact` and shows success message on `200`
- [ ] `ContactInfo` shows email, location, and response time as a light strip
- [ ] `ClosingCta` renders at the bottom

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/contact/ContactHero.tsx`**

```tsx
export default function ContactHero() {
  return (
    <section
      style={{ backgroundColor: 'var(--m-bg)' }}
      className="pt-32 pb-16 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
          style={{ color: 'var(--m-text)' }}
        >
          Let&apos;s Talk.
        </h1>
        <p
          className="text-xl md:text-2xl"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          Tell us what you&apos;re working on. We&apos;ll tell you if we can
          help.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/marketing/contact/ContactForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface FormState {
  name: string
  email: string
  company: string
  message: string
}

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  message: '',
}

export default function ContactForm() {
  const [fields, setFields] = useState<FormState>(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Something went wrong')
      }

      setSuccess(true)
      setFields(initialState)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800 mb-2">Message sent!</p>
        <p className="text-green-700">
          Thanks! We&apos;ll be in touch within 1 business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          required
          value={fields.name}
          onChange={handleChange}
          placeholder="Your name"
          disabled={submitting}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={fields.email}
          onChange={handleChange}
          placeholder="you@company.com"
          disabled={submitting}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          value={fields.company}
          onChange={handleChange}
          placeholder="Your company (optional)"
          disabled={submitting}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={fields.message}
          onChange={handleChange}
          placeholder="Tell us what you're working on..."
          disabled={submitting}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create `components/marketing/contact/ContactSplit.tsx`**

```tsx
import ContactForm from './ContactForm'

export default function ContactSplit() {
  return (
    <section
      style={{ backgroundColor: 'var(--m-bg)' }}
      className="py-16 px-6"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Book a Call */}
        <div>
          <h3
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--m-text)' }}
          >
            Book a Call
          </h3>
          {/* TODO: Replace PLACEHOLDER with actual GHL calendar URL before launch */}
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/PLACEHOLDER"
            width="100%"
            height="600"
            frameBorder={0}
            style={{
              border: 'none',
              borderRadius: '12px',
              minHeight: '600px',
            }}
            title="Book a call with Marchitect"
          />
        </div>

        {/* Right: Send a Message */}
        <div>
          <h3
            className="text-2xl font-bold mb-6"
            style={{ color: 'var(--m-text)' }}
          >
            Send a Message
          </h3>
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: 'var(--m-bg-card)',
              border: '1px solid var(--m-border)',
            }}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/marketing/contact/ContactInfo.tsx`**

```tsx
const items = [
  { label: 'Email', value: 'hello@marchitect.com' },
  { label: 'Location', value: 'Austin, TX (serving clients remotely)' },
  { label: 'Response time', value: 'Within 1 business day' },
]

export default function ContactInfo() {
  return (
    <section className="py-14 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
                {item.label}
              </p>
              <p className="text-base font-medium text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Modify `app/(marketing)/contact/page.tsx`**

```tsx
import ContactHero from '@/components/marketing/contact/ContactHero'
import ContactSplit from '@/components/marketing/contact/ContactSplit'
import ContactInfo from '@/components/marketing/contact/ContactInfo'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export const metadata = {
  title: 'Contact — Marchitect',
  description:
    'Book a call or send a message. We respond within 1 business day.',
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSplit />
      <ContactInfo />
      <ClosingCta headline="Ready to Build Your Marketing System?" />
    </>
  )
}
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 7: Commit**

```bash
git add components/marketing/contact/ app/\(marketing\)/contact/page.tsx
git commit -m "feat: build /contact page with split layout, GHL calendar iframe, and contact form"
```

---

### Task 15: DB Schema — `assessment_submissions` + `contact_inquiries`

**Goal:** Add two new tables to the Drizzle schema and generate + apply the migration.

**Files:**
- Modify: `lib/db/schema.ts`

**Acceptance Criteria:**
- [ ] `assessment_submissions` table exported from schema with correct columns
- [ ] `contact_inquiries` table exported from schema with correct columns
- [ ] `npx drizzle-kit generate` produces a new migration file in `lib/db/migrations/`
- [ ] `npx drizzle-kit push` (or migration apply) succeeds against the dev DB
- [ ] `npx tsc --noEmit` exits 0

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Add tables to `lib/db/schema.ts`**

Append the following two table exports to the **bottom** of `lib/db/schema.ts` (after the last existing export):

```ts
export const assessmentSubmissions = pgTable('assessment_submissions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  sessionId: text('session_id').notNull(),
  responses: jsonb('responses').notNull(),
  resultsShownAt: timestamp('results_shown_at'),
  callBooked: boolean('call_booked').notNull().default(false),
})

export const contactInquiries = pgTable('contact_inquiries', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  message: text('message').notNull(),
})
```

Note: `pgTable`, `uuid`, `text`, `timestamp`, `jsonb`, `boolean`, and `sql` are already imported at the top of `schema.ts` — no new imports needed.

- [ ] **Step 2: Generate migration**

```bash
npx drizzle-kit generate
```

Expected: new `.sql` file appears in `lib/db/migrations/`.

- [ ] **Step 3: Apply migration to dev database**

```bash
npx drizzle-kit push
```

Expected: "All changes applied" (or equivalent). Uses `DATABASE_URL` from `.env.local`.

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: exits 0 with no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/db/schema.ts lib/db/migrations/
git commit -m "feat: add assessment_submissions and contact_inquiries tables to schema"
```

---

### Task 16: Assessment Page (`/assessment`)

**Goal:** Build the 7-step assessment as a full client-side multi-screen flow: intro, 7 single-select question screens, and a results screen with GHL calendar.

**Files:**
- Create: `components/marketing/assessment/AssessmentShell.tsx`
- Modify: `app/(surveys)/assessment/page.tsx`
- Modify: `app/(surveys)/layout.tsx`

**Acceptance Criteria:**
- [ ] `AssessmentShell` is `'use client'` and manages `currentStep` (0–8) and `answers` state
- [ ] Step 0 is an intro screen with a "Start Assessment" button
- [ ] Steps 1–7 show one question per screen with 4 single-select options
- [ ] Clicking an option auto-advances to the next step (no separate "Next" button)
- [ ] Progress bar ("Question N of 7") is visible on steps 1–7
- [ ] Back button is available on steps 1–7 and returns to the previous step
- [ ] On completing step 7, `POST /api/assessment/submit` is called with `{ sessionId, responses }`
- [ ] Step 8 is a results screen with H2, body copy, and GHL calendar iframe
- [ ] `app/(surveys)/layout.tsx` has a minimal header: logo left, "Exit" link right
- [ ] `npx tsc --noEmit` exits 0

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `components/marketing/assessment/AssessmentShell.tsx`**

```tsx
'use client'

import { useState, useCallback } from 'react'

const QUESTIONS: { question: string; options: string[] }[] = [
  {
    question: 'How clearly defined is your target customer?',
    options: [
      'Very clear — we have a detailed ICP and buyer personas',
      'Somewhat clear — we know who buys but haven\'t documented it rigorously',
      'Unclear — we serve anyone who can pay',
      'We haven\'t thought about it',
    ],
  },
  {
    question: 'How would you describe your current marketing messaging?',
    options: [
      'Sharp and consistent across all channels',
      'Decent but inconsistent',
      'Generic — we sound like our competitors',
      'We\'re still figuring out what to say',
    ],
  },
  {
    question: 'How confident are you in your demand generation?',
    options: [
      'Very confident — we have predictable pipeline',
      'Working but not scalable',
      'Sporadic — some months are great, others aren\'t',
      'We\'re struggling to generate leads consistently',
    ],
  },
  {
    question: 'How well does your marketing convert?',
    options: [
      'Very well — we have optimized funnels and track everything',
      'Decent but we know there are leaks',
      'Not well — lots of traffic but low conversion',
      'We don\'t really know',
    ],
  },
  {
    question: 'How connected are your marketing and sales teams?',
    options: [
      'Tightly aligned — shared metrics, clean handoffs',
      'Mostly aligned but there are friction points',
      'Siloed — they operate independently',
      'We don\'t really have both functions',
    ],
  },
  {
    question: 'How clear is your marketing attribution?',
    options: [
      'Very clear — we can trace every dollar to an outcome',
      'Mostly clear with some blind spots',
      'Murky — we know some things work but not why',
      'We can\'t attribute our marketing spend',
    ],
  },
  {
    question: 'How mature is your marketing tech stack?',
    options: [
      'Well-integrated and fully utilized',
      'Good tools but underutilized',
      'Patchwork — tools added over time without a system',
      'Basic — email and social, not much else',
    ],
  },
]

type Answers = Record<number, string>

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-4"
        style={{ color: 'var(--m-accent)' }}
      >
        Marketing Infrastructure Assessment
      </p>
      <h1
        className="text-4xl md:text-6xl font-bold mb-6 max-w-2xl"
        style={{ color: 'var(--m-text)' }}
      >
        How strong is your marketing architecture?
      </h1>
      <p
        className="text-lg mb-10 max-w-xl"
        style={{ color: 'var(--m-text-secondary)' }}
      >
        7 questions. 3 minutes. A clear picture of where your marketing
        infrastructure stands — and what to build next.
      </p>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg"
        style={{
          background: 'linear-gradient(135deg, var(--m-accent), #8B7CF6)',
        }}
      >
        Start Assessment →
      </button>
    </div>
  )
}

function QuestionScreen({
  questionIndex,
  totalQuestions,
  question,
  options,
  onAnswer,
  onBack,
}: {
  questionIndex: number
  totalQuestions: number
  question: string
  options: string[]
  onAnswer: (answer: string) => void
  onBack: () => void
}) {
  const progress = (questionIndex / totalQuestions) * 100

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            Question {questionIndex} of {totalQuestions}
          </p>
          <button
            onClick={onBack}
            className="text-sm"
            style={{ color: 'var(--m-text-muted)' }}
          >
            ← Back
          </button>
        </div>
        <div
          className="w-full h-1.5 rounded-full"
          style={{ backgroundColor: 'var(--m-border)' }}
        >
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--m-accent)',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2
        className="text-2xl md:text-3xl font-bold mb-8"
        style={{ color: 'var(--m-text)' }}
      >
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className="w-full text-left rounded-xl px-6 py-5 font-medium transition-colors"
            style={{
              backgroundColor: 'var(--m-bg-card)',
              border: '1px solid var(--m-border)',
              color: 'var(--m-text)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--m-accent)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--m-border)'
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function ResultsScreen() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-4"
        style={{ color: 'var(--m-accent)' }}
      >
        Assessment Complete
      </p>
      <h2
        className="text-4xl md:text-5xl font-bold mb-6"
        style={{ color: 'var(--m-text)' }}
      >
        Your Assessment Is Complete
      </h2>
      <p
        className="text-lg mb-10 max-w-xl mx-auto"
        style={{ color: 'var(--m-text-secondary)' }}
      >
        Based on your answers, Marchitect can help you build the marketing
        infrastructure you need to grow. Book a call to walk through your
        results.
      </p>
      <p
        className="text-base font-semibold mb-6"
        style={{ color: 'var(--m-text)' }}
      >
        Book a Call to Review Your Results
      </p>
      {/* TODO: Replace PLACEHOLDER with actual GHL calendar URL before launch */}
      <iframe
        src="https://api.leadconnectorhq.com/widget/booking/PLACEHOLDER"
        width="100%"
        height="600"
        frameBorder={0}
        style={{
          border: 'none',
          borderRadius: '12px',
          minHeight: '600px',
        }}
        title="Book a call to review your assessment results"
      />
    </div>
  )
}

export default function AssessmentShell() {
  const [currentStep, setCurrentStep] = useState(0) // 0 = intro, 1–7 = questions, 8 = results
  const [answers, setAnswers] = useState<Answers>({})
  const [sessionId] = useState(() => crypto.randomUUID())

  const handleStart = useCallback(() => {
    setCurrentStep(1)
  }, [])

  const handleAnswer = useCallback(
    async (questionIndex: number, answer: string) => {
      const updatedAnswers = { ...answers, [questionIndex]: answer }
      setAnswers(updatedAnswers)

      if (questionIndex === QUESTIONS.length) {
        // Last question answered — submit and show results
        try {
          await fetch('/api/assessment/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              responses: updatedAnswers,
            }),
          })
        } catch {
          // Non-blocking — continue to results even if submission fails
        }
        setCurrentStep(8)
      } else {
        setCurrentStep(questionIndex + 1)
      }
    },
    [answers, sessionId]
  )

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }, [])

  if (currentStep === 0) {
    return (
      <div style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
        <IntroScreen onStart={handleStart} />
      </div>
    )
  }

  if (currentStep === 8) {
    return (
      <div style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
        <ResultsScreen />
      </div>
    )
  }

  const questionIdx = currentStep - 1
  const { question, options } = QUESTIONS[questionIdx]

  return (
    <div style={{ backgroundColor: 'var(--m-bg)', minHeight: '100vh' }}>
      <QuestionScreen
        questionIndex={currentStep}
        totalQuestions={QUESTIONS.length}
        question={question}
        options={options}
        onAnswer={(answer) => handleAnswer(currentStep, answer)}
        onBack={handleBack}
      />
    </div>
  )
}
```

- [ ] **Step 2: Modify `app/(surveys)/layout.tsx`**

```tsx
import Link from 'next/link'

export default function SurveysLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'var(--m-bg)' }} className="min-h-screen">
      {/* Minimal header */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--m-border)' }}
      >
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          style={{ color: 'var(--m-text)' }}
        >
          Marchitect
        </Link>
        <Link
          href="/"
          className="text-sm"
          style={{ color: 'var(--m-text-muted)' }}
        >
          Exit
        </Link>
      </header>

      {children}
    </div>
  )
}
```

- [ ] **Step 3: Modify `app/(surveys)/assessment/page.tsx`**

```tsx
import AssessmentShell from '@/components/marketing/assessment/AssessmentShell'

export const metadata = {
  title: 'Marketing Architecture Assessment — Marchitect',
  description:
    'Take the 7-question marketing infrastructure assessment and find out exactly where your marketing system stands.',
}

export default function AssessmentPage() {
  return <AssessmentShell />
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 5: Commit**

```bash
git add components/marketing/assessment/ app/\(surveys\)/assessment/page.tsx app/\(surveys\)/layout.tsx
git commit -m "feat: build 7-step assessment flow with intro, questions, and results + GHL calendar"
```

---

### Task 17: Assessment API Route

**Goal:** Create `POST /api/assessment/submit` — validates the request body and saves the submission to `assessment_submissions`.

**Files:**
- Create: `app/api/assessment/submit/route.ts`

**Acceptance Criteria:**
- [ ] `POST` with valid `{ sessionId, responses }` inserts a row and returns `{ submissionId }`
- [ ] `POST` with missing or invalid body returns `400`
- [ ] Any DB error returns `500`
- [ ] `npx tsc --noEmit` exits 0

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `app/api/assessment/submit/route.ts`**

```ts
import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { assessmentSubmissions } from '@/lib/db/schema'

const submitSchema = z.object({
  sessionId: z.string().min(1),
  responses: z.record(z.string(), z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = submitSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    const [submission] = await db
      .insert(assessmentSubmissions)
      .values({
        sessionId: parsed.data.sessionId,
        responses: parsed.data.responses,
        resultsShownAt: new Date(),
      })
      .returning({ id: assessmentSubmissions.id })

    return Response.json({ submissionId: submission.id })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 3: Smoke-test (optional, dev only)**

```bash
curl -X POST http://localhost:3000/api/assessment/submit \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","responses":{"1":"Very clear — we have a detailed ICP and buyer personas","2":"Sharp and consistent across all channels"}}'
```

Expected: `{"submissionId":"<uuid>"}`

- [ ] **Step 4: Commit**

```bash
git add app/api/assessment/submit/route.ts
git commit -m "feat: add POST /api/assessment/submit route to persist assessment responses"
```

---

### Task 18: Contact API Route

**Goal:** Create `POST /api/contact` — validates the request, saves the inquiry to `contact_inquiries`, and logs for email notification follow-up.

**Files:**
- Create: `app/api/contact/route.ts`

**Acceptance Criteria:**
- [ ] `POST` with valid `{ name, email, message }` inserts a row and returns `{ success: true, id }`
- [ ] `company` field is optional and stored when present
- [ ] `POST` with missing required fields returns `400`
- [ ] Any DB error returns `500`
- [ ] TODO comment explains how to add Resend email notification
- [ ] `npx tsc --noEmit` exits 0

**Verify:** `npx tsc --noEmit && npm run build`

**Steps:**

- [ ] **Step 1: Create `app/api/contact/route.ts`**

```ts
import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  company: z.string().optional(),
  message: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    const [inquiry] = await db
      .insert(contactInquiries)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company ?? null,
        message: parsed.data.message,
      })
      .returning({ id: contactInquiries.id })

    // TODO: Add email notification to Mike when email service is configured.
    // Recommended: Resend (https://resend.com) — install with: npm install resend
    // Then add:
    //   import { Resend } from 'resend'
    //   const resend = new Resend(process.env.RESEND_API_KEY)
    //   await resend.emails.send({
    //     from: 'noreply@marchitect.com',
    //     to: 'mike@marchitect.com',
    //     subject: `New contact inquiry from ${parsed.data.name}`,
    //     text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nCompany: ${parsed.data.company ?? 'N/A'}\nMessage: ${parsed.data.message}`,
    //   })
    console.log('New contact inquiry saved:', inquiry.id)

    return Response.json({ success: true, id: inquiry.id })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: exits 0

- [ ] **Step 3: Smoke-test (optional, dev only)**

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","company":"Acme Inc","message":"Hello, interested in your services."}'
```

Expected: `{"success":true,"id":"<uuid>"}`

- [ ] **Step 4: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: add POST /api/contact route to persist contact inquiries"
```

---

## Execution Order

Tasks must be executed in order — Task 15 (schema) must complete before Tasks 17 and 18 (API routes) because the routes import `assessmentSubmissions` and `contactInquiries` from the schema.

| Task | Depends On | Notes |
|------|-----------|-------|
| 13   | —         | Pure UI, no DB |
| 14   | —         | Pure UI, no DB (API wired up after Task 18) |
| 15   | —         | Schema + migration first |
| 16   | —         | Pure UI, calls API at runtime only |
| 17   | 15        | Imports `assessmentSubmissions` |
| 18   | 15        | Imports `contactInquiries` |

## Post-Launch Checklist

- [ ] Replace `PLACEHOLDER` in all GHL iframe `src` attributes with the real calendar URL
- [ ] Install `resend` and add `RESEND_API_KEY` env var to Vercel for email notifications in Task 18
- [ ] Set `NEXT_PUBLIC_*` env vars on Vercel if any analytics are added later
