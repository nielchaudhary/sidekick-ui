"use client";

// Login page using Supabase's built-in Auth UI component.
// The <Auth /> component renders a full sign-in form with email/password
// and OAuth buttons — no need to build form UI from scratch.

// GOOGLE OAUTH SETUP:
// 1. Go to Google Cloud Console → APIs & Services → Credentials
// 2. Create an OAuth 2.0 Client ID (Web application type)
// 3. Add your Supabase callback URL as an Authorized Redirect URI:
//    https://<your-project-ref>.supabase.co/auth/v1/callback
// 4. Copy the Client ID and Client Secret
// 5. Go to Supabase Dashboard → Authentication → Providers → Google
// 6. Enable it and paste the Client ID and Client Secret

// APPLE OAUTH SETUP:
// Requires an Apple Developer account ($99/year).
// Follow the Supabase guide for the full setup process:
// https://supabase.com/docs/guides/auth/social-login/auth-apple

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  // Listen for auth state changes — when the user successfully signs in,
  // redirect them to the dashboard. This fires for both email/password
  // and OAuth flows (OAuth returns here after the callback route sets the session).
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-2xl font-bold text-white">
          Sign in to Sidekick
        </h1>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["google", "apple"]}
          // view="sign_in" is the default, but we set it explicitly for clarity
          view="sign_in"
          // redirectTo tells OAuth providers where to send the user after they
          // authenticate. This MUST point to our /auth/callback route which
          // exchanges the code for a session. Using the env variable ensures
          // it works in both local dev and production.
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        />

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white underline hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
