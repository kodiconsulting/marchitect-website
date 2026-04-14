import Link from 'next/link'

interface ClosingCtaProps {
  heading?: string
  body?: string
}

export default function ClosingCta({
  heading = 'Ready to Stop Guessing?',
  body = 'Take the 5-minute assessment to find out exactly where your marketing architecture is breaking down.',
}: ClosingCtaProps) {
  return (
    <section aria-label="Call to action" className="py-24" style={{ backgroundColor: 'var(--m-bg)' }}>
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: 'var(--m-text)' }}
        >
          {heading}
        </h2>
        <p
          className="mb-10 text-lg leading-relaxed"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          {body}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/assessment" className="btn-primary">
            See Where Your Marketing Gaps Are <span aria-hidden="true">→</span>
          </Link>
          <Link href="/contact" className="btn-secondary">
            Book a Call
          </Link>
        </div>
      </div>
    </section>
  )
}
