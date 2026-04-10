import Link from 'next/link';

const pillTags = [
  'Positioning',
  'Demand Generation',
  'Conversion',
  'Revenue Infrastructure',
  'Marketing Operations',
];

export default function FrameworkHero() {
  return (
    <section className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      {/* Purple radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--m-accent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-5">
          {/* Left — 60% */}
          <div className="lg:col-span-3">
            <p
              className="mb-4 text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--m-accent)' }}
            >
              The Marchitect Framework
            </p>
            <h1
              className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
              style={{ color: 'var(--m-text)' }}
            >
              The Five Pillars of Marketing Architecture
            </h1>
          </div>

          {/* Right — 40% */}
          <div className="lg:col-span-2">
            <p
              className="mb-8 text-lg leading-relaxed"
              style={{ color: 'var(--m-text-secondary)' }}
            >
              Most marketing fails not because of effort or budget — but because
              the underlying architecture is broken. Marchitect diagnoses the
              breaks and installs the systems that make marketing work.
            </p>

            {/* Pill tags */}
            <div className="mb-8 flex flex-wrap gap-2">
              {pillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(107, 92, 231, 0.12)',
                    color: 'var(--m-accent)',
                    border: '1px solid rgba(107, 92, 231, 0.25)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--m-accent)' }}
              >
                Take Assessment <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{
                  borderColor: 'var(--m-border)',
                  color: 'var(--m-text-secondary)',
                }}
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
