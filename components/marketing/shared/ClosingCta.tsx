import Link from 'next/link'

interface ClosingCtaProps {
  heading?: string
  body?: string
}

export default function ClosingCta({
  heading = 'On your 5th agency? See where your marketing is breaking down.',
  body = 'Take the 5-minute assessment to see exactly which parts of your marketing department are missing, broken, or ungoverned.',
}: ClosingCtaProps) {
  return (
    <section
      aria-label="Call to action"
      className="section-glow"
      style={{
        backgroundColor: '#07080f',
        padding: '120px 48px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* H2 */}
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '24px',
          }}
        >
          {heading}
        </h2>

        {/* Body */}
        <p
          style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#9ca3af',
            maxWidth: '520px',
            marginBottom: '40px',
          }}
        >
          {body}
        </p>

        {/* Primary CTA */}
        <Link
          href="/assessment"
          className="btn-primary"
          style={{ fontSize: '16px', padding: '16px 32px', marginBottom: '16px' }}
        >
          Identify Your Marketing Gaps Now <span aria-hidden="true">→</span>
        </Link>

        {/* Secondary text link */}
        <p style={{ fontSize: '15px', color: '#9ca3af' }}>
          Or if you&rsquo;re ready to talk —{' '}
          <Link
            href="/contact"
            style={{
              color: '#ffffff',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'rgba(255,255,255,0.3)',
              transition: 'text-decoration-color 0.2s ease',
            }}
          >
            Book a Call
          </Link>
        </p>

      </div>
    </section>
  )
}
