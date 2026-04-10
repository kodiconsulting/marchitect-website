const stats = [
  { value: '$40K → $1M/mo', label: 'Peak monthly revenue growth' },
  { value: '0.4% → 7.4%', label: 'Conversion rate improvement' },
  { value: '$550 → $70', label: 'CPL reduction' },
]

export default function KpiBanner() {
  return (
    <section
      className="border-y py-16"
      style={{
        backgroundColor: 'var(--m-bg-card)',
        borderColor: 'var(--m-border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="mb-2 text-4xl font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--m-accent)' }}
              >
                {stat.value}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
