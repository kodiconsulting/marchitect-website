const SYMPTOMS = [
  "Spend continues without benchmarks — nobody knows what good looks like",
  'Success stays undefined, so attribution stays murky',
  'Every new agency pitch sounds like the answer to a problem nobody has diagnosed',
]

export default function ProblemBlock() {
  return (
    <section
      aria-label="The Problem"
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
            Your marketing has motion. Leadership has no certainty.
          </h2>
          <p
            style={{
              color: '#374151',
              fontWeight: 400,
              fontSize: 'clamp(16px, 1.5vw, 18px)',
              lineHeight: 1.65,
            }}
          >
            When strategy gets delegated to whoever is executing — the agency, the contractor, the loudest internal voice — foundational questions never get answered. Who is the right customer? What does cold traffic need to hear to engage? What does a compelling offer actually look like? What&apos;s a realistic ROI timeline?

Without answers, spend continues without benchmarks. Attribution stays murky. Success stays undefined. And every new agency pitch sounds like the answer to a problem nobody has actually diagnosed.
          </p>
        </div>

        {/* Right: symptom cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <p style={{ color: '#1F2937', fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                {symptom}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
