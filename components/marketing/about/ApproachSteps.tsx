const steps = [
  {
    number: '01',
    title: 'Diagnose',
    description:
      "Identify what's breaking ROI: unclear objectives, undefined funnel events, weak positioning or offer structure, missing roles and ownership, messy access and tracking, or reporting nobody trusts. The diagnostic is the starting point for every engagement.",
  },
  {
    number: '02',
    title: 'Install',
    description:
      'Build the Marketing Playbook, success definitions, roadmap, channel architecture, and governance layer — so priorities become obvious, execution becomes repeatable, and leadership has a dashboard they can trust.',
  },
  {
    number: '03',
    title: 'Enable',
    description:
      'Execution is handled by your internal team, your vendors, or Marchitect as a separate scope. Either way, we ensure the work follows the system and performance is measured consistently against the same standards.',
  },
]

export default function ApproachSteps() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-4 text-center text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          Our Approach
        </p>
        <h2
          className="mb-6 text-center text-4xl font-bold md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          Clarity first. Then controlled execution.
        </h2>
        <p
          className="mx-auto mb-16 max-w-2xl text-center text-lg leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          We remove guesswork by installing the decision framework and operating system first — then
          ensure execution follows a single standard with clean handoffs, trusted reporting, and an
          improvement cycle that actually sticks.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl p-8"
              style={{
                backgroundColor: 'var(--m-bg-card)',
                border: '1px solid var(--m-border)',
              }}
            >
              <p
                className="mb-4 text-5xl font-extrabold leading-none"
                style={{ color: 'var(--m-accent)' }}
              >
                {step.number}
              </p>
              <h3
                className="mb-4 text-xl font-bold"
                style={{ color: 'var(--m-text)' }}
              >
                {step.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
