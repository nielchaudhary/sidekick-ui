// Auth callback route — handles BOTH OAuth redirects AND email confirmation links.
//
// How it works:
// 1. After OAuth (Google/Apple): The provider redirects to Supabase, which then
//    redirects here with a `code` query parameter.
// 2. After email confirmation: The user clicks the link in their email, which
//    goes through Supabase and redirects here with the same `code` parameter.
//
// In both cases, we exchange the temporary `code` for a real session (access + refresh tokens)
// and set them as cookies. This is the PKCE auth flow that @supabase/ssr uses.

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    // Exchange the one-time code for a persistent session.
    // This is the critical step — without it, the user has no session.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Success — send the user to the dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // If there's no code or the exchange failed, redirect to login with an error.
  // This handles edge cases like expired codes or tampered URLs.
  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
