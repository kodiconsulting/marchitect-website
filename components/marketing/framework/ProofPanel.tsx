import Link from 'next/link';

const stats = [
  { value: '3.2×', label: 'Average revenue lift' },
  { value: '87%', label: 'Attribution clarity rate' },
  { value: '14 days', label: 'Time to first insight' },
];

export default function ProofPanel() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-7xl px-6">
        <p
          className="mb-4 text-center text-sm font-medium uppercase tracking-widest"
          style={{ color: 'var(--m-text-muted)' }}
        >
          The proof is in the numbers.
        </p>
        <h2
          className="mb-16 text-center text-4xl font-bold md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          Results Across Every Pillar
        </h2>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="mb-2 text-6xl font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--m-accent)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-base font-medium"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--m-accent)' }}
          >
            See Client Results <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
