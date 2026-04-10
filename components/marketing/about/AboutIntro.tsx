export default function AboutIntro() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Our Why
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              We teach companies to make correct marketing decisions.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-gray-600">
            <p>
              Marchitect is a marketing strategy and systems firm founded by{' '}
              <strong className="font-semibold text-gray-900">Michael Nowotarski</strong> — an
              operator-turned-CMO with direct experience building and scaling companies.
            </p>
            <p>
              We&apos;re trusted when a company&apos;s marketing has plenty of activity but
              leadership can&apos;t answer the basic questions:{' '}
              <em>
                What should we fix first? What will work with cold traffic? What&apos;s actually
                driving revenue?
              </em>
            </p>
            <p>
              Marchitect is not an execution-first agency. We operate at the strategy, systems, and
              decision-making layer — installing the frameworks, operating cadence, and measurement
              infrastructure that make marketing operable, governable, and economically sound.
            </p>
            <p>
              The core product is correct decision-making. The framework, playbook, and dashboard
              are the deliverables. But what clients are really buying is a clear picture of what
              marketing can do for their business — and exactly what it takes to get there.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
