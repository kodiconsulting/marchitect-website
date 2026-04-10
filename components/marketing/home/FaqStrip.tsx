import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'How is Marchitect different from a traditional marketing agency?',
    a: "Agencies execute campaigns. Marchitect builds systems. We diagnose what's broken in your marketing infrastructure, install the processes and tools that fix it, and train your team to run it — so it keeps working after our engagement ends.",
  },
  {
    q: 'What size company is Marchitect designed for?',
    a: 'We work best with growth-stage brands doing $2M–$30M in revenue that have marketing activity but lack the systems to scale it. You have the energy and budget — we provide the architecture.',
  },
  {
    q: 'How long does a typical engagement take?',
    a: 'The initial diagnostic takes 2 weeks. A full system installation typically runs 90–120 days depending on scope. Ongoing enablement is structured in 3-month sprints.',
  },
  {
    q: 'Where do we start?',
    a: "With the Assessment. It takes 5 minutes and gives you an immediate picture of where your marketing architecture is strong and where it's breaking down. From there, we schedule a call to walk through your results.",
  },
  {
    q: 'Does Marchitect do execution, or just strategy?',
    a: "Both. We build the strategy and the infrastructure — and we can embed execution resources through our network of vetted specialists. We don't hand you a deck and walk away.",
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
