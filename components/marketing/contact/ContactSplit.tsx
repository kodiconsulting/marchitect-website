import ContactForm from './ContactForm'

export default function ContactSplit() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left — Book a Call */}
          <div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">Book a Call</h3>
            <p className="mb-8 text-base leading-relaxed text-gray-600">
              The fastest way to connect. Pick a time that works and we&apos;ll have a real
              conversation about what you&apos;re dealing with.
            </p>
            {/* Calendly embed placeholder — URL to be provided before launch */}
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-500">Calendar coming soon</p>
                <p className="text-xs text-gray-400">
                  Booking link will be embedded here before launch.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Send a Message */}
          <div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">Send a Message</h3>
            <p className="mb-8 text-base leading-relaxed text-gray-600">
              Not ready to book? Send us a note and we&apos;ll get back to you within one business
              day.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
