import Link from 'next/link'

export default function AboutSplit() {
  return (
    <section
      aria-label="About Marchitect"
      style={{
        backgroundColor: '#000000',
        padding: '120px 48px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '80px',
        }}
        className="about-split"
      >

        {/* ── Left column ─────────────────────────────────── */}
        <div style={{ flex: '0 0 50%', maxWidth: '50%' }} className="about-left">

          {/* Eyebrow */}
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow-pill">About Marchitect</span>
          </div>

          {/* H2 */}
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 36px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: '24px',
            }}
          >
            At Marchitect, we believe guessing is the biggest threat to your marketing&rsquo;s success.
          </h2>

          {/* Paragraph 1 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#9ca3af',
              marginBottom: '16px',
            }}
          >
            Our mission is simple: to give every business the tools they need to make the right
            marketing decisions. Marchitect is your operating system for predictable, informed, and
            efficient marketing departments.
          </p>

          {/* Paragraph 2 */}
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#9ca3af',
              marginBottom: '40px',
            }}
          >
            With Marchitect, you&rsquo;re not just getting advice — you&rsquo;re installing a system
            that governs every marketing decision your team makes, long after we&rsquo;re gone.
          </p>

          <Link href="/about" className="btn-primary">
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* ── Right column ────────────────────────────────── */}
        <div
          style={{ flex: '0 0 50%', maxWidth: '50%' }}
          className="about-right"
        >
          {/*
            Placeholder div — replace with:
            <Image src="/images/mike-placeholder.jpg" alt="Michael Nowotarski" ... />
            once the real photo is available.
          */}
          <div
            style={{
              width: '100%',
              aspectRatio: '4 / 5',
              borderRadius: '16px',
              background: 'linear-gradient(145deg, #12131f 0%, #1a1b2e 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '200px',
                background: 'radial-gradient(ellipse, rgba(71,99,214,0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            {/* Initials avatar */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(71,99,214,0.15)',
                border: '2px solid rgba(71,99,214,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 900,
                color: '#7B94E8',
                zIndex: 1,
              }}
            >
              MN
            </div>
            <p
              style={{
                fontSize: '14px',
                color: '#4b5563',
                zIndex: 1,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Photo coming soon
            </p>
          </div>
        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 767px) {
          .about-split {
            flex-direction: column !important;
            gap: 48px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .about-left,
          .about-right {
            flex: unset !important;
            max-width: 100% !important;
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
