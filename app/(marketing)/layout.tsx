import type { ReactNode } from 'react'

// Nav and Footer will be created in Task 2.
// Placeholder divs allow the build to succeed now.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Nav placeholder — replaced in Task 2 */}
      <div id="nav-placeholder" />
      {children}
      {/* Footer placeholder — replaced in Task 2 */}
      <div id="footer-placeholder" />
    </>
  )
}
