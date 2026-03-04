"use client";

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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
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
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  // OAuth handler for Google and Apple sign-in.
  // signInWithOAuth redirects the user to the provider's consent screen,
  // then back to our /auth/callback route which exchanges the code for a session.
  const handleOAuthLogin = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-white/50 underline-offset-4 hover:underline"
                  >
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

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                >
                  Login with Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthLogin("apple")}
                >
                  Login with Apple
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-white underline-offset-4 hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
