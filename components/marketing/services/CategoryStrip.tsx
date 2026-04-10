const categories = ['Design', 'Development', 'Campaigns', 'SEO', 'Copywriting', 'Email', 'Video', 'Photography', 'AI', 'CRM', 'EOS', 'List Acquisition']

export default function CategoryStrip() {
  return (
    <section aria-label="Service categories" className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600"
              style={{ backgroundColor: 'rgba(107, 92, 231, 0.08)', border: '1px solid rgba(107, 92, 231, 0.15)' }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
