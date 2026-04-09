import Hero from '@/components/marketing/home/Hero'
import TrustRow from '@/components/marketing/home/TrustRow'
import ProblemBlock from '@/components/marketing/home/ProblemBlock'
import SolutionBlock from '@/components/marketing/home/SolutionBlock'
import KpiCards from '@/components/marketing/home/KpiCards'
import FrameworkTeaser from '@/components/marketing/home/FrameworkTeaser'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <ProblemBlock />
      <SolutionBlock />
      <KpiCards />
      <FrameworkTeaser />
    </>
  )
}
