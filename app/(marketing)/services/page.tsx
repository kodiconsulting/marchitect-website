import type { Metadata } from 'next'
import ServicesHero from '@/components/marketing/services/ServicesHero'
import CategoryStrip from '@/components/marketing/services/CategoryStrip'
import ExecutionFraming from '@/components/marketing/services/ExecutionFraming'
import ServiceBlocks from '@/components/marketing/services/ServiceBlocks'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export const metadata: Metadata = {
  title: 'Services | Marchitect',
  description:
    'Optional execution services to implement your Marchitect marketing framework — design, development, campaigns, SEO, copywriting, email, and more.',
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <CategoryStrip />
      <ExecutionFraming />
      <ServiceBlocks />
      <ClosingCta heading="Start with the Assessment — execution scope comes after." />
    </>
  )
}
