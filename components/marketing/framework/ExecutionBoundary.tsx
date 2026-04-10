import Link from 'next/link'

export default function ExecutionBoundary() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Framework implementation ≠ agency execution
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              The framework engagement includes:
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              The strategy layer, the playbook, success definitions, roadmap, attribution framework, and operating cadence. This is the operating system — not the campaigns.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Execution can be handled by:
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              Your internal team, your existing vendors, or Marchitect as a separate scope. We provide the standards; you choose who runs against them. If you need help finding or hiring the right executors, we&apos;ll help with that too.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            View Services <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
