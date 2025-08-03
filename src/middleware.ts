import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      // For demo purposes, allow any authenticated user to access admin
      // In production, you should check: req.nextauth.token?.role === 'ADMIN'
    }

    // Check if user is trying to access protected routes
    if (
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/cart') ||
      req.nextUrl.pathname.startsWith('/checkout') ||
      req.nextUrl.pathname.startsWith('/orders')
    ) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (
          req.nextUrl.pathname.startsWith('/auth') ||
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/products') ||
          req.nextUrl.pathname.startsWith('/api/auth')
        ) {
          return true;
        }

        // For protected routes, check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/auth/:path*',
  ],
};
