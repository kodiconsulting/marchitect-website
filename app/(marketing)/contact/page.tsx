import type { Metadata } from 'next'
import ContactHero from '@/components/marketing/contact/ContactHero'
import ContactSplit from '@/components/marketing/contact/ContactSplit'
import ContactInfo from '@/components/marketing/contact/ContactInfo'
import ClosingCta from '@/components/marketing/shared/ClosingCta'

export const metadata: Metadata = {
  title: 'Contact | Marchitect',
  description:
    'Book a free 30-minute call with Michael or send a message. No pitch — just a real conversation about your marketing situation.',
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSplit />
      <ContactInfo />
      <ClosingCta />
    </>
  )
}
