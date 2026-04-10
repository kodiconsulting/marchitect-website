import type { Metadata } from 'next'
import AboutHero from '@/components/marketing/about/AboutHero'
import AboutIntro from '@/components/marketing/about/AboutIntro'
import OriginStory from '@/components/marketing/about/OriginStory'
import Credentials from '@/components/marketing/about/Credentials'
import ApproachSteps from '@/components/marketing/about/ApproachSteps'
import Principles from '@/components/marketing/about/Principles'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export const metadata: Metadata = {
  title: 'About | Marchitect',
  description:
    'Learn about Marchitect — a marketing strategy and systems firm founded by Michael Nowotarski. We install the decision framework that makes marketing governable.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <OriginStory />
      <Credentials />
      <ApproachSteps />
      <Principles />
      <ClosingCta heading="Ready to stop guessing?" />
    </>
  )
}
