const testimonials = [
  {
    quote:
      'Marchitect gave us the clarity we needed to stop wasting budget and start attributing revenue properly. It changed how we run marketing.',
    name: 'Sarah K.',
    title: 'VP Marketing, E-commerce Brand',
  },
  {
    quote:
      "The diagnostic alone was worth it. We found three major gaps in our funnel we didn't know existed.",
    name: 'James T.',
    title: 'CEO, SaaS Company',
  },
  {
    quote:
      "Mike doesn't just consult — he installs systems that keep working after he's gone.",
    name: 'Rachel M.',
    title: 'Founder, Health Brand',
  },
]

export default function Testimonials() {
  return (
    <section aria-label="Testimonials" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          What Clients Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-8"
            >
              <div
                className="mb-4 text-4xl font-extrabold leading-none"
                style={{ color: 'var(--m-accent)' }}
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <p className="mb-6 flex-1 text-base leading-relaxed text-gray-700">
                {t.quote}
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
