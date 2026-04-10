import ResultsHero from '@/components/marketing/results/ResultsHero'
import KpiBanner from '@/components/marketing/results/KpiBanner'
import CaseStudy from '@/components/marketing/results/CaseStudy'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export const metadata = {
  title: 'Results | Marchitect',
  description:
    'Real revenue outcomes from Marchitect engagements — Hardwood Bargains, BMI of Texas, and a CBD sleep brand built from scratch.',
}

export default function ResultsPage() {
  return (
    <>
      <ResultsHero />
      <KpiBanner />
      <CaseStudy
        eyebrow="Case Study 01"
        company="Hardwood Bargains"
        category="High-ticket ecommerce (flooring)"
        heading="From $40,000 to $1 million per month in 18 months"
        context="Hardwood Bargains sold premium hardwood flooring online. They had an existing customer base and some marketing activity, but growth had plateaued. Leadership knew they needed to scale but didn't have a clear path forward — just a collection of vendors and tactics that weren't adding up to a system."
        problem="The company had no coherent strategy for cold traffic. Their offers were structured for warm, already-interested buyers, not for people encountering the brand for the first time. Messaging was generic. The funnel had significant drop-off points that nobody had diagnosed. Budget was being spent against channels that weren't producing trackable return."
        solution="The engagement started with a full diagnostic — offer structure, funnel analysis, messaging alignment, and channel attribution. The core finding: the upstream offer was wrong for cold traffic. The ask was too large too early, and the messaging assumed a level of intent that cold visitors didn't have. From there, the framework was installed: a new offer structure for the top of funnel, rebuilt landing pages with aligned messaging, attribution infrastructure so spend could be tracked to revenue, and an operating cadence the internal team could run. Execution followed the system."
        outcome="Over 18 months, monthly revenue grew from $40,000 to over $1,000,000 — a 25x increase. The system scaled because it was built to. When new channels were added, the attribution was ready. When campaigns were tested, the measurement was already in place."
        stats={[
          { value: '$40K → $1M/mo', label: 'Peak monthly revenue' },
          { value: '18 months', label: 'Engagement duration' },
          { value: '25x', label: 'Revenue multiple' },
        ]}
        background="white"
      />
      <CaseStudy
        eyebrow="Case Study 02"
        company="BMI of Texas"
        category="Medical weight loss (high-ticket service)"
        heading="Conversion rate from 0.4% to 7.4% — without changing the ad spend"
        context="BMI of Texas ran paid media to drive appointments at their medical weight loss clinics. They had traffic. The ads were running. But conversion was anemic — well under 1% — and cost per acquisition was unsustainable. Leadership had tried tweaking the ads with minimal improvement."
        problem="The ads were doing their job — people were clicking. The failure was happening between the click and the conversion. The landing page experience didn't match the intent or the hesitation of someone considering a high-ticket medical program. The offer structure asked for too much too fast. There was no trust bridge for a first-time, cold visitor."
        solution="A full funnel audit revealed the disconnect: the creative and landing page spoke to people who were already sold, not people who were still deciding. The positioning hadn't addressed the real objections — cost, commitment, whether the program would actually work for them. Marchitect rebuilt the offer architecture for the top of funnel: a lower-commitment first step that let prospects self-qualify, messaging that addressed the primary objections directly, and a landing page that guided rather than pushed. Attribution was instrumented so every version of the page could be measured correctly."
        outcome="Conversion rate went from 0.4% to 7.4% — an 18x improvement — without increasing ad spend. The same traffic that was previously leaving the page was now converting. Cost per acquisition dropped accordingly."
        stats={[
          { value: '0.4% → 7.4%', label: 'Conversion rate' },
          { value: '18x', label: 'CVR improvement' },
          { value: 'Same budget', label: 'No increase in ad spend' },
        ]}
        background="gray"
      />
      <CaseStudy
        eyebrow="Case Study 03"
        company="[CBD Sleep Brand]"
        category="Consumer health / ecommerce (name withheld by request)"
        heading="$0 to $800,000 per month in 6 months — built from scratch"
        context="This brand was launching a new CBD sleep product into a crowded, skeptical market. They had no existing customer base, no established channels, and a product that required real education before purchase. The clock was ticking — they needed proof of traction fast."
        problem="Launching a new product to cold traffic without brand recognition requires getting the offer and funnel structure right from day one. There's no warm list to lean on, no word-of-mouth to backstop weak conversion. Every dollar spent on acquisition has to return something. Most brands get this wrong and burn through budget before they've proven anything."
        solution="The engagement started before anything was built. Offer structure, messaging hierarchy, customer awareness sequencing, and channel prioritization were all defined first. The framework was the foundation — not an afterthought. Landing pages were built to the spec. Creative was aligned to the funnel stage. Attribution was wired in from day one so performance was visible from the first dollar spent. The operating cadence meant every week produced a decision: what to keep, what to cut, what to test next."
        outcome="The brand reached $800,000 per month in revenue within 6 months of launch — built entirely on paid acquisition against a system that was designed to scale."
        stats={[
          { value: '$0 → $800K/mo', label: 'Monthly revenue' },
          { value: '6 months', label: 'From launch to $800K/mo' },
          { value: 'Cold traffic only', label: 'No warm list or existing customers' },
        ]}
        background="white"
      />
      <ClosingCta heading="See what's breaking your marketing ROI." />
    </>
  )
}
