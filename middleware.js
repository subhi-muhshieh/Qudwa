import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // ✅ Create res once — never recreate inside cookie handlers
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // ✅ Mutate the EXISTING res instead of recreating it
          // Recreating res was discarding previously set cookie chunks,
          // causing Supabase to receive a partial/corrupted session string
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          req.cookies.set({ name, value: '', ...options });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = req.nextUrl.pathname;

  // ── 1. Admin routes ───────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // ── 2. Protected user routes ──────────────────────────────────
  const protectedPaths = ['/dashboard', '/settings', '/profile'];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // ── 3. Redirect authenticated users away from login/landing ───
  if ((pathname === '/login' || pathname === '/') && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/login',
  ],
};