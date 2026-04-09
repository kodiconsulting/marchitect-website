import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'Framework', href: '/framework' },
  { label: 'Results', href: '/results' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        backgroundColor: 'var(--m-bg)',
        borderTop: '1px solid var(--m-border)',
        padding: '3rem 1.5rem',
      }}
    >
      <style>{`
        .footer-nav-link {
          color: var(--m-text-secondary);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-nav-link:hover {
          color: var(--m-text);
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .footer-grid > div:last-child {
            text-align: center;
          }
        }
      `}</style>
      <div
        className="footer-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'start',
          gap: '2rem',
        }}
      >
        {/* Left: Logo + tagline */}
        <div>
          <Link
            href="/"
            style={{
              color: 'var(--m-text)',
              fontWeight: 800,
              fontSize: '1.125rem',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            Marchitect
          </Link>
          <p
            style={{
              color: 'var(--m-text-muted)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              maxWidth: '220px',
            }}
          >
            Marketing architecture that drives revenue.
          </p>
        </div>

        {/* Center: Nav links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Copyright */}
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              color: 'var(--m-text-muted)',
              fontSize: '0.8125rem',
            }}
          >
            © {year} Marchitect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
