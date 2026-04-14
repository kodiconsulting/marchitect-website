'use client'

import { useEffect, useRef } from 'react'
import { CountUp } from 'countup.js'

const STATS = [
  {
    label: 'Cost Per Lead',
    from: '$550',
    toValue: 70,
    toPrefix: '$',
    toSuffix: '',
    toDecimals: 0,
    description: 'Fixed the offer and landing page so cold traffic had a reason to convert.',
    delay: 'delay-1',
  },
  {
    label: 'Conversion Rate',
    from: '0.4%',
    toValue: 7.4,
    toPrefix: '',
    toSuffix: '%',
    toDecimals: 1,
    description: 'Rebuilt messaging and CTA architecture after identifying offer-to-funnel misalignment.',
    delay: 'delay-2',
  },
  {
    label: 'Monthly Revenue',
    from: '$40K',
    toValue: 1,
    toPrefix: '$',
    toSuffix: 'M/mo',
    toDecimals: 0,
    description: '18-month system installation rebuilding strategy, offer, funnel, and measurement.',
    delay: 'delay-3',
  },
]

export default function StatsBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const countUpRefs = useRef<(HTMLSpanElement | null)[]>([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true

            // Trigger fade-up on each stat column
            section.querySelectorAll<HTMLElement>('.stat-col').forEach((el) => {
              el.classList.add('animate-fade-up')
            })

            // Start CountUp on each number span
            countUpRefs.current.forEach((el, i) => {
              if (!el) return
              const stat = STATS[i]
              const cu = new CountUp(el, stat.toValue, {
                duration: 2.5,
                useEasing: true,
                decimalPlaces: stat.toDecimals,
                prefix: stat.toPrefix,
                suffix: stat.toSuffix,
              })
              // Stagger start by 150ms per column
              setTimeout(() => cu.start(), i * 150)
            })

            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Client results"
      style={{
        backgroundColor: '#000000',
        padding: '120px 48px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'stretch',
        }}
        className="stats-row"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`stat-col ${stat.delay}`}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0 40px',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            {/* Label */}
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#4b5563',
                marginBottom: '20px',
              }}
            >
              {stat.label}
            </p>

            {/* Number — gradient text: "from → to" where 'to' is CountUp target */}
            <div
              className="gradient-text"
              style={{
                fontSize: 'clamp(40px, 6vw, 96px)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '20px',
                letterSpacing: '-0.03em',
              }}
            >
              {stat.from}
              {' → '}
              <span
                ref={(el) => { countUpRefs.current[i] = el }}
                aria-live="polite"
              >
                {stat.toPrefix}0{stat.toSuffix}
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#9ca3af',
                maxWidth: '280px',
                margin: '0 auto',
              }}
            >
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Responsive */}
      <style>{`
        .stat-col {
          /* start invisible — JS adds animate-fade-up on scroll */
          opacity: 0;
        }
        @media (max-width: 767px) {
          .stats-row {
            flex-direction: column !important;
            gap: 0;
          }
          .stat-col {
            padding: 48px 24px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .stat-col:last-child {
            border-bottom: none;
          }
        }
        @media (max-width: 767px) {
          .stats-row .stat-col {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </section>
  )
}
