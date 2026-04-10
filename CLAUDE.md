# Marchitect Website — Project Context for Claude Code

## What We're Building
A marketing website for Marchitect — a marketing strategy and systems firm. 7 pages total.

## Stack
- Next.js + Tailwind CSS
- Hosted on Vercel
- DNS via Namecheap

## Full Spec
All page content, copy, section structure, and component specs are in:
`Marchitect_Website_Spec.md` (in this same directory)

Read the relevant page section before building anything. The spec is the source of truth for what gets built and why.

## Design System
**Style guide:** https://flock-ramp.webflow.io/utility-pages/style-guide
Pull all colors, fonts, spacing, button styles, and component patterns from this style guide.

**Core palette (approximate — confirm against style guide):**
- Page background: `#0B0F1A` (deep dark navy)
- Card background: `#141B2D`
- Primary accent: `#6B5CE7` (purple/violet)
- Text primary: `#FFFFFF`
- Text secondary: `#8892A4`
- Borders: `rgba(255,255,255,0.06)`

**This is a dark-first design. No light sections. All pages use the dark navy palette.**

## Design Philosophy
> Content dictates the wireframe. Flock Ramp dictates the visual execution.

The spec defines structure and copy. The Flock Ramp reference URL for each page defines how it looks.

## CTAs
- Primary: "Take Assessment" → `/assessment`
- Secondary: "Book a Call" → `/contact`
Both appear in the nav header and at the bottom of every page.

## Key Visual Patterns (from Flock Ramp)
- **Cards:** Rounded (12–16px), `#141B2D` bg, subtle border, hover lifts background
- **Buttons:** Purple gradient fill, arrow icon, rounded (not pill)
- **Glow effect:** Diffused purple radial glow behind hero elements
- **Timeline pattern:** Vertical center line, alternating left/right cards with dot connectors — use for step sequences (About page: Diagnose/Install/Enable; Framework page: bucket sequence)
- **Feature split block:** Bold headline + body left, visual/illustration right

## Site Map
| Page | Route | Flock Ramp Visual Reference |
|---|---|---|
| Home | `/` | https://flock-ramp.webflow.io/ |
| Framework | `/framework` | https://flock-ramp.webflow.io/individual-overview |
| Results | `/results` | TBD |
| Services | `/services` | https://flock-ramp.webflow.io/integrations |
| About | `/about` | https://flock-ramp.webflow.io/about |
| Assessment | `/assessment` | https://flock-ramp.webflow.io/affiliate-program |
| Contact | `/contact` | https://flock-ramp.webflow.io/contact |

## Build Approach
- Build one page at a time, one component at a time
- Read the spec section for the current page before writing any code
- Match the Flock Ramp reference page for visual treatment
- Don't build the next component until the current one is confirmed
