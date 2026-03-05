"use client";

// GOOGLE OAUTH SETUP:
// 1. Go to Google Cloud Console → APIs & Services → Credentials
// 2. Create an OAuth 2.0 Client ID (Web application type)
// 3. Add your Supabase callback URL as an Authorized Redirect URI:
//    https://<your-project-ref>.supabase.co/auth/v1/callback
// 4. Copy the Client ID and Client Secret
// 5. Go to Supabase Dashboard → Authentication → Providers → Google
// 6. Enable it and paste the Client ID and Client Secret

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLogo } from "@/components/auth-logo";
import Link from "next/link";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_error" ? "Authentication failed. Please try again." : null
  );
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // signInWithPassword sends credentials to Supabase, which returns
    // a session (access + refresh tokens) stored automatically as cookies.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Generic message prevents user enumeration (attacker learning which emails are registered)
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  // OAuth handler for Google sign-in.
  // signInWithOAuth redirects the user to Google's consent screen,
  // then back to our /auth/callback route which exchanges the code for a session.
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setError("Unable to sign in with Google. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AuthLogo />
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@sidekick.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="text-sm text-white/50 underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex flex-col gap-3 pt-1">
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
                <div className="relative flex items-center py-1">
                  <div className="grow border-t border-white/10" />
                  <span className="px-3 text-xs text-white/40">or</span>
                  <div className="grow border-t border-white/10" />
                </div>
                <Button variant="outline" type="button" onClick={handleGoogleLogin}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center pt-1">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-white underline-offset-4 hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
