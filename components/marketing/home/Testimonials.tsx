const QUOTES = [
  {
    quote:
      "Can't recommend Marchitect and his team enough. Not only has our revenue grown substantially, but his guidance, expertise and genuine care for our success has made the experience fantastic. Highly recommend.",
    name: 'Matt Fuller',
    company: 'Insight Picture Co',
  },
  {
    quote:
      "Marchitect was amazing to work with! They always respond quickly and have great solutions for my business!",
    name: 'Kevin Conners',
    company: 'Wolf Royalties',
  },
  {
    quote:
      "I've worked with Mike and his team for several years and continue to do so. Professional, fast, and fair. His firm is also one of the few agencies that can develop and execute artistic and strategic game plans. Highly recommended.",
    name: 'Elias Corey',
    company: 'Fighter Pilot Supps',
  },
]

// Masonry stagger — middle card drops by 40px on desktop for visual rhythm
const STAGGER: Record<number, string> = { 1: '40px' }

function QuoteIcon() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: 'rgba(71,99,214,0.15)',
        border: '1px solid rgba(71,99,214,0.2)',
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
          fill="#7B94E8"
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
        background: 'rgba(71,99,214,0.2)',
        border: '1px solid rgba(71,99,214,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: '#7B94E8',
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
        backgroundColor: '#000000',
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
                    {q.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .testimonial-card:hover {
          border-color: rgba(71, 99, 214, 0.3) !important;
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
