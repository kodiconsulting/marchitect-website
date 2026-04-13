import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'Is Marchitect an agency?',
    a: 'No. The core engagement is strategy and systems — decision framework, playbook, success definitions, roadmap, and measurement infrastructure. Execution is handled by your existing team, your vendors, or Marchitect as a separate scope.',
  },
  {
    q: 'Who is this best for?',
    a: 'Founders and CEOs at $2M–$50M SMBs — typically in high-ticket ecommerce or service businesses — who have active marketing spend but no system governing it. The right client has tried the ad-hoc approach and is ready to build something that actually works.',
  },
  {
    q: 'Who is it NOT for?',
    a: "Companies looking for someone to run campaigns without a strategic foundation. If you want fast results without building the system first, Marchitect isn't the right fit.",
  },
  {
    q: 'Do you execute, or just advise?',
    a: 'The core engagement installs the operating system — strategy, playbook, success definitions, roadmap, attribution, and operating cadence. Execution can be handled by your internal team, your existing vendors, or Marchitect as a separate scope.',
  },
  {
    q: 'How do we get started?',
    a: 'Take the assessment. It surfaces where your marketing gaps are in about 5 minutes and gives us a grounded starting point for the diagnostic.',
  },
]

export default function FaqStrip() {
  return (
    <section aria-label="FAQ" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
          Frequently Asked Questions
        </h2>
        <Accordion className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${i}`}
              className="rounded-xl border border-gray-200 bg-white px-6"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-semibold text-gray-900">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-600">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
