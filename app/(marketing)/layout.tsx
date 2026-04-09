import type { ReactNode } from 'react'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
