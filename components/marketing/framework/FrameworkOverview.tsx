const pillars = [
  {
    letter: 'A',
    title: 'Positioning & Messaging',
    deliverables: [
      'ICP definition + ideal buyer persona',
      'Messaging matrix + narrative architecture',
      'Value proposition hierarchy',
      'Competitive differentiation map',
    ],
  },
  {
    letter: 'B',
    title: 'Demand Generation',
    deliverables: [
      'Channel strategy + media mix',
      'Content architecture + editorial calendar',
      'Lead magnet + top-of-funnel system',
      'Campaign framework + testing cadence',
    ],
  },
  {
    letter: 'C',
    title: 'Conversion Architecture',
    deliverables: [
      'Funnel audit + conversion rate analysis',
      'Landing page system + A/B testing framework',
      'Email nurture sequences',
      'Retargeting infrastructure',
    ],
  },
  {
    letter: 'D',
    title: 'Revenue Infrastructure',
    deliverables: [
      'CRM audit + pipeline architecture',
      'Marketing-to-sales handoff protocol',
      'Attribution model + revenue tracking',
      'Deal velocity analysis',
    ],
  },
  {
    letter: 'E',
    title: 'Marketing Operations',
    deliverables: [
      'Tech stack audit + recommendations',
      'Data architecture + integration map',
      'Reporting framework + KPI dashboard',
      'Team structure + RACI definition',
    ],
  },
];

export default function FrameworkOverview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-16 text-3xl font-bold text-gray-900 md:text-4xl">
          What Each Pillar Delivers
        </h2>

        <div className="space-y-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.letter}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <div className="flex items-start gap-6">
                {/* Letter badge */}
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-base font-extrabold"
                  style={{
                    backgroundColor: 'rgba(107, 92, 231, 0.12)',
                    color: 'var(--m-accent)',
                  }}
                >
                  {pillar.letter}
                </div>

                <div className="flex-1">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    {pillar.title}
                  </h3>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {pillar.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span
                          className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: 'var(--m-accent)' }}
                          aria-hidden="true"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
