import Link from 'next/link'

const kpis = [
  {
    number: '$550 → $70',
    label: 'CPL',
    description: 'Fixed the offer and landing page experience so cold traffic had a reason to convert for the first time.',
  },
  {
    number: '0.4% → 7.4%',
    label: 'CVR',
    description: 'Rebuilt the messaging and CTA architecture after identifying the offer was misaligned with where prospects were in the decision process.',
  },
  {
    number: '$40K → $1M/mo',
    label: 'Revenue',
    description: '18-month system installation that rebuilt strategy, offer, funnel, and measurement from the ground up.',
  },
]

export default function KpiCards() {
  return (
    <section aria-label="Results" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-6 text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          03
        </p>
        <h2
          className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl"
        >
          Proof that fundamentals beat tactics
        </h2>
        <p className="mb-12 text-base leading-relaxed text-gray-500">
          These results came from repairing the front end — offer, positioning, funnel logic — and installing the measurement layer so every decision had real data behind it.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <p
                className="mb-2 font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--m-accent)', fontSize: 'clamp(56px, 8vw, 80px)' }}
              >
                {kpi.number}
              </p>
              <p className="mb-3 text-lg font-semibold text-gray-900">{kpi.label}</p>
              <p className="text-sm leading-relaxed text-gray-500">{kpi.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/results"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--m-accent)' }}
          >
            See All Results →
          </Link>
        </div>
      </div>
    </section>
  )
}
