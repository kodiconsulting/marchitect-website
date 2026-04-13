import Link from 'next/link'

const pillTags = ['Playbook', 'Reporting', 'Offer Strategy', 'ICP Definition', 'Roadmap', 'Attribution']

export default function FrameworkHero() {
  return (
    <section className="relative overflow-hidden py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 opacity-20"
        style={{ background: 'radial-gradient(ellipse at center, var(--m-accent) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--m-accent)' }}>
              The Framework
            </p>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl" style={{ color: 'var(--m-text)' }}>
              A decision-making framework for companies that are done guessing
            </h1>
          </div>
          <div className="lg:col-span-2">
            <p className="mb-4 text-lg leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
              Most companies delegate strategy to whoever is executing. The result is that foundational questions — who the customer is, what makes cold traffic convert, what budget allocation actually makes sense — never get answered.
            </p>
            <p className="mb-8 text-lg leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
              The Marchitect Marketing Operating Framework installs the decision layer. It&apos;s a codified, repeatable methodology delivered through templates, checklists, workflows, and operating cadences — built to run in-house after we leave.
            </p>
            <div className="mb-8 flex flex-wrap gap-2">
              {pillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(107, 92, 231, 0.12)',
                    color: 'var(--m-accent)',
                    border: '1px solid rgba(107, 92, 231, 0.25)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--m-accent)' }}
              >
                See Where Your Marketing Gaps Are <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ borderColor: 'var(--m-border)', color: 'var(--m-text-secondary)' }}
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
