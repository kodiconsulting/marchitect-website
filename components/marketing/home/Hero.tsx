import Link from 'next/link'

const CHECK_ITEMS = [
  'Marketing Operating System',
  'Decision Making Framework',
  'Expert FCMO Guidance',
]

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
        overflow: 'hidden',
      }}
    >
      {/* Inner container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '120px 48px 80px',
          display: 'flex',
          alignItems: 'center',
          gap: '64px',
        }}
        className="hero-inner"
      >

        {/* ── Left column ────────────────────────────────────────── */}
        <div
          style={{
            flex: '0 0 55%',
            maxWidth: '55%',
          }}
          className="hero-left"
        >
          {/* Eyebrow pill */}
          <div style={{ marginBottom: '28px' }}>
            <span className="eyebrow-pill">The AI Enabled Marketing Framework</span>
          </div>

          {/* H1 */}
          <h1
            style={{
              color: 'var(--m-text)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 5.5vw, 80px)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '24px',
            }}
          >
            You don&apos;t need a marketer.
            <br />
            You need a Marchitect.
          </h1>

          {/* Subheadline */}
          <p
            style={{
              color: 'var(--m-text-secondary)',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}
          >
            Marketing budgets only go so far without a proper plan.
          </p>

          {/* Body */}
          <p
            style={{
              color: 'var(--m-text-secondary)',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: 1.6,
              maxWidth: '480px',
              marginBottom: '36px',
            }}
          >
            Our decision-making framework governs your objectives, teams, strategies, budgets,
            timelines, and performance — to help you market confidently.
          </p>

          {/* Checkmark row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {CHECK_ITEMS.map((item) => (
              <div key={item} className="check-item">
                <span className="check-icon" aria-hidden="true">✓</span>
                {item}
              </div>
            ))}
          </div>

          {/* Button row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/assessment" className="btn-primary">
              Identify Your Marketing Gaps Now <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className="btn-secondary">
              Book a Call <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* ── Right column ───────────────────────────────────────── */}
        <div
          style={{
            flex: '0 0 45%',
            maxWidth: '45%',
            position: 'relative',
          }}
          className="hero-right"
        >
          {/* Purple radial glow behind card */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-40%, -50%)',
              width: '700px',
              height: '500px',
              background: 'radial-gradient(ellipse at center, rgba(124,92,252,0.25) 0%, transparent 65%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Floating UI card — swap inner content for real screenshot when ready */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              background: '#12131f',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              marginRight: '-48px', /* bleed off right edge */
            }}
          >
            {/* Top bar chrome */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'block' }} />
              <div style={{
                flex: 1,
                marginLeft: '8px',
                height: '8px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.06)',
                maxWidth: '200px',
              }} />
            </div>

            {/* Mock dashboard body */}
            <div style={{ display: 'flex', height: '400px' }}>
              {/* Sidebar */}
              <div style={{
                width: '180px',
                flexShrink: 0,
                borderRight: '1px solid rgba(255,255,255,0.06)',
                padding: '20px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {['Marketing Plan', 'Strategy', 'Budgets', 'Timelines', 'Performance', 'Team'].map((label, i) => (
                  <div key={label} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: i === 0 ? 'rgba(124,92,252,0.15)' : 'transparent',
                    color: i === 0 ? '#a78bfa' : 'rgba(255,255,255,0.3)',
                    fontSize: '13px',
                    fontWeight: i === 0 ? 600 : 400,
                  }}>
                    {label}
                  </div>
                ))}
              </div>

              {/* Main content area */}
              <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Stat cards row */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[['Pipeline', '↑ 42%'], ['MQLs', '↑ 18%'], ['CAC', '↓ 23%']].map(([label, val]) => (
                    <div key={label} style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      padding: '14px',
                    }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>{label}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <div style={{ height: '8px', width: '120px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', paddingTop: '8px' }}>
                    {[55, 70, 45, 85, 60, 90, 75, 95].map((h, i) => (
                      <div key={i} style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: '4px 4px 0 0',
                        background: i === 7
                          ? 'linear-gradient(180deg, #7c5cfc, #a78bfa)'
                          : 'rgba(124,92,252,0.2)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .hero-inner {
            flex-direction: column !important;
            padding: 100px 24px 60px !important;
            gap: 48px !important;
          }
          .hero-left {
            flex: unset !important;
            max-width: 100% !important;
            text-align: center;
          }
          .hero-left .eyebrow-pill {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-left p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-left > div:nth-child(4) {
            justify-content: center;
          }
          .hero-left > div:last-child {
            justify-content: center;
          }
          .hero-right {
            flex: unset !important;
            max-width: 100% !important;
            width: 100%;
          }
          .hero-right > div:last-child {
            margin-right: 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
