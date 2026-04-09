import type { ReactNode } from 'react'
import Link from 'next/link'

export default function SurveysLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header
        style={{
          backgroundColor: 'var(--m-bg-card)',
          borderBottom: '1px solid var(--m-border)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            color: 'var(--m-text)',
            fontWeight: 700,
            fontSize: '1.125rem',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Marchitect
        </Link>
        <Link
          href="/"
          style={{
            color: 'var(--m-text-secondary)',
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          ← Exit
        </Link>
      </header>
      {children}
    </>
  )
}
