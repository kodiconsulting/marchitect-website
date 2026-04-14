// Placeholder testimonials — swap quote/name/title/company for real client content when ready.

const QUOTES = [
  {
    quote:
      "Before Marchitect, we were spending $30K a month on ads with no real idea what was working. Within three months we had a clear framework, an ICP we could actually use, and attribution we trusted for the first time.",
    name: 'Client Name',
    title: 'CEO',
    company: 'Company A',
  },
  {
    quote:
      "The workshops were structured in a way I'd never experienced. Every session had a clear output and we left with something concrete. No fluff, no open-ended brainstorming — just answers.",
    name: 'Client Name',
    title: 'Founder',
    company: 'Company B',
  },
  {
    quote:
      "We finally understand why our funnel wasn't converting. The offer wasn't built for cold traffic. Marchitect diagnosed it in the first session and we rebuilt it in the second. Our CPL dropped by 60%.",
    name: 'Client Name',
    title: 'VP Marketing',
    company: 'Company C',
  },
  {
    quote:
      "I've worked with a lot of consultants. Marchitect is the only one that left us with something we actually own and can run ourselves. The Portal alone is worth it.",
    name: 'Client Name',
    title: 'COO',
    company: 'Company D',
  },
  {
    quote:
      "Our marketing team had been spinning for two years. Not because they were bad — because nobody had ever defined what success looked like or how decisions should get made. Marchitect fixed that.",
    name: 'Client Name',
    title: 'CEO',
    company: 'Company E',
  },
  {
    quote:
      "The five-pillar framework gave our entire team a shared language. Now when we debate channel strategy or budget allocation, everyone's working from the same model. It changed how we operate.",
    name: 'Client Name',
    title: 'Director of Growth',
    company: 'Company F',
  },
]

// Masonry stagger — cards in column 2 drop by 40px on desktop for visual rhythm
const STAGGER: Record<number, string> = { 1: '40px', 4: '40px' }

function QuoteIcon() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'rgba(124,92,252,0.15)',
        border: '1px solid rgba(124,92,252,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        flexShrink: 0,
      }}
    >
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
        <path
          d="M0 12V7.2C0 3.22 2.56 1.02 7.68 0L8.32 1.44C5.97 2.01 4.48 3.17 3.84 4.92H6.4V12H0ZM9.6 12V7.2C9.6 3.22 12.16 1.02 17.28 0L17.92 1.44C15.57 2.01 14.08 3.17 13.44 4.92H16V12H9.6Z"
          fill="#a78bfa"
        />
      </svg>
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  // Placeholder initials avatar — replace outer div with <img> when real headshots are available
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      aria-hidden="true"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(124,92,252,0.2)',
        border: '1px solid rgba(124,92,252,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: '#a78bfa',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section
      aria-label="Client testimonials"
      style={{
        backgroundColor: '#0d0e1a',
        padding: '120px 48px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Headline */}
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '64px',
          }}
        >
          What our clients are saying
        </h2>

        {/* Masonry grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            alignItems: 'start',
          }}
          className="testimonials-grid"
        >
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="testimonial-card"
              style={{
                background: '#12131f',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                transition: 'border-color 0.2s ease',
                // masonry stagger: shift every middle-column card down
                marginTop: STAGGER[i] ?? '0px',
              }}
            >
              <QuoteIcon />

              {/* Quote body */}
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: '#ffffff',
                  flex: 1,
                  marginBottom: '28px',
                }}
              >
                &ldquo;{q.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Avatar name={q.name} />
                <div>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.2,
                    }}
                  >
                    {q.name}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      lineHeight: 1.4,
                      marginTop: '2px',
                    }}
                  >
                    {q.title}, {q.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .testimonial-card:hover {
          border-color: rgba(124, 92, 252, 0.3) !important;
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          /* Disable masonry stagger on tablet */
          .testimonial-card {
            margin-top: 0 !important;
          }
        }
        @media (max-width: 767px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonial-card {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
