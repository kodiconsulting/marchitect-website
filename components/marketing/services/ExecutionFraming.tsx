export default function ExecutionFraming() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">01</p>
        <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">
          Two ways to implement your roadmap
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Option 1 — Use your own team or vendors:
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              We provide the system, the standards, and the decision support. Your internal team or existing agencies execute against the framework Marchitect built. This is the default path.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Option 2 — Use Marchitect execution:
            </p>
            <p className="text-base leading-relaxed text-gray-700">
              We scope and implement specific parts of the roadmap as a separate engagement. Each execution service is quoted individually based on scope, not bundled into the framework.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
