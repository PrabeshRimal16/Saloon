/**
 * lib/supabase.server.ts
 *
 * Server-side Supabase client using @supabase/ssr.
 * Only import this file in Server Components, Route Handlers, or middleware —
 * never in Client Components ('use client').
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase server client that reads/writes auth cookies.
 * Must be called inside an async request context (Route Handler, Server Action, etc.)
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore.
          // Middleware handles session refresh.
        }
      },
    },
  });
}
