import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'
import WhyMarketingFails from '@/components/marketing/home/WhyMarketingFails'
import SystemOverview from '@/components/marketing/home/SystemOverview'
import StatsBanner from '@/components/marketing/home/StatsBanner'
import ProblemBlock from '@/components/marketing/home/ProblemBlock'
import SolutionBlock from '@/components/marketing/home/SolutionBlock'
import KpiCards from '@/components/marketing/home/KpiCards'
import FrameworkTeaser from '@/components/marketing/home/FrameworkTeaser'
import WhoItsFor from '@/components/marketing/home/WhoItsFor'
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
      <ProblemBlock />
      <SolutionBlock />
      <KpiCards />
      <FrameworkTeaser />
      <WhoItsFor />
      <FaqStrip />
      <ClosingCta />
    </>
  )
}
