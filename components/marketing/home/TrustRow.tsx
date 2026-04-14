'use client'

const clients = [
  { src: '/images/logos/logo-liv-golf.png',            alt: 'LIV Golf' },
  { src: '/images/logos/logo-suzuki.png',              alt: 'Suzuki' },
  { src: '/images/logos/logo-hardwood-bargains.png',   alt: 'Hardwood Bargains' },
  { src: '/images/logos/logo-european-wax-center.png', alt: 'European Wax Center' },
  { src: '/images/logos/logo-anytime-fitness.png',     alt: 'Anytime Fitness' },
  { src: '/images/logos/logo-we-are-the-mighty.png',   alt: 'We Are The Mighty' },
]

// Duplicate for seamless loop
const track = [...clients, ...clients]

export default function TrustRow() {
  return (
    <section
      aria-label="Recent clients and partners"
      style={{
        padding: '48px 0',
        background: '#000000',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#4b5563',
          marginBottom: '32px',
        }}
      >
        Recent clients &amp; partners
      </p>

      {/* Scrolling track with edge fades */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Left fade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '80px',
            background: 'linear-gradient(to right, #000000 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        {/* Right fade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '80px',
            background: 'linear-gradient(to left, #000000 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Scrolling inner track */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '64px',
            width: 'max-content',
            animation: 'trust-scroll 15s linear infinite',
            paddingInline: '32px',
          }}
        >
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
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="trust-scroll"] { animation: none; }
        }
      `}</style>
    </section>
  )
}
