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
      aria-label="Trusted industries"
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
        {INDUSTRIES.map((industry) => (
          <span
            key={industry}
            style={{
              backgroundColor: 'var(--m-bg-card)',
              border: '1px solid var(--m-border)',
              color: 'var(--m-text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              padding: '0.25rem 0.875rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
            }}
          >
            {industry}
          </span>
        ))}
      </div>
    </section>
  )
}
