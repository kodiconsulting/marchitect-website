'use client';
import { useEffect, useRef } from 'react';

const stats = [
  {
    label: 'CPL',
    number: '$550 → $70',
    description: 'Reduced cost per lead by repairing the offer and funnel so cold traffic finally had a reason to convert.',
  },
  {
    label: 'CVR',
    number: '0.4% → 7.4%',
    description: 'Increased conversion rate by aligning the message to the real buying hesitation and rebuilding the CTA structure.',
  },
  {
    label: 'Revenue',
    number: '$40K → $1M/mo',
    description: 'Grew monthly revenue from $40,000 to over $1 million in 18 months by installing a complete marketing system.',
  },
];

// Scroll budget per stat (in viewport heights)
const SLIDE_VH = 3.5;       // non-last slides: 3.5vh of scroll each
const LAST_VH = 1.0;        // last slide: 1vh (approach + hold, then sticky releases)

// Phase boundaries as fraction of each slide's scroll budget
const APPROACH_END = 0.18;  // 0.00 → 0.18: scale 0→1, rise up, fade in
const HOLD_END = 0.25;      // 0.18 → 0.25: hold stable at center
                             // 0.25 → 1.00: exit (75% of budget ≈ 3× the approach)

export default function StatsSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const total = stats.length;

  // Total section height in vh
  const sectionVh = (total - 1) * SLIDE_VH + LAST_VH;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInQuad(t: number): number {
      return t * t;
    }

    function update() {
      if (!section) return;
      const scrolledPx = -section.getBoundingClientRect().top;
      const scrolledVh = scrolledPx / window.innerHeight;

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;

        const isLast = i === total - 1;
        const slideStartVh = i * SLIDE_VH;
        const slideRangeVh = isLast ? LAST_VH : SLIDE_VH;

        // Local progress through this slide's scroll budget (0 → 1)
        const t = (scrolledVh - slideStartVh) / slideRangeVh;

        if (isLast) {
          // Last stat: zoom in, hold. No exit — sticky releases naturally.
          if (t < 0) {
            slide.style.opacity = '0';
            slide.style.transform = 'scale(0) translateY(80px)';
            slide.style.filter = 'blur(0px)';
          } else if (t <= APPROACH_END * (SLIDE_VH / LAST_VH)) {
            // Scale approach to the shorter LAST_VH window
            const p = easeOutCubic(Math.min(t / (APPROACH_END * (SLIDE_VH / LAST_VH)), 1));
            slide.style.opacity = p.toFixed(3);
            slide.style.transform = `scale(${p.toFixed(4)}) translateY(${((1 - p) * 80).toFixed(1)}px)`;
            slide.style.filter = 'blur(0px)';
          } else {
            // Hold — sticky releases and page scrolls normally after this point
            slide.style.opacity = '1';
            slide.style.transform = 'scale(1) translateY(0px)';
            slide.style.filter = 'blur(0px)';
          }
          return;
        }

        // Non-last stats
        if (t < 0) {
          // Not yet visible — waiting below
          slide.style.opacity = '0';
          slide.style.transform = 'scale(0) translateY(80px)';
          slide.style.filter = 'blur(0px)';
        } else if (t <= APPROACH_END) {
          // Approach: scale from 0, rise from below
          const p = easeOutCubic(t / APPROACH_END);
          slide.style.opacity = p.toFixed(3);
          slide.style.transform = `scale(${p.toFixed(4)}) translateY(${((1 - p) * 80).toFixed(1)}px)`;
          slide.style.filter = 'blur(0px)';
        } else if (t <= HOLD_END) {
          // Hold: stable
          slide.style.opacity = '1';
          slide.style.transform = 'scale(1) translateY(0px)';
          slide.style.filter = 'blur(0px)';
        } else if (t <= 1) {
          // Exit: slow blur + scale past 1 + fade (75% of scroll budget)
          const p = easeInQuad((t - HOLD_END) / (1 - HOLD_END));
          slide.style.opacity = (1 - p).toFixed(3);
          slide.style.transform = `scale(${(1 + 0.08 * p).toFixed(4)}) translateY(0px)`;
          slide.style.filter = `blur(${(p * 10).toFixed(1)}px)`;
        } else {
          // Fully exited
          slide.style.opacity = '0';
          slide.style.transform = 'scale(1.08) translateY(0px)';
          slide.style.filter = 'blur(10px)';
        }
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{ height: `${sectionVh * 100}vh`, position: 'relative' }}
    >
      {/* Sticky viewport — pinned while stats animate, releases after last stat holds */}
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
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => { slideRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              textAlign: 'center',
              maxWidth: '800px',
              padding: '0 24px',
              opacity: 0,
              transform: 'scale(0) translateY(80px)',
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
              fontSize: 'clamp(52px, 9vw, 96px)',
              fontWeight: 900,
              lineHeight: 1,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #4763D6 0%, #C8D4FA 100%)',
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
  );
}
