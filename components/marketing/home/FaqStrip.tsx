'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'Is Marchitect an agency?',
    a: 'No. The core engagement is strategy and systems — decision framework, playbook, success definitions, roadmap, and measurement infrastructure. Execution is handled by your existing team, your vendors, or Marchitect as a separate scope.',
  },
  {
    q: 'Who is this best for?',
    a: 'Founders and CEOs at $2M–$50M SMBs — typically in high-ticket ecommerce or service businesses — who have active marketing spend but no system governing it. The right client has tried the ad-hoc approach and is ready to build something that actually works.',
  },
  {
    q: 'Who is it NOT for?',
    a: "Companies looking for someone to run campaigns without a strategic foundation. If you want fast results without building the system first, Marchitect isn't the right fit.",
  },
  {
    q: 'Do you execute, or just advise?',
    a: 'The core engagement installs the operating system — strategy, playbook, success definitions, roadmap, attribution, and operating cadence. Execution can be handled by your internal team, your existing vendors, or Marchitect as a separate scope.',
  },
  {
    q: 'How do we get started?',
    a: 'Take the assessment. It surfaces where your marketing gaps are in about 5 minutes and gives us a grounded starting point for the diagnostic.',
  },
]

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #7c5cfc 0%, #a78bfa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'transform 0.2s ease',
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        style={{
          transition: 'transform 0.25s ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {/* Plus sign — rotates to × when open */}
        <line x1="6" y1="1" x2="6" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="1" y1="6" x2="11" y2="6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof FAQS)[number]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        background: '#12131f',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        ...(isOpen && { borderColor: 'rgba(124,92,252,0.25)' }),
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '24px 28px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#ffffff',
            lineHeight: 1.4,
          }}
        >
          {faq.q}
        </span>
        <ToggleIcon open={isOpen} />
      </button>

      {/* Smooth height animation via CSS grid trick */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#9ca3af',
              padding: '0 28px 24px',
            }}
          >
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqStrip() {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number>(0)

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? -1 : i))

  return (
    <section
      aria-label="Frequently asked questions"
      style={{
        backgroundColor: '#0d0e1a',
        padding: '120px 48px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Headline */}
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '64px',
          }}
        >
          The questions founders ask before they engage
        </h2>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
