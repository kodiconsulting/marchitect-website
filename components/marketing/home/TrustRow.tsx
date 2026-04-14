'use client'

const clients = [
  { src: '/images/logos/logo-liv-golf.png',            alt: 'LIV Golf' },
  { src: '/images/logos/logo-suzuki.png',              alt: 'Suzuki' },
  { src: '/images/logos/logo-hardwood-bargains.png',   alt: 'Hardwood Bargains' },
  { src: '/images/logos/logo-european-wax-center.png', alt: 'European Wax Center' },
  { src: '/images/logos/logo-anytime-fitness.png',     alt: 'Anytime Fitness' },
  { src: '/images/logos/logo-we-are-the-mighty.png',   alt: 'We Are The Mighty' },
]

// Duplicated for seamless loop — each logo carries its own trailing margin
// so both halves are exactly equal width and translateX(-50%) lands perfectly.
const track = [...clients, ...clients]

export default function TrustRow() {
  return (
    <section
      aria-label="Recent clients and partners"
      style={{ padding: '48px 0', background: '#000000', textAlign: 'center' }}
    >
      <p style={{
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#4b5563',
        marginBottom: '32px',
      }}>
        Recent clients &amp; partners
      </p>

      {/* Constrained to page container with edge fades */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Left fade */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
          background: 'linear-gradient(to right, #000000, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        {/* Right fade */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
          background: 'linear-gradient(to left, #000000, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Scrolling track — marginRight on each img so the seam gap matches item gap */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          animation: 'trust-scroll 30s linear infinite',
          willChange: 'transform',
        }}>
          {track.map((client, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`${client.alt}-${i}`}
              src={client.src}
              alt={client.alt}
              style={{
                height: '50px',
                width: 'auto',
                flexShrink: 0,
                marginRight: '80px',
                mixBlendMode: 'screen',
                opacity: 0.8,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes trust-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="trust-scroll"] { animation-play-state: paused !important; }
        }
      `}</style>
    </section>
  )
}
