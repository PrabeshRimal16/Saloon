/**
 * lib/supabase.ts
 *
 * Exports two Supabase client factories:
 *  - createClient()            → browser-side (use in 'use client' components)
 *  - createServerSupabaseClient() → server-side (use in Route Handlers / Server Components)
 *
 * Uses @supabase/ssr which handles cookie-based auth session management.
 */

// ─── Environment variable validation ─────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Browser client (Client Components) ──────────────────────────────────────
import { createBrowserClient } from '@supabase/ssr';

/**
 * Call this inside a Client Component to get a Supabase client.
 * Creates a new instance per call (memoize inside components if needed).
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ─── Server client (Route Handlers / Server Components) ──────────────────────
// NOTE: createServerSupabaseClient is defined in lib/supabase.server.ts
// to avoid issues with next/headers being imported at the module level
// inside Client Component bundles.
export { createServerSupabaseClient } from './supabase.server';
