'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Framework', href: '/framework' },
  { label: 'Results', href: '/results' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navBg = scrolled || menuOpen
    ? 'var(--m-bg-card)'
    : 'transparent'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: navBg,
          borderBottom: scrolled || menuOpen
            ? '1px solid var(--m-border)'
            : '1px solid transparent',
          transition: 'background-color 0.25s ease, border-color 0.25s ease',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: 'var(--m-text)',
            fontWeight: 800,
            fontSize: '1.25rem',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          Marchitect
        </Link>

        {/* Desktop center links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? 'var(--m-text)' : 'var(--m-text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--m-text)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--m-text-secondary)'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex" style={{ flexShrink: 0 }}>
          <Link
            href="/assessment"
            style={{
              backgroundColor: 'var(--m-accent)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            Take Assessment <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--m-text)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--m-text)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--m-text)',
              transition: 'opacity 0.2s ease',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--m-text)',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'var(--m-bg-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            paddingTop: '64px',
          }}
          className="md:hidden"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: isActive ? 'var(--m-text)' : 'var(--m-text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/assessment"
            onClick={() => setMenuOpen(false)}
            style={{
              backgroundColor: 'var(--m-accent)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              marginTop: '1rem',
            }}
          >
            Take Assessment →
          </Link>
        </div>
      )}
    </>
  )
}
