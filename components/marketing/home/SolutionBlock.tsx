import Link from 'next/link'

export default function SolutionBlock() {
  return (
    <section
      aria-label="The Solution"
      style={{
        backgroundColor: 'var(--m-bg)',
        padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
      }}
    >
      <style>{`
        .m-solution-cta:hover { opacity: 0.88; }
        .m-solution-cta:focus-visible { outline: 2px solid var(--m-accent); outline-offset: 3px; }
      `}</style>
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
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
          The problem isn&apos;t your team or your agency. It&apos;s that nobody is governing the strategy.
        </h2>
        <p
          style={{
            color: 'var(--m-text-secondary)',
            fontWeight: 400,
            fontSize: 'clamp(16px, 1.5vw, 18px)',
            lineHeight: 1.65,
            marginBottom: '2.5rem',
          }}
        >
          Marchitect installs the decision layer that should sit above execution. We define the strategy, structure the offer and funnel, set success definitions and measurement standards, and create the roadmap your team and vendors execute against.

The framework is the operating system. Execution is just what runs on it.
        </p>
        <Link
          href="/framework"
          className="m-solution-cta"
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
