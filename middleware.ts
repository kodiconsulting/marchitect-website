import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
  const isLoginPage = req.nextUrl.pathname === '/login'
  const isPublicPage = req.nextUrl.pathname === '/'
  const isSeedRoute = req.nextUrl.pathname === '/api/seed' || req.nextUrl.pathname === '/seed'

  if (isAuthRoute || isLoginPage || isPublicPage || isSeedRoute) return NextResponse.next()
  if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
