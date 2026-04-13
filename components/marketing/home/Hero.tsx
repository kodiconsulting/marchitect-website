import Link from 'next/link'

export default function Hero() {
  return (
    <section
      aria-label="Hero"
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
      <style>{`
  .m-cta-primary:hover { opacity: 0.88; }
  .m-cta-primary:focus-visible { outline: 2px solid var(--m-accent); outline-offset: 3px; }
  .m-cta-secondary:hover { background-color: rgba(107, 92, 231, 0.1); }
  .m-cta-secondary:focus-visible { outline: 2px solid var(--m-accent); outline-offset: 3px; }
`}</style>

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
            fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}
        >
          You don&apos;t need a marketer.
          <br />
          You need a Marchitect.
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
          Most companies hire agencies to solve problems agencies can&apos;t solve. The real issue isn&apos;t execution — it&apos;s that nobody has defined the strategy, the offer, the funnel logic, or what success looks like. Marchitect installs the decision-making framework that governs all of it.
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
            className="m-cta-primary"
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
            See Where Your Marketing Gaps Are <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/contact"
            className="m-cta-secondary"
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
