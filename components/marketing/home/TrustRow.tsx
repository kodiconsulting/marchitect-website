// Logo placeholders — replace src values with real client SVGs when available.
// All logos are rendered white/gray via CSS filter.
const LOGOS = [
  { name: 'Client 1', src: null },
  { name: 'Client 2', src: null },
  { name: 'Client 3', src: null },
  { name: 'Client 4', src: null },
  { name: 'Client 5', src: null },
  { name: 'Client 6', src: null },
]

export default function TrustRow() {
  return (
    <section
      aria-label="Trusted by growing businesses"
      style={{
        backgroundColor: '#0d0e1a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Label */}
        <p
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--m-text-muted)',
          }}
        >
          Trusted by growing businesses
        </p>

        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
          }}
        >
          {LOGOS.map((logo) => (
            <div
              key={logo.name}
              style={{
                height: '28px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {logo.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{
                    height: '28px',
                    width: 'auto',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.4,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.7' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.4' }}
                />
              ) : (
                /* Placeholder pill — remove once real logos are added */
                <div
                  aria-label={logo.name}
                  style={{
                    height: '28px',
                    width: '96px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
