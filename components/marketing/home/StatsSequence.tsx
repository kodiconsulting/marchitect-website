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

// --- Timing config ---
const SLIDE_VH   = 1.2;  // scroll budget per non-last stat (in viewport heights)
const LAST_VH    = 1.8;  // scroll budget for the last stat
const APPROACH   = 0.20; // fraction of SLIDE_VH used to zoom in
const HOLD_END   = 0.30; // fraction where hold phase ends, exit begins
// Exit = 0.30 → 1.00 = 70% of budget ≈ 3.5× the approach (20%)

const LAST_APPROACH = 0.40; // fraction of LAST_VH used to zoom in for last stat

export default function StatsSequence() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const blurRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const total      = stats.length;
  const sectionVh  = (total - 1) * SLIDE_VH + LAST_VH;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
    function easeIn(t: number)  { return t * t; }
    function clamp(v: number, min = 0, max = 1) { return Math.min(max, Math.max(min, v)); }

    function update() {
      if (!section) return;
      const scrolledVh = -section.getBoundingClientRect().top / window.innerHeight;

      stats.forEach((_, i) => {
        const slide = slideRefs.current[i];
        const blur  = blurRefs.current[i];
        if (!slide || !blur) return;

        const isLast      = i === total - 1;
        const startVh     = i * SLIDE_VH;
        const rangeVh     = isLast ? LAST_VH : SLIDE_VH;
        const t           = (scrolledVh - startVh) / rangeVh;

        // --- LAST STAT ---
        if (isLast) {
          if (t < 0) {
            slide.style.opacity   = '0';
            slide.style.transform = 'scale(0) translateY(80px)';
            blur.style.filter     = 'blur(0px)';
          } else if (t <= LAST_APPROACH) {
            const p = easeOut(t / LAST_APPROACH);
            slide.style.opacity   = String(p.toFixed(3));
            slide.style.transform = `scale(${p.toFixed(4)}) translateY(${((1 - p) * 80).toFixed(1)}px)`;
            blur.style.filter     = 'blur(0px)';
          } else {
            // Hold — sticky releases and page scrolls on naturally
            slide.style.opacity   = '1';
            slide.style.transform = 'scale(1) translateY(0px)';
            blur.style.filter     = 'blur(0px)';
          }
          return;
        }

        // --- NON-LAST STATS ---
        if (t < 0) {
          // Not yet in view
          slide.style.opacity   = '0';
          slide.style.transform = 'scale(0) translateY(80px)';
          blur.style.filter     = 'blur(0px)';
        } else if (t <= APPROACH) {
          // Zoom in from zero, rise from below
          const p = easeOut(t / APPROACH);
          slide.style.opacity   = String(p.toFixed(3));
          slide.style.transform = `scale(${p.toFixed(4)}) translateY(${((1 - p) * 80).toFixed(1)}px)`;
          blur.style.filter     = 'blur(0px)';
        } else if (t <= HOLD_END) {
          // Hold at full size
          slide.style.opacity   = '1';
          slide.style.transform = 'scale(1) translateY(0px)';
          blur.style.filter     = 'blur(0px)';
        } else if (t <= 1) {
          // Slow exit — blur + scale past 1 + fade
          const p = easeIn((t - HOLD_END) / (1 - HOLD_END));
          slide.style.opacity   = String((1 - p).toFixed(3));
          slide.style.transform = `scale(${(1 + 0.08 * p).toFixed(4)}) translateY(0px)`;
          blur.style.filter     = `blur(${(p * 10).toFixed(1)}px)`;
        } else {
          // Fully exited
          slide.style.opacity   = '0';
          slide.style.transform = 'scale(1.08) translateY(0px)';
          blur.style.filter     = 'blur(10px)';
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
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        overflow: 'hidden',
      }}>
        {stats.map((stat, i) => (
          // Outer div: handles opacity + transform only (no filter — avoids breaking gradient text)
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
              willChange: 'opacity, transform',
            }}
          >
            {/* Inner div: handles blur only — kept separate so background-clip: text works */}
            <div
              ref={(el) => { blurRefs.current[i] = el; }}
              style={{ willChange: 'filter' }}
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
                fontSize: 'clamp(40px, 9vw, 96px)',
                fontWeight: 900,
                lineHeight: 1,
                marginBottom: '24px',
                whiteSpace: 'nowrap',
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
          </div>
        ))}
      </div>
    </div>
  );
}
