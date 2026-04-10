export default function ContactHero() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1
          className="mb-6 text-6xl font-extrabold leading-tight tracking-tight md:text-7xl"
          style={{ color: 'var(--m-text)' }}
        >
          Let&apos;s talk.
        </h1>
        <p
          className="text-xl leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          Book a free 30-minute call with Michael. No pitch — just a real conversation about your
          marketing situation and whether Marchitect can help.
        </p>
      </div>
    </section>
  )
}
