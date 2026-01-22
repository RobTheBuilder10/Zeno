import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/accounts(.*)',
  '/transactions(.*)',
  '/bills(.*)',
  '/debts(.*)',
  '/goals(.*)',
  '/insights(.*)',
  '/world(.*)',
  '/settings(.*)',
  '/api/user(.*)',
  '/api/accounts(.*)',
  '/api/transactions(.*)',
  '/api/goals(.*)',
  '/api/insights(.*)',
])

// Routes that should redirect to dashboard if already signed in
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth()

  // Protect all protected routes - redirect to sign-in if not authenticated
  if (isProtectedRoute(req) && !session.userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(req) && session.userId) {
    const dashboardUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
