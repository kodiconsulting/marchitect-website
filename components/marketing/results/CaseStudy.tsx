interface Stat {
  value: string
  label: string
}

interface CaseStudyProps {
  eyebrow: string
  company: string
  category: string
  heading: string
  context: string
  problem: string
  solution: string
  outcome: string
  stats: Stat[]
  background?: 'white' | 'gray'
}

export default function CaseStudy({
  eyebrow,
  company,
  category,
  heading,
  context,
  problem,
  solution,
  outcome,
  stats,
  background = 'white',
}: CaseStudyProps) {
  const bgClass = background === 'gray' ? 'bg-gray-50' : 'bg-white'
  const statCardBgClass = background === 'gray' ? 'bg-white' : 'bg-gray-50'

  return (
    <section aria-label={eyebrow} className={`${bgClass} py-24`}>
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {eyebrow}
        </p>
        <p className="mb-3 text-sm text-gray-500">{company} — {category}</p>
        <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
          {heading}
        </h2>
        <p className="mb-10 text-base italic leading-relaxed text-gray-500">
          {context}
        </p>
        <div className="mb-10 space-y-8">
          {[
            { label: 'The Problem', text: problem },
            { label: 'What Marchitect Did', text: solution },
            { label: 'Outcome', text: outcome },
          ].map(({ label, text }) => (
            <div key={label}>
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--m-accent)' }}
              >
                {label}
              </p>
              <p className="text-base leading-relaxed text-gray-700">{text}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-gray-100 ${statCardBgClass} p-5 text-center shadow-sm`}
            >
              <p
                className="mb-1 text-2xl font-extrabold leading-none"
                style={{ color: 'var(--m-accent)' }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
