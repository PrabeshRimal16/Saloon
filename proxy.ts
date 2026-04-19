/**
 * proxy.ts  (formerly middleware.ts — renamed in Next.js 16)
 *
 * Runs on the Node.js runtime before every matched request.
 * Protects routes by checking Supabase auth session via cookies.
 *
 * Protected route rules:
 *  /dashboard/* → must be authenticated
 *  /booking     → must be authenticated
 *  /admin/*     → must be authenticated AND have role='admin'
 */
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  // We create a mutable response so we can forward refreshed auth cookies
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Propagate refreshed cookies to both request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Use getUser() — it validates the JWT with Supabase servers.
  // Do NOT use getSession() which only reads the local cookie and can be stale.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── Unauthenticated: redirect to /login ─────────────────────────────────
  if (!user) {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/booking') ||
      pathname.startsWith('/admin')
    ) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // ── Authenticated: guard admin routes ───────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      // Not an admin — send to customer dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on all paths EXCEPT:
     * - _next/static / _next/image (build assets)
     * - favicon.ico
     * - public folder image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
