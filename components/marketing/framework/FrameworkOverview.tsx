const buckets = [
  {
    letter: 'A',
    title: 'Department Readiness',
    anchor: 'readiness',
    description:
      'Before marketing can operate effectively, the foundation has to be right. This bucket defines who owns what, who has access to what, and what standards govern how work gets created and handed off.',
    deliverables: [
      'Roles and decision rights (who decides, who executes, who reviews)',
      'Vendor engagement standards (how agencies and contractors are briefed and held accountable)',
      'Access and asset inventory (logins, platforms, creative libraries — organized and owned)',
      'Tracking prerequisites (pixel setup, UTM structure, event naming conventions)',
      'The Marketing Playbook — the single source of truth the team runs from',
    ],
  },
  {
    letter: 'B',
    title: 'Success Definitions',
    anchor: 'success',
    description:
      "Most companies can't measure marketing success because they've never defined what it looks like. This bucket installs the definition layer.",
    deliverables: [
      'Revenue-defined objectives (goals tied to actual business outcomes, not marketing metrics)',
      'Conversion event definitions (what counts as a lead, an MQL, an SQL, a customer)',
      'Funnel stage definitions and KPI ownership',
      'Reporting cadence and accountability structure',
      'Targets with benchmarks (so "good" and "bad" aren\'t opinions)',
    ],
  },
  {
    letter: 'C',
    title: 'Market Strategy Foundation',
    anchor: 'strategy',
    description:
      "Cold traffic doesn't convert because companies haven't done the work to understand their customer deeply enough to speak to them. This bucket forces that work.",
    deliverables: [
      'Customer truth capture (real language from real buyers — interviews, reviews, objection maps)',
      'ICP definition and segmentation',
      'Differentiated positioning (why you, vs. every alternative — including doing nothing)',
      'Compelling offer structure (right ask at the right funnel stage)',
      'Messaging hierarchy mapped to channel and audience awareness level',
    ],
  },
  {
    letter: 'D',
    title: 'Planning & Prioritization',
    anchor: 'roadmap',
    description:
      'Strategy without a capacity-aware plan stays on a whiteboard. This bucket translates goals into an ordered, executable roadmap.',
    deliverables: [
      'Marketing roadmap with prioritized initiatives and sequencing rationale',
      "Capacity assessment (what your team can actually ship vs. what's on the wishlist)",
      'Explicit "not doing" decisions (what\'s being deprioritized and why)',
      'Milestone definitions and review cadence',
      'Budget allocation framework',
    ],
  },
  {
    letter: 'E',
    title: 'Reporting & Execution Control',
    anchor: 'reporting',
    description:
      'The final bucket installs the governance layer that keeps everything running after Marchitect leaves.',
    deliverables: [
      'Attribution framework and dashboard (what\'s tracked, how, and what it means)',
      'Channel strategy and campaign architecture standards',
      'Website/funnel/nurture alignment review',
      'Operating cadence (weekly, monthly, quarterly rhythms for the marketing team)',
      'Improvement cycle process (how the team audits, learns, and iterates)',
    ],
  },
]

export default function FrameworkOverview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">01</p>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          The framework covers the full department
        </h2>
        <p className="mb-16 text-lg leading-relaxed text-gray-600">
          Each bucket addresses a specific layer of the marketing department — from infrastructure and roles to strategy, planning, and execution governance. Together, they form a complete operating system. The order matters: you can&apos;t govern execution well without first defining what success looks like.
        </p>
        <div className="space-y-6">
          {buckets.map((bucket) => (
            <div
              key={bucket.letter}
              id={bucket.anchor}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <div className="flex items-start gap-6">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-base font-extrabold"
                  style={{ backgroundColor: 'rgba(107, 92, 231, 0.12)', color: 'var(--m-accent)' }}
                >
                  {bucket.letter}
                </div>
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">{bucket.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">{bucket.description}</p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {bucket.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
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
  )
}
