import Link from 'next/link'

const tiles = [
  { value: '20+', label: 'Years operating as owners and CMOs' },
  { value: '$2M–$50M', label: 'Typical client revenue range' },
  { value: 'ROI+', label: 'Economic-first decision standard' },
  { value: 'Playbook', label: 'Single source of truth installed in every engagement' },
]

export default function Credentials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Experience
        </p>
        <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">
          Built to repair ROI-negative marketing departments.
        </h2>
        <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {tiles.map((tile) => (
            <div
              key={tile.value}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center"
            >
              <p
                className="mb-2 text-3xl font-extrabold leading-none"
                style={{ color: 'var(--m-accent)' }}
              >
                {tile.value}
              </p>
              <p className="text-xs leading-snug text-gray-500">{tile.label}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            Book a Call <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
