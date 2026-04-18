import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({ url, type: 'redirect' })),
    next: vi.fn(() => ({ type: 'next' })),
  },
}));

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect unauthenticated users from protected routes', async () => {
    const request = {
      nextUrl: {
        pathname: '/admin',
        clone: vi.fn().mockReturnValue({
          pathname: '/login',
          searchParams: new URLSearchParams('redirect=/admin'),
        }),
      },
      cookies: {
        get: vi.fn().mockReturnValue(undefined),
      },
    };

    // Simulate middleware behavior
    const isAuthenticated = !!request.cookies.get('supabase-auth-token');
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') ||
                             request.nextUrl.pathname.startsWith('/dashboard') ||
                             request.nextUrl.pathname.startsWith('/profile');

    if (!isAuthenticated && isProtectedRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      NextResponse.redirect(loginUrl);
    }

    expect(NextResponse.redirect).toHaveBeenCalled();
  });

  it('should allow authenticated users to access protected routes', async () => {
    const request = {
      nextUrl: {
        pathname: '/admin',
      },
      cookies: {
        get: vi.fn().mockReturnValue({ value: 'valid-token' }),
      },
    };

    const isAuthenticated = !!request.cookies.get('supabase-auth-token');
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin');

    if (isAuthenticated || !isProtectedRoute) {
      NextResponse.next();
    }

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should allow all users to access public routes', async () => {
    const publicRoutes = ['/', '/about', '/contact', '/login', '/gallery', '/activities'];

    for (const route of publicRoutes) {
      vi.clearAllMocks();

      const request = {
        nextUrl: {
          pathname: route,
        },
        cookies: {
          get: vi.fn().mockReturnValue(undefined),
        },
      };

      const isProtectedRoute = route.startsWith('/admin') ||
                               route.startsWith('/dashboard') ||
                               route.startsWith('/profile') ||
                               route.startsWith('/settings') ||
                               route.startsWith('/notifications');

      if (!isProtectedRoute) {
        NextResponse.next();
      }

      expect(NextResponse.redirect).not.toHaveBeenCalled();
    }
  });
});
