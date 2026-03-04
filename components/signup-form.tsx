"use client";

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
import { useState } from "react";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // After email signup, Supabase sends a confirmation email.
  // We show a "check your email" message instead of redirecting.
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // signUp creates the user in Supabase and sends a confirmation email.
    // The user won't have an active session until they confirm their email.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // The confirmation email link will redirect here after Supabase verifies it
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setConfirmationSent(true);
  };

  const handleOAuthSignup = async (provider: "google" | "apple") => {
    // OAuth signup and login are the same flow — Supabase auto-creates the
    // account on first OAuth login, so we use signInWithOAuth for both.
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

  // Show confirmation message after successful email signup
  if (confirmationSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong className="text-white">{email}</strong>.
              Click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldDescription className="text-center">
              Already confirmed?{" "}
              <Link href="/login" className="text-white underline-offset-4 hover:underline">
                Log in
              </Link>
            </FieldDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignup}>
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Sign up"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthSignup("google")}
                >
                  Sign up with Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleOAuthSignup("apple")}
                >
                  Sign up with Apple
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white underline-offset-4 hover:underline">
                    Log in
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
