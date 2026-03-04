"use client";

// Signup page using Supabase's built-in Auth UI component.
// After signing up with email/password, Supabase sends a confirmation email
// by default. The Auth UI component automatically shows a "Check your email"
// message — we don't need to handle that ourselves.

// For OAuth (Google/Apple), the signup flow is identical to the login flow —
// the user is redirected to the provider, then back to /auth/callback.
// Supabase automatically creates the account on first OAuth login.

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  // Redirect to dashboard if the user completes signup via OAuth
  // (email signups require email confirmation first, so SIGNED_IN won't fire immediately)
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
          Create your Sidekick account
        </h1>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["google", "apple"]}
          // Show the sign-up form instead of the default sign-in form
          view="sign_up"
          // Same redirect URL as login — OAuth callback is shared for both flows
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        />

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline hover:opacity-80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
