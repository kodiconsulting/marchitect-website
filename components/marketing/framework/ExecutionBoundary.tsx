const doItems = [
  'Diagnose your current marketing architecture',
  'Define the systems you need to build',
  'Install the processes, tools, and infrastructure',
  'Enable your team to run it independently',
];

const dontItems = [
  'Run one-off campaigns without a system',
  'Hand you a strategy deck and disappear',
  'Bill for activity instead of outcomes',
  'Own your marketing forever',
];

export default function ExecutionBoundary() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Scope — What&apos;s In and What&apos;s Out
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* What We Do */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">
              What We Do
            </p>
            <ul className="space-y-3">
              {doItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--m-accent)' }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-relaxed text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* What We Don't Do */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-400">
              What We Don&apos;t Do
            </p>
            <ul className="space-y-3">
              {dontItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-gray-400"
                    style={{ backgroundColor: '#f3f4f6' }}
                    aria-hidden="true"
                  >
                    ✕
                  </span>
                  <span className="text-sm leading-relaxed text-gray-500">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
