'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ─── Tab data ───────────────────────────────────────────────── */

const TABS = [
  {
    id: 'os',
    label: 'The Operating System',
    eyebrow: 'Core Methodology',
    heading: 'The complete system for how your marketing department thinks and operates',
    body: 'The complete methodology for what needs to be defined, how to make decisions, and how your marketing department is structured and governed. Five pillars, in sequence — because order matters.',
    checks: [
      '5-pillar decision-making framework',
      'Marketing Playbook — your single source of truth',
      'Built to run without us when we leave',
    ],
    cta: { label: 'See the Framework', href: '/framework' },
    mockup: 'os',
  },
  {
    id: 'workshops',
    label: 'The Workshops',
    eyebrow: 'AI-Assisted Sessions',
    heading: 'Structured sessions that define every component of your Operating System',
    body: 'Each workshop is facilitated by a Marchitect FCMO and powered by an AI-assisted process. Every session has a defined structure and produces a concrete deliverable — no open-ended brainstorming, no wasted time.',
    checks: [
      'Facilitated by a Marchitect FCMO',
      'AI-assisted process and documentation',
      'Every session produces a concrete deliverable',
    ],
    cta: { label: 'Book a Call', href: '/contact' },
    mockup: 'workshops',
  },
  {
    id: 'portal',
    label: 'The Portal',
    eyebrow: 'Your Marketing Hub',
    heading: 'One place to store your definitions, track your health, and see your performance',
    body: 'The Portal is where your entire Operating System lives. Your team accesses definitions, tracks progress across the 5 pillars of the framework, and monitors performance metrics — all in one place.',
    checks: [
      'Definitions and playbook hub',
      'Marketing health tracker across all 5 pillars',
      'Performance metrics dashboard',
    ],
    cta: { label: 'Identify Your Marketing Gaps Now', href: '/assessment' },
    mockup: 'portal',
  },
]

/* ─── Right-side mockups (placeholders until real screenshots) ─ */

function OsMockup() {
  const PILLARS = ['ICP & Offer', 'Channel Strategy', 'Budget & Timeline', 'Team & Roles', 'Reporting']
  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '8px' }}>
        Marketing Operating System
      </div>
      {PILLARS.map((pillar, i) => (
        <div key={pillar} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '10px',
          background: i === 0 ? 'rgba(71,99,214,0.12)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${i === 0 ? 'rgba(71,99,214,0.3)' : 'rgba(255,255,255,0.06)'}`,
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: i === 0 ? 'rgba(71,99,214,0.2)' : 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: i === 0 ? '#7B94E8' : '#4b5563',
          }}>
            {String(i + 1).padStart(2, '0')}
          </div>
          <span style={{ fontSize: '14px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#ffffff' : '#6b7280' }}>
            {pillar}
          </span>
          {i === 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#7B94E8', fontWeight: 500 }}>Active</span>
          )}
        </div>
      ))}
    </div>
  )
}

function WorkshopsMockup() {
  const SESSIONS = ['ICP Definition Workshop', 'Offer Architecture', 'Channel Mapping', 'Budget Allocation']
  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '4px' }}>
        Workshop Sessions
      </div>
      {SESSIONS.map((session, i) => (
        <div key={session} style={{
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{session}</span>
            <span style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '999px', fontWeight: 500,
              background: i === 0 ? 'rgba(71,99,214,0.15)' : i === 1 ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
              color: i === 0 ? '#7B94E8' : i === 1 ? '#4ade80' : '#4b5563',
              border: `1px solid ${i === 0 ? 'rgba(71,99,214,0.3)' : i === 1 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              {i === 0 ? 'In Progress' : i === 1 ? 'Complete' : 'Upcoming'}
            </span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              background: 'linear-gradient(90deg, #4763D6, #7B94E8)',
              width: i === 0 ? '60%' : i === 1 ? '100%' : '0%',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function PortalMockup() {
  return (
    <div style={{ display: 'flex', height: '360px' }}>
      {/* Sidebar */}
      <div style={{
        width: '160px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: '6px',
      }}>
        {['Dashboard', 'Playbook', 'Strategy', 'Budget', 'Performance'].map((label, i) => (
          <div key={label} style={{
            padding: '7px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: i === 0 ? 600 : 400,
            background: i === 0 ? 'rgba(71,99,214,0.15)' : 'transparent',
            color: i === 0 ? '#7B94E8' : 'rgba(255,255,255,0.25)',
          }}>{label}</div>
        ))}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[['Health', '84%'], ['Tasks', '12'], ['Score', 'A-']].map(([lbl, val]) => (
            <div key={lbl} style={{
              flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '9px', padding: '12px',
            }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>{lbl}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#7B94E8' }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{
          flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '9px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          <div style={{ height: '7px', width: '100px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px' }} />
          {['ICP & Offer', 'Channel Strategy', 'Budget'].map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', width: '90px', flexShrink: 0 }}>{item}</span>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  background: 'linear-gradient(90deg, #4763D6, #7B94E8)',
                  width: `${[88, 65, 42][i]}%`,
                }} />
              </div>
              <span style={{ fontSize: '11px', color: '#7B94E8', width: '28px', textAlign: 'right' }}>{[88, 65, 42][i]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MOCKUPS: Record<string, React.ReactNode> = {
  os: <OsMockup />,
  workshops: <WorkshopsMockup />,
  portal: <PortalMockup />,
}

/* ─── Component ──────────────────────────────────────────────── */

export default function SystemOverview() {
  const [activeId, setActiveId] = useState('os')
  const [fading, setFading] = useState(false)
  const [displayId, setDisplayId] = useState('os')

  const switchTab = (id: string) => {
    if (id === activeId) return
    setFading(true)
    setTimeout(() => {
      setDisplayId(id)
      setActiveId(id)
      setFading(false)
    }, 180)
  }

  const tab = TABS.find((t) => t.id === displayId)!

  return (
    <section
      aria-label="An end-to-end system for your marketing department"
      style={{
        backgroundColor: '#0d0e1a',
        padding: '120px 48px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section headline */}
        <h2
          style={{
            fontSize: '48px',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto 48px',
          }}
        >
          An end-to-end system for your marketing department
        </h2>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '64px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              gap: '4px',
              padding: '4px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}
          >
            {TABS.map((t) => {
              const isActive = t.id === activeId
              return (
                <button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg, #4763D6 0%, #7B94E8 100%)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#9ca3af',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Split panel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '64px',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.18s ease',
          }}
          className="system-panel"
        >
          {/* Left — tab content */}
          <div style={{ flex: '0 0 50%', maxWidth: '50%' }} className="system-left">
            <div style={{ marginBottom: '24px' }}>
              <span className="eyebrow-pill">{tab.eyebrow}</span>
            </div>

            <h3
              style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                marginBottom: '20px',
              }}
            >
              {tab.heading}
            </h3>

            <p
              style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: '#9ca3af',
                marginBottom: '32px',
              }}
            >
              {tab.body}
            </p>

            {/* Checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              {tab.checks.map((item) => (
                <div key={item} className="check-item">
                  <span className="check-icon" aria-hidden="true">✓</span>
                  {item}
                </div>
              ))}
            </div>

            <Link href={tab.cta.href} className="btn-primary">
              {tab.cta.label} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Right — floating card */}
          <div
            style={{ flex: '0 0 50%', maxWidth: '50%', position: 'relative' }}
            className="system-right"
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-30%, -50%)',
                width: '600px',
                height: '400px',
                background: 'radial-gradient(ellipse at center, rgba(71,99,214,0.25) 0%, transparent 65%)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Card */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                background: '#12131f',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
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
                  <span key={i} style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)', display: 'block',
                  }} />
                ))}
                <div style={{
                  flex: 1, marginLeft: '8px', height: '8px', borderRadius: '4px',
                  background: 'rgba(255,255,255,0.06)', maxWidth: '160px',
                }} />
              </div>

              {/* Mockup content — swap for <Image> when screenshots are ready */}
              {MOCKUPS[displayId]}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 767px) {
          .system-panel {
            flex-direction: column !important;
            gap: 40px !important;
          }
          .system-left, .system-right {
            flex: unset !important;
            max-width: 100% !important;
            width: 100%;
          }
          .system-right {
            display: none !important;
          }
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .system-panel {
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}
