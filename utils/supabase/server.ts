// Server-side Supabase client
// Used in Server Components, Route Handlers, and Server Actions.
// This client reads/writes cookies to manage the user's auth session on the server.
// We use @supabase/ssr's createServerClient which handles cookie-based auth
// automatically — this is required because the browser can't send the auth token
// via headers in server-rendered requests (unlike traditional SPAs).

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // getAll/setAll pattern is required by @supabase/ssr v0.5+
        // It reads all cookies at once for session reconstruction
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component where cookies can't be set.
            // This is safe to ignore — the middleware will handle refreshing
            // the session cookie on every request anyway.
          }
        },
      },
    }
  );
}
