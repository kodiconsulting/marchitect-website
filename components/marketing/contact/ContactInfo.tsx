export default function ContactInfo() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Email
            </p>
            <a
              href="mailto:hello@marchitect.com"
              className="text-sm font-medium text-gray-700 hover:underline"
            >
              hello@marchitect.com
            </a>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Based in
            </p>
            <p className="text-sm font-medium text-gray-700">Denver, CO</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Response time
            </p>
            <p className="text-sm font-medium text-gray-700">Within 1 business day</p>
          </div>
        </div>
      </div>
    </div>
  )
}
