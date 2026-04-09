import Link from 'next/link'

const kpis = [
  {
    number: '3.2×',
    label: 'Average Revenue Lift',
    description: 'Across clients in the first 90 days of full-system engagement',
  },
  {
    number: '87%',
    label: 'Attribution Clarity',
    description: 'Of clients can trace every marketing dollar to a revenue outcome after Marchitect',
  },
  {
    number: '14 days',
    label: 'Time to First Insight',
    description: "From assessment to a clear picture of what's working and what isn't",
  },
]

export default function KpiCards() {
  return (
    <section aria-label="Results" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-12 text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          03
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
            See all results →
          </Link>
        </div>
      </div>
    </section>
  )
}
