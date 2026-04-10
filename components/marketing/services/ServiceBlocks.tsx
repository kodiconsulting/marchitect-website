const services = [
  {
    number: '01',
    title: 'Design',
    description:
      'Premium creative built to communicate your positioning clearly and drive your defined conversion events. Designed to match your brand standards, your offer, and the funnel stage — so every asset has an economic purpose.',
    tags: ['Brand', 'Web', 'Ads', 'CRO', 'Systems', 'Templates', 'QA'],
  },
  {
    number: '02',
    title: 'Development',
    description:
      'Conversion-first development for websites, landing pages, funnels, and tracking foundations. Built with clean handoffs, consistent naming conventions and UTM structure, and QA standards so results are measurable and maintainable.',
    tags: ['Web', 'Landing Pages', 'Funnels', 'Tracking', 'Speed', 'QA', 'Integrations'],
  },
  {
    number: '03',
    title: 'Campaign Management',
    description:
      'Paid and outbound campaigns executed to the framework: clear objectives, defined conversion events, disciplined creative testing, and reporting that ties spend to pipeline and revenue — not vanity metrics.',
    tags: ['Paid Media', 'Testing', 'Offers', 'UTMs', 'Reporting', 'Attribution', 'Optimization'],
  },
  {
    number: '04',
    title: 'SEO',
    description:
      'Search strategy aligned to your funnel and business objectives — not just keyword rankings. Technical, on-page, and content work designed to drive qualified traffic and support conversion goals.',
    tags: ['Technical', 'On-page', 'Content', 'Intent', 'CRO', 'Tracking', 'Reporting'],
  },
  {
    number: '05',
    title: 'Copywriting',
    description:
      'Message-first copy built on the positioning and offer work done in the framework. Every piece — ads, landing pages, emails, scripts — is written to convert at the right funnel stage, not just to sound good.',
    tags: ['Messaging', 'Offers', 'Landing Pages', 'Ads', 'Email', 'Scripts', 'Proof'],
  },
  {
    number: '06',
    title: 'Photography + Videography',
    description:
      'Brand and performance creative that does a job. Shot and edited to spec — assets that prove your product or service and move people through the funnel, not just fill an Instagram grid.',
    tags: ['Brand Proof', 'Short-form', 'Testimonials', 'Product', 'Editing', 'Library'],
  },
  {
    number: '07',
    title: 'Email Marketing',
    description:
      'Strategy, segmentation, and execution for the full email channel — from nurture sequences and reactivation campaigns to transactional flows and list health. Designed to work alongside paid acquisition, not in a silo.',
    tags: ['Nurture', 'Segmentation', 'Deliverability', 'Automations', 'Offers', 'Reporting'],
  },
  {
    number: '08',
    title: 'AI + CRM Implementation',
    description:
      'AI and CRM tools implemented to the framework — not as isolated experiments, but as integrated systems that feed your reporting and support your defined conversion events.',
    tags: ['CRM', 'Automations', 'Routing', 'Dashboards', 'AI', 'SOPs', 'Integrations'],
  },
  {
    number: '09',
    title: 'EOS Implementation',
    description:
      'Entrepreneurial Operating System implementation for marketing departments that need operational structure beyond the framework. Rocks, scorecards, cadence, accountability, and process documentation.',
    tags: ['Rocks', 'Scorecards', 'Cadence', 'Ownership', 'Process', 'Accountability'],
  },
  {
    number: '10',
    title: 'List Acquisition',
    description:
      'Targeted prospect list building aligned to your ICP definitions. Data quality, segmentation, enrichment, and compliance built in — not an afterthought.',
    tags: ['ICP', 'Data Quality', 'Segments', 'Enrichment', 'Compliance', 'Testing'],
  },
]

export default function ServiceBlocks() {
  return (
    <div>
      {services.map((service, index) => {
        const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        return (
          <section key={service.number} aria-label={service.title} className={`${bgClass} py-16`}>
            <div className="mx-auto max-w-4xl px-6">
              <div className="flex items-start gap-6">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
                  style={{ backgroundColor: 'rgba(107, 92, 231, 0.12)', color: 'var(--m-accent)' }}
                >
                  {service.number}
                </div>
                <div className="flex-1">
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">{service.title}</h2>
                  <p className="mb-6 text-base leading-relaxed text-gray-600">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1 text-xs font-medium text-gray-600"
                        style={{ backgroundColor: 'rgba(107, 92, 231, 0.06)', border: '1px solid rgba(107, 92, 231, 0.12)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
