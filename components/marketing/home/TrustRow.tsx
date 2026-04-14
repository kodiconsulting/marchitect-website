'use client'

const clients = [
  { src: '/images/logos/logo-liv-golf.png',            alt: 'LIV Golf' },
  { src: '/images/logos/logo-suzuki.png',              alt: 'Suzuki' },
  { src: '/images/logos/logo-hardwood-bargains.png',   alt: 'Hardwood Bargains' },
  { src: '/images/logos/logo-european-wax-center.png', alt: 'European Wax Center' },
  { src: '/images/logos/logo-anytime-fitness.png',     alt: 'Anytime Fitness' },
  { src: '/images/logos/logo-we-are-the-mighty.png',   alt: 'We Are The Mighty' },
]

export default function TrustRow() {
  return (
    <section
      aria-label="Trusted by growing businesses"
      style={{
        padding: '48px 0',
        background: '#000000',
      }}
    >
      <div className="container">
        <p
          style={{
            textAlign: 'center',
            fontSize: '21px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '32px',
          }}
        >
          Trusted by growing businesses
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px',
            flexWrap: 'wrap',
          }}
        >
          {clients.map((client) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={client.alt}
              src={client.src}
              alt={client.alt}
              style={{
                height: '32px',
                width: 'auto',
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
    </section>
  )
}
