// Browser-side Supabase client
// Used in Client Components (components with "use client" directive).
// This client runs in the browser and uses the anon key, which is safe to expose
// because Supabase enforces Row Level Security (RLS) on the server side.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
