import Link from 'next/link'

const COLUMNS = [
  {
    number: '01',
    title: "They're using the wrong strategies",
    body: "Copying what works in another industry rarely works in yours. Strategy has to fit your business model, audience, and stage.",
  },
  {
    number: '02',
    title: "They can't gauge costs and timeframes",
    body: "Without benchmarks, every budget is a guess and every timeline is wishful thinking.",
  },
  {
    number: '03',
    title: "They don't know who should be on their team",
    body: "Internal vs. external, hire vs. outsource — most companies have the wrong people doing the wrong jobs.",
  },
  {
    number: '04',
    title: "Their data doesn't give actionable insights",
    body: "Broken tracking and disconnected reporting means you can't learn from what's working — so nothing improves.",
  },
]

export default function WhyMarketingFails() {
  return (
    <section
      aria-label="Why most marketing departments fail"
      className="problems-section"
      style={{
        backgroundColor: '#07080f',
        padding: '120px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blue ambient glow at bottom */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '400px',
          background: 'radial-gradient(ellipse at center bottom, rgba(41,82,245,0.35) 0%, rgba(41,82,245,0.1) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section headline */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1.3,
              color: '#ffffff',
              maxWidth: '700px',
              margin: '0 auto',
              letterSpacing: '-0.02em',
            }}
          >
            Why most marketing departments fail
          </h2>
        </div>

        {/* 4-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
            marginBottom: '72px',
          }}
          className="why-fails-grid"
        >
          {COLUMNS.map((col) => (
            <div key={col.number}>
              {/* Number */}
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#4b5563',
                  marginBottom: '32px',
                }}
              >
                {col.number}
              </p>

              {/* Title */}
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.01em',
                }}
              >
                {col.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#9ca3af',
                }}
              >
                {col.body}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative timeline connector — desktop only */}
        <div
          className="why-fails-timeline"
          style={{
            position: 'relative',
            marginBottom: '64px',
          }}
        >
          {/* Horizontal line */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              width: '100%',
            }}
          />
          {/* Three blue dots */}
          {[16.5, 50, 83.5].map((pct) => (
            <span
              key={pct}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: `${pct}%`,
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#2952F5',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/assessment" className="btn-primary">
            Identify Your Marketing Gaps Now <span aria-hidden="true">→</span>
          </Link>
        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1023px) {
          .why-fails-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 767px) {
          .why-fails-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .why-fails-timeline {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
