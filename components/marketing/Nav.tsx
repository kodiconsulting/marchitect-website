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
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled || menuOpen ? 'rgba(7, 8, 15, 0.9)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
          borderBottom: scrolled || menuOpen
            ? '1px solid var(--m-border)'
            : '1px solid transparent',
          transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            background: 'var(--m-bg)',
            borderRadius: '4px',
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/marchitect-logo.png"
            alt="Marchitect"
            style={{
              height: '22px',
              width: 'auto',
              mixBlendMode: 'screen',
              display: 'block',
            }}
          />
        </a>

        {/* Desktop center links */}
        <div
          style={{
            alignItems: 'center',
            gap: '36px',
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
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
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

        {/* Desktop CTAs */}
        <div className="hidden md:flex" style={{ flexShrink: 0, gap: '8px', display: 'flex', alignItems: 'center' }}>
          <Link href="/login" className="btn-login">
            Log In
          </Link>
          <Link
            href="/assessment"
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            Identify Your Marketing Gaps Now <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--m-text)',
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
            backgroundColor: 'rgba(7, 8, 15, 0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            paddingTop: '80px',
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
            className="btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Identify Your Marketing Gaps Now <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  )
}
