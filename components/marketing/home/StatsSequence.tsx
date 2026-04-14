'use client'

import { useEffect, useRef } from 'react'

const STATS = [
  {
    label: 'CPL',
    number: '$550 → $70',
    description:
      'Reduced cost per lead by repairing the offer and funnel so cold traffic finally had a reason to convert.',
  },
  {
    label: 'CVR',
    number: '0.4% → 7.4%',
    description:
      'Increased conversion rate by aligning the message to the real buying hesitation and rebuilding the CTA structure.',
  },
  {
    label: 'Revenue',
    number: '$40K → $1M/mo',
    description:
      'Grew monthly revenue from $40,000 to over $1 million in 18 months by installing a complete marketing system.',
  },
]

export default function StatsSequence() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    function update() {
      const rect = section!.getBoundingClientRect()
      const scrolled = -rect.top
      const total = section!.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / total))
      const slideProgress = progress * STATS.length

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return
        const t = slideProgress - i // -∞ to +∞; current slide is 0→1

        if (t < 0 || t > 1) {
          slide.style.opacity = '0'
          slide.style.transform = 'scale(0.85)'
          slide.style.filter = 'blur(0px)'
          return
        }

        if (t < 0.7) {
          // entering
          const p = t / 0.7
          slide.style.opacity = p.toFixed(3)
          slide.style.transform = `scale(${(0.85 + 0.15 * p).toFixed(4)})`
          slide.style.filter = 'blur(0px)'
        } else {
          // exiting
          const p = (t - 0.7) / 0.3
          slide.style.opacity = (1 - p).toFixed(3)
          slide.style.transform = `scale(${(1.0 + 0.1 * p).toFixed(4)})`
          slide.style.filter = `blur(${(p * 8).toFixed(1)}px)`
        }
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      ref={sectionRef}
      style={{ height: `${STATS.length * 100}vh`, position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#07080f',
          overflow: 'hidden',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i] = el }}
            style={{
              position: 'absolute',
              textAlign: 'center',
              maxWidth: '800px',
              padding: '0 24px',
              opacity: 0,
              transform: 'scale(0.85)',
              filter: 'blur(0px)',
              willChange: 'opacity, transform, filter',
            }}
          >
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4b5563',
              marginBottom: '16px',
            }}>
              {stat.label}
            </p>
            <h2 style={{
              fontSize: 'clamp(52px, 8vw, 96px)',
              fontWeight: 900,
              lineHeight: 1,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #2952F5 0%, #bfdbfe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {stat.number}
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#9ca3af',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto',
            }}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
