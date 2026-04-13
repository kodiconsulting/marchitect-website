import Link from 'next/link'

const stats = [
  {
    value: '0.4% → 7.4%',
    label: 'CVR',
    description:
      'Rebuilt the messaging and CTA architecture after identifying that the offer was misaligned with where prospects were in the decision process.',
  },
  {
    value: '$550 → $70',
    label: 'CPL',
    description:
      'Fixed the offer and landing page experience so cold traffic had a reason to convert for the first time.',
  },
  {
    value: '$40K → $1M/mo',
    label: 'Revenue',
    description:
      '18-month system installation that rebuilt strategy, offer, funnel, and measurement from the ground up.',
  },
]

export default function ProofPanel() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--m-text-muted)' }}>02</p>
        <h2 className="mb-4 text-center text-4xl font-bold md:text-5xl" style={{ color: 'var(--m-text)' }}>
          Real outcomes after fixing fundamentals
        </h2>
        <p className="mb-16 text-center text-lg leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
          These results came from repairing the front end — offer, positioning, funnel logic — and installing the measurement layer so every decision had data behind it.
        </p>
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--m-bg-card)', border: '1px solid var(--m-border)' }}>
              <p className="mb-1 text-4xl font-extrabold leading-none tracking-tight" style={{ color: 'var(--m-accent)' }}>
                {stat.value}
              </p>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--m-text-muted)' }}>
                {stat.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            See Where Your Marketing Gaps Are <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
