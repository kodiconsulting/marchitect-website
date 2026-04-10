import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
  const isLoginPage = req.nextUrl.pathname === '/login'
  const { pathname } = req.nextUrl
  const isPublicPage =
    pathname === '/' ||
    pathname.startsWith('/framework') ||
    pathname.startsWith('/results') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/assessment') ||
    pathname.startsWith('/contact')
  const isSeedRoute = req.nextUrl.pathname === '/api/seed' || req.nextUrl.pathname === '/seed'

  const hasApiKey = !!req.headers.get('x-api-key')

  if (isAuthRoute || isLoginPage || isPublicPage || isSeedRoute || hasApiKey) return NextResponse.next()
  if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
