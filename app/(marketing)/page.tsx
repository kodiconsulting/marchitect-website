import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'
import ProblemBlock from '@/components/marketing/home/ProblemBlock'
import SolutionBlock from '@/components/marketing/home/SolutionBlock'
import KpiCards from '@/components/marketing/home/KpiCards'
import FrameworkTeaser from '@/components/marketing/home/FrameworkTeaser'
import Testimonials from '@/components/marketing/home/Testimonials'
import FaqStrip from '@/components/marketing/home/FaqStrip'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <ProblemBlock />
      <SolutionBlock />
      <KpiCards />
      <FrameworkTeaser />
      <Testimonials />
      <FaqStrip />
      <ClosingCta />
    </>
  )
}
