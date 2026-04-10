type Principle = { number: number; text: string; bold: string | null }

const principles: Principle[] = [
  { number: 1, text: 'Marketing should be governed, not improvised.', bold: 'governed' },
  { number: 2, text: 'Strategy cannot be outsourced to whoever is executing.', bold: null },
  { number: 3, text: 'The best teams run on definitions, not opinions.', bold: 'definitions' },
  { number: 4, text: "If measurement isn't trusted, scaling is gambling.", bold: null },
  {
    number: 5,
    text: 'The right clients commit to foundational change — not just better tactics.',
    bold: null,
  },
]

export default function Principles() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          What we believe
        </p>
        <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">Our principles</h2>
        <ol className="space-y-6 text-left">
          {principles.map((p) => (
            <li key={p.number} className="flex items-baseline gap-4">
              <span
                className="flex-shrink-0 text-2xl font-extrabold tabular-nums leading-none"
                style={{ color: 'var(--m-accent)' }}
              >
                {p.number}.
              </span>
              <span className="text-lg leading-relaxed text-gray-700">
                {p.bold ? (
                  <>
                    {p.text.split(p.bold).slice(0, 2).map((part, i, arr) => (
                      <span key={`chunk-${i}`}>
                        {part}
                        {i < arr.length - 1 && (
                          <strong className="font-semibold text-gray-900">{p.bold}</strong>
                        )}
                      </span>
                    ))}
                  </>
                ) : (
                  p.text
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
