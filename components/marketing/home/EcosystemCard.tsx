// No client directive needed — pure CSS animations, no interactivity.

const TILES: {
  label: string
  icon: string
  // position within the card container (percent)
  left: number
  top: number
  // which bob keyframe variant (1–5)
  bob: number
  // only show on desktop (hide on mobile)
  desktopOnly?: boolean
}[] = [
  { label: 'Strategy',    icon: '⚡', left:  5,  top: 18, bob: 1 },
  { label: 'ICP',         icon: '◎',  left: 20,  top:  7, bob: 3 },
  { label: 'Offers',      icon: '◆',  left: 36,  top: 20, bob: 2 },
  { label: 'Attribution', icon: '≋',  left: 52,  top:  8, bob: 4 },
  { label: 'Funnel',      icon: '▽',  left: 67,  top: 22, bob: 1 },
  { label: 'Playbook',    icon: '☰',  left: 80,  top: 10, bob: 5 },
  { label: 'Budgets',     icon: '⊕',  left: 86,  top: 38, bob: 2, desktopOnly: true },
  { label: 'KPIs',        icon: '↗',  left: 72,  top: 50, bob: 3, desktopOnly: true },
  { label: 'Channels',    icon: '≡',  left: 55,  top: 55, bob: 5, desktopOnly: true },
  { label: 'Reporting',   icon: '⊞',  left: 36,  top: 52, bob: 4, desktopOnly: true },
  { label: 'Roadmap',     icon: '→',  left: 18,  top: 44, bob: 2, desktopOnly: true },
  { label: 'Team',        icon: '○○', left: 44,  top: 32, bob: 3, desktopOnly: true },
]

const BOB_DURATIONS = ['3s', '3.5s', '4s', '3.8s', '4.2s']
const BOB_DELAYS    = ['0s', '0.6s', '1.2s', '0.3s', '0.9s']

export default function EcosystemCard() {
  return (
    <section
      aria-label="Marketing ecosystem"
      style={{
        backgroundColor: '#07080f',
        padding: '120px 48px',
      }}
    >
      {/* Headline */}
      <h2
        style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 64px',
        }}
      >
        Most marketing departments have all the pieces.
        <br />
        Marchitect makes them work together.
      </h2>

      {/* Floating card */}
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          background: '#12131f',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
          height: '480px',
        }}
        className="ecosystem-card"
      >

        {/* Tile cluster */}
        {TILES.map((tile) => (
          <div
            key={tile.label}
            className={tile.desktopOnly ? 'ecosystem-tile ecosystem-tile--desktop' : 'ecosystem-tile'}
            style={{
              position: 'absolute',
              left: `${tile.left}%`,
              top: `${tile.top}%`,
              // bob animation assigned per variant
              animation: `bob${tile.bob} ${BOB_DURATIONS[tile.bob - 1]} ease-in-out ${BOB_DELAYS[tile.bob - 1]} infinite`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: '#1a1b2e',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {/* Icon */}
            <span
              aria-hidden="true"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(124,92,252,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#a78bfa',
                flexShrink: 0,
              }}
            >
              {tile.icon}
            </span>
            {/* Label */}
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '-0.01em',
              }}
            >
              {tile.label}
            </span>
          </div>
        ))}

        {/* Purple elliptical glow platform */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '220px',
            background: 'radial-gradient(ellipse, rgba(124,92,252,0.3) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Ellipse rim line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '75%',
            height: '60px',
            border: '1px solid rgba(124,92,252,0.25)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

      </div>

      {/* Bob keyframes + responsive */}
      <style>{`
        @keyframes bob1 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes bob2 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes bob3 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes bob4 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes bob5 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-11px); }
        }

        @media (max-width: 767px) {
          .ecosystem-card {
            height: 340px !important;
          }
          .ecosystem-tile--desktop {
            display: none !important;
          }
          .ecosystem-tile {
            padding: 8px 12px !important;
          }
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .ecosystem-card {
            height: 420px !important;
          }
        }
      `}</style>
    </section>
  )
}
