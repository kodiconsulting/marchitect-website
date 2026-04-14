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
        overflow: 'hidden',
      }}
    >
      {/* ── Left content — constrained to max-width container ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 48px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
      <div
        className="hero-content"
        style={{
          width: '60%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        {/* Eyebrow pill */}
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow-pill">The AI Enabled Marketing Framework</span>
        </div>

        {/* H1 */}
        <h1
          style={{
            color: 'var(--m-text)',
            fontWeight: 700,
            fontSize: 'clamp(36px, 3.5vw, 48px)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: '700px',
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
      </div>

      {/* ── Right panel — absolutely positioned, bleeds to viewport edge ── */}
      <div
        className="hero-image-bleed"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '40%',
          overflow: 'hidden',
        }}
      >
        {/* Blue radial glow behind card */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            transform: 'translateY(-50%)',
            width: '700px',
            height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(71,99,214,0.25) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Floating UI card */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 1,
            background: '#12131f',
            borderRadius: '16px 0 0 16px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRight: 'none',
            boxShadow: '-40px 40px 80px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Chrome bar */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'block' }} />
            ))}
            <div style={{ flex: 1, marginLeft: '8px', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', maxWidth: '200px' }} />
          </div>

          {/* Mock dashboard body */}
          <div style={{ display: 'flex', height: '440px' }}>
            {/* Sidebar */}
            <div style={{
              width: '160px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
              padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {['Marketing Plan', 'Strategy', 'Budgets', 'Timelines', 'Performance', 'Team'].map((label, i) => (
                <div key={label} style={{
                  padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
                  background: i === 0 ? 'rgba(71,99,214,0.15)' : 'transparent',
                  color: i === 0 ? '#7B94E8' : 'rgba(255,255,255,0.3)',
                  fontWeight: i === 0 ? 600 : 400,
                }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Main content area */}
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[['Pipeline', '↑ 42%'], ['MQLs', '↑ 18%'], ['CAC', '↓ 23%']].map(([label, val]) => (
                  <div key={label} style={{
                    flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px', padding: '12px',
                  }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>{label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#7B94E8' }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px',
              }}>
                <div style={{ height: '7px', width: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                  {[55, 70, 45, 85, 60, 90, 75, 95].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
                      background: i === 7 ? 'linear-gradient(180deg, #4763D6, #7B94E8)' : 'rgba(71,99,214,0.2)',
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['ICP & Offer', 'Channel Strategy', 'Budget'].map((item, i) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', width: '90px', flexShrink: 0 }}>{item}</span>
                    <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, #4763D6, #7B94E8)', width: `${[88, 65, 42][i]}%` }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#7B94E8', width: '28px', textAlign: 'right' }}>{[88, 65, 42][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 767px) {
          .hero-content {
            width: 100% !important;
            min-height: unset !important;
            padding: 100px 24px 40px !important;
            text-align: center;
          }
          .hero-content .eyebrow-pill { margin: 0 auto; }
          .hero-content p { margin-left: auto; margin-right: auto; }
          .hero-content > div:nth-child(4) { justify-content: center; }
          .hero-content > div:last-child { justify-content: center; }
          .hero-image-bleed {
            position: relative !important;
            width: 100% !important;
            height: 320px !important;
            margin-top: 40px;
          }
          .hero-image-bleed > div:last-child {
            border-radius: 0 !important;
            border-right: 1px solid rgba(255,255,255,0.08) !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
