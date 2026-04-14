import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'
import WhyMarketingFails from '@/components/marketing/home/WhyMarketingFails'
import SystemOverview from '@/components/marketing/home/SystemOverview'
import StatsBanner from '@/components/marketing/home/StatsBanner'
import EcosystemCard from '@/components/marketing/home/EcosystemCard'
import Testimonials from '@/components/marketing/home/Testimonials'
import AboutSplit from '@/components/marketing/home/AboutSplit'
import FaqStrip from '@/components/marketing/home/FaqStrip'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <WhyMarketingFails />
      <SystemOverview />
      <StatsBanner />
      <EcosystemCard />
      <Testimonials />
      <AboutSplit />
      <FaqStrip />
      <ClosingCta />
    </>
  )
}
