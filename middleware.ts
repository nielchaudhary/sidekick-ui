// Middleware runs on EVERY request before it reaches the page.
// Two critical jobs:
// 1. Refresh the auth session token — Supabase JWTs expire, and the middleware
//    silently refreshes them by reading/writing cookies on each request.
//    Without this, users get logged out after the JWT expires (~1 hour).
// 2. Protect routes — redirect unauthenticated users away from protected pages.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Start with a basic response that passes through the request
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Create a Supabase client that can read/write cookies on the request/response.
  // This is the ONLY way to refresh the session in middleware because we need
  // access to both the incoming cookies (to read the session) and the outgoing
  // response (to set the refreshed session cookie).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request (for downstream server components)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Also set cookies on the response (so the browser gets the updated session)
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT remove this getUser() call.
  // Even though we don't always use the result, calling getUser() triggers
  // the session refresh. Without it, the session cookie never gets updated
  // and users will be silently logged out when their JWT expires.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: /dashboard and anything under /app/*
  // If the user is not logged in, redirect them to the login page.
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/chat") ||
    request.nextUrl.pathname.startsWith("/app");

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

// Only run middleware on pages, not on static files or API routes.
// This matcher excludes Next.js internals and common static file extensions.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
