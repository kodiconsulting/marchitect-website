import Link from 'next/link'

const pillars = [
  {
    letter: 'A',
    title: 'Positioning & Messaging',
    description: "Define who you're for, what you stand for, and why it matters",
  },
  {
    letter: 'B',
    title: 'Demand Generation',
    description: 'Build the systems that fill your pipeline with qualified opportunities',
  },
  {
    letter: 'C',
    title: 'Conversion Architecture',
    description: 'Design the paths that turn attention into action',
  },
  {
    letter: 'D',
    title: 'Revenue Infrastructure',
    description: 'Connect marketing to sales in a closed-loop revenue system',
  },
  {
    letter: 'E',
    title: 'Marketing Operations',
    description: 'Install the tools, data, and processes that make it all run',
  },
]

export default function FrameworkTeaser() {
  return (
    <section aria-label="Framework" className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <style>{`
        .m-pillar-tile:hover { background-color: var(--m-bg-card-hover) !important; }
      `}</style>
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-6 text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          04
        </p>
        <h2
          className="mb-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          The Five Pillars of Marketing Architecture
        </h2>
        <p
          className="mb-16 max-w-2xl text-lg leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          Every Marchitect engagement is structured around five foundational
          pillars. Together, they form a complete marketing operating system.
        </p>
        <div className="mb-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.letter}
              className="m-pillar-tile rounded-2xl p-6"
              style={{
                backgroundColor: 'var(--m-bg-card)',
                border: '1px solid var(--m-border)',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: 'rgba(107, 92, 231, 0.15)',
                  color: 'var(--m-accent)',
                }}
              >
                {pillar.letter}
              </div>
              <h3
                className="mb-2 text-base font-semibold leading-snug"
                style={{ color: 'var(--m-text)' }}
              >
                {pillar.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/framework"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            Explore the Framework <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/assessment"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            Take Assessment
          </Link>
        </div>
      </div>
    </section>
  )
}
